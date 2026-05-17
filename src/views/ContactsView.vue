<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { contactsApi, groupsApi } from '../services/api'
import { validateContact, hasErrors } from '../data/validators'
import type { Contact, Group, ContactForm as ContactFormData, ValidationErrors } from '../data/types'
import ContactList from '../components/contacts/ContactList.vue'
import ContactFormDialog from '../components/contacts/ContactForm.vue'
import StatsGrid from '../components/shared/StatsGrid.vue'

const toast = useToast()
const contacts = ref<Contact[]>([])
const groups = ref<Group[]>([])
const loading = ref(false)
const formErrors = ref<ValidationErrors>({}) 
const searchQuery = ref('')
const selectedGroup = ref<number | null>(null)
const sortBy = ref<'name' | 'date'>('name')
const showForm = ref(false)
const editingContact = ref<Contact | undefined>(undefined)

const filteredContacts = computed(() => {
    let result = [...contacts.value]
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(contact =>
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query)
        )
    }
    if (selectedGroup.value !== null) {
        result = result.filter(contact => contact.groupId === selectedGroup.value)
    }

    return result.sort((a, b) => 
        sortBy.value === 'name'
        ? a.lastName.localeCompare(b.lastName)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
})

const recentContacts = computed(() => {
    const limit = new Date()
    limit.setDate(limit.getDate() - 7)
    return contacts.value.filter(contact => new Date(contact.createdAt) > limit)
})

const contactsByGroup = computed(() =>
    contacts.value.reduce((acumulacion, contact) => {
        acumulacion[contact.groupId] = (acumulacion[contact.groupId] || 0) + 1
        return acumulacion
    }, {} as Record<number, number>) 
)

const favoriteContacts = computed(() => 
    contacts.value.filter(contact => contact.favorite)
)

const availableGroups = computed(() => 
    groups.value.map(group => ({
        ...group,
        count: contactsByGroup.value[group.id] ?? 0
    }))
)

// Cargar datos
onMounted(async () => {
    loading.value = true
    try {
        [contacts.value, groups.value] = await Promise.all([
            contactsApi.getAll(),
            groupsApi.getAll()
        ])
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No s\'han pogut carregar les dades', life: 4000 })
    } finally {
        loading.value = false  
    }
})


// CRUD

async function createContact(form: ContactFormData) {
  formErrors.value = validateContact(form, contacts.value)
  if (hasErrors(formErrors.value)) return
  try {
    const nou = await contactsApi.create(form)
    contacts.value.push(nou)
    showForm.value = false
    toast.add({ 
        severity: 'success', 
        summary: 'Creat', 
        detail: `${nou.firstName} afegit`, 
        life: 3000 
    })
  } catch {
    toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: "No s'ha pogut crear", 
        life: 4000 
    })
  }
}

async function updateContact(id: number, form: ContactFormData) {
  const altres = contacts.value.filter(contact => contact.id !== id)  // exclou el propi
  formErrors.value = validateContact(form, altres)
  if (hasErrors(formErrors.value)) return
  try {
    const updated = await contactsApi.update(id, form)
    const idx = contacts.value.findIndex(c => c.id === id)
    if (idx !== -1) contacts.value[idx] = updated
    showForm.value = false
    toast.add({ 
        severity: 'success', 
        summary: 'Actualitzat', 
        detail: `${updated.firstName} desat`, 
        life: 3000 
    })
  } catch {
    toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: "No s'ha pogut actualitzar", 
        life: 4000 
    })
  }
}

async function deleteContact(id: number) {
    await contactsApi.delete(id)
    contacts.value = contacts.value.filter(contact => contact.id !== id)
    toast.add({ 
        severity: 'info', 
        summary: 'Eliminat', 
        detail: 'Contacte eliminat', 
        life: 3000 
    })
}

async function toggleFavorite(contact: Contact) {
    const updated = await contactsApi.toggleFavorite(contact)
    const idx = contacts.value.findIndex(c => c.id === contact.id)
    if (idx !== -1) contacts.value[idx] = updated
}

function openCreate() {
    editingContact.value = undefined;
    showForm.value = true
}

function openEdit(contact: Contact) {
    editingContact.value = contact
    showForm.value = true
}

function handleSave(form: ContactFormData) {
    editingContact.value
        ? updateContact(editingContact.value.id, form)
        : createContact(form)
}
</script>

<template>
  <div class="contacts-view">
    <div class="page-header">
      <h1>Contactes</h1>
      <Button label="Nou contacte" icon="pi pi-plus" @click="openCreate" />
    </div>

    <StatsGrid
        :total="contacts.length"
        :favorites="favoriteContacts.length"
        :recent="recentContacts.length"
        :groups-count="groups.length"
        :contacts-by-group="contactsByGroup"
        :available-groups="availableGroups"
    />

    <div class="filters-row">
      <InputText v-model="searchQuery" placeholder="Cerca per nom, cognom o correu..." />
      <Select v-model="selectedGroup" :options="groups" option-label="name" option-value="id"
              placeholder="Tots els grups" show-clear />
      <Select v-model="sortBy"
              :options="[{ label: 'Nom A-Z', value: 'name' }, { label: 'Més recents', value: 'date' }]"
              option-label="label" option-value="value" />
    </div>

    <div v-if="loading" class="loading-state">Carregant contactes...</div>
    <ContactList
      v-else
      :contacts="filteredContacts"
      :groups="groups"
      @edit="openEdit"
      @delete="deleteContact"
      @toggle-favorite="toggleFavorite"
    />

    <ContactFormDialog
        v-model:visible="showForm"
        :contact="editingContact"
        :groups="groups"
        :errors="formErrors"
        @save="handleSave"
    />
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.filters-row {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    align-items: center;
}
.filters-row .p-inputtext { 
    flex: 1; 
    min-width: 220px; 
}
</style>