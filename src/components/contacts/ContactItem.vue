<template>
  <div class="contact-row">

    <!-- Columna 1: avatar + nom + email -->
    <div class="contact-cell">
      <div class="avatar" :style="{ background: avatarBg, color: avatarColor }">
        {{ initials }}
      </div>
      <div>
        <div class="name">{{ contact.firstName }} {{ contact.lastName }}</div>
        <div class="email">{{ contact.email }}</div>
      </div>
    </div>

    <!-- Columna 2: telèfon -->
    <div class="phone">{{ contact.phone }}</div>

    <!-- Columna 3: badge grup -->
    <div>
      <span v-if="group" class="badge"
            :style="{ background: group.color + '22', color: group.color }">
        {{ group.name }}
      </span>
    </div>

    <!-- Columna 4: data -->
    <div class="date">{{ formattedDate }}</div>

    <!-- Columna 5: accions -->
    <div class="actions">
      <button class="fav-btn" :class="{ active: contact.favorite }"
              @click="emit('toggle-favorite', contact)">★</button>
      <Button icon="pi pi-pencil" text rounded size="small" @click="emit('edit', contact)" />
      <Button icon="pi pi-trash"  text rounded size="small" severity="danger" @click="confirmDelete" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import type { Contact, Group } from '../../data/types'

const props = defineProps<{ contact: Contact; group?: Group }>()
const emit = defineEmits<{
    edit: [contact: Contact]
    delete: [id: number]
    'toggle-favorite': [contact: Contact]
}>()

const confirm = useConfirm()

const initials = computed(() => 
    ((props.contact.firstName[0] ?? '') + (props.contact.lastName[0] ?? '')).toUpperCase()
)

const COLORS = [
  { bg: '#eff6ff', cl: '#1d4ed8' }, { bg: '#fdf4ff', cl: '#7c3aed' },
  { bg: '#fff7ed', cl: '#c2410c' }, { bg: '#f0fdf4', cl: '#166534' },
  { bg: '#fdf2f8', cl: '#9d174d' },
]
const avatarStyle = computed(() => COLORS[(props.contact.id ?? 0) % COLORS.length])
const avatarBg = computed(() => avatarStyle.value?.bg ?? '#eff6ff')
const avatarColor = computed(() => avatarStyle.value?.cl ?? '#1d4ed8')

const formattedDate = computed(() =>
    new Date(props.contact.createdAt).toLocaleDateString('es-ES', {day: '2-digit', month: 'short'})
)

function confirmDelete() {
    confirm.require({
        message: `Seguro que quieres eliminar ${props.contact.firstName} ${props.contact.lastName}?`,
        header: 'Eliminar contacte',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'CAncelar',
        acceptClass: 'p-button-danger',
        accept: () => emit('delete', props.contact.id)
    })
}
</script>

<style scoped>
.contact-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 1fr 120px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
}
.contact-row:hover { background: #fafbff; }
.contact-row:last-child { border-bottom: none; }
.contact-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
.name  { font-size: 13px; font-weight: 500; }
.email { font-size: 11px; color: var(--color-muted); margin-top: 1px; }
.phone { font-size: 13px; color: var(--color-muted); font-family: monospace; }
.date  { font-size: 12px; color: var(--color-muted); }
.badge { font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 6px; }
.actions  { display: flex; gap: 2px; align-items: center; }
.fav-btn  { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; cursor: pointer; font-size: 16px; color: var(--color-border); transition: color .15s; }
.fav-btn.active, .fav-btn:hover { color: #f59e0b; }
</style>