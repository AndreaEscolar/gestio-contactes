<template>
  <div class="contact-list">
    <div v-if="contacts.length === 0" class="empty-state">
      <i class="pi pi-users" style="font-size:2rem;color:var(--color-border)"></i>
      <p>Cap contacte trobat</p>
    </div>
    <div v-else class="table-wrap">
      <div class="table-head">
        <span>Contacte</span><span>Telèfon</span>
        <span>Grup</span><span>Afegit</span><span>Accions</span>
      </div>
      
      <ContactItem
        v-for="contact in contacts"
        :key="contact.id"
        :contact="contact"
        :group="getGroup(contact.groupId)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @toggle-favorite="emit('toggle-favorite', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact, Group } from '../../data/types'
import ContactItem from './ContactItem.vue'

const props = defineProps<{
  contacts: Contact[]   
  groups:   Group[]     
}>()


const emit = defineEmits<{
  edit: [contact: Contact]  
  delete: [id: number]        
  'toggle-favorite': [contact: Contact]
}>()

function getGroup(groupId: number) {
  return props.groups.find(group => group.id === groupId)
}
</script>

<style scoped>
.table-wrap  { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden; }
.table-head {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 1fr 120px;
  padding: 9px 16px;
}
.empty-state { text-align: center; padding: 60px 20px; color: var(--color-muted); display: flex; flex-direction: column; gap: 12px; align-items: center; }
</style>