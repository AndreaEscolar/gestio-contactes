<template>
  <div class="groups-view">
    <div class="page-header">
      <h1>Grups</h1>
      <Button label="Nou grup" icon="pi pi-plus" @click="openCreate" />
    </div>

    <GroupList :groups="groupsWithCount" @edit="openEdit" @delete="deleteGroup" />
    <GroupForm v-model:visible="showForm" :group="editingGroup" @save="handleSave" />

    <Toast />          
    <ConfirmDialog />  
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast  from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { contactsApi, groupsApi } from '../services/api'
import type { Group } from '../data/types'
import GroupList from '../components/groups/GroupList.vue'
import GroupForm from '../components/groups/GroupForm.vue'

const toast = useToast()
const groups = ref<Group[]>([])
const contactCounts = ref<Record<number, number>>({})
const showForm = ref(false)
const editingGroup = ref<Group | undefined>(undefined)

const groupsWithCount = computed(() => 
    groups.value.map(group => ({ ...group, count: contactCounts.value[group.id] ?? 0}))
)

onMounted(async () => {
    const [grups, contacts] = await Promise.all([groupsApi.getAll(), contactsApi.getAll()])
    groups.value = grups
    contactCounts.value = contacts.reduce((acumulador, contact) => {
        acumulador[contact.groupId] = (acumulador[contact.groupId] || 0) +1
        return acumulador
    }, {} as Record<number, number>)
})

async function createGroup(form: Omit<Group, 'id'>) {
    const nou = await groupsApi.create(form)
    groups.value.push(nou)
    showForm.value = false
    toast.add({ 
        severity: 'success', 
        summary: 'Creat', 
        detail: `Grup ${nou.name} creat`, 
        life: 3000 
    })
}

async function updateGroup(id: number, form: Omit<Group, 'id'>) {
    const updated = await groupsApi.update(id, form)
    const idx = groups.value.findIndex(group => group.id === id)
    if (idx !== -1) groups.value[idx] = updated
    showForm.value = false
}

async function deleteGroup(id: number) {
  await groupsApi.delete(id)
  groups.value = groups.value.filter(group => group.id !== id)
}

function openCreate() {
    editingGroup.value = undefined
    showForm.value = true
}

function openEdit(group: Group) {
    editingGroup.value = group
    showForm.value = true
}

function handleSave(form: Omit<Group,'id'>) {
  editingGroup.value ? updateGroup(editingGroup.value.id, form) : createGroup(form)
}
</script>