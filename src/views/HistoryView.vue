<template>
  <div class="history-view">
    <div class="page-header">
      <h1>Historial</h1>
      <span class="subtitle">Crides i missatges</span>
    </div>
    <div v-if="loading" class="loading">Carregant...</div>
    <div v-else class="list">
      <div v-if="historyWithContact.length === 0" class="empty">Cap entrada a l'historial</div>
      <div v-for="item in historyWithContact" :key="item.id" class="history-item">
        <div class="icon" :class="item.direction">
          <i :class="item.type === 'call' ? 'pi pi-phone' : 'pi pi-comments'"></i>
        </div>
        <div class="info">
          <div class="contact-name">
            {{ item.contact?.firstName }} {{ item.contact?.lastName }}
            <span v-if="!item.contact" class="unknown">Desconegut</span>
          </div>
          <div class="detail">
            {{ item.type === 'call' ? 'Trucada' : 'Missatge' }}
            {{ item.direction === 'incoming' ? 'entrant' : 'sortint' }}
            <span v-if="item.duration"> · {{ formatDuration(item.duration) }}</span>
          </div>
        </div>
        <div class="date">{{ formatDate(item.date) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { contactsApi, historyApi } from '../services/api'
import type { Contact, CallHistory } from '../data/types'

const history = ref<CallHistory[]>([])
const contacts = ref<Contact[]>([])
const loading = ref(false)

const historyWithContact = computed(() =>
  history.value.map(h => ({
    ...h,
    contact: contacts.value.find(c => c.id === h.contactId)
  }))
)

onMounted(async () => {
  loading.value = true;
  [history.value, contacts.value] = await Promise.all([
    historyApi.getAll(),
    contactsApi.getAll()
  ])
  loading.value = false
})

function formatDuration(s: number | null) {
  if (!s) return ''
  return `${Math.floor(s / 60)}m ${s % 60}s`
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ca-ES', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}
</script>

<style scoped>
.subtitle { font-size: 13px; color: var(--color-muted); }
.list { display: flex; flex-direction: column; gap: 8px; }
.history-item { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.icon { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon.incoming { background: #f0fdf4; color: #166534; }
.icon.outgoing { background: #eff6ff; color: #2563eb; }
.info { flex: 1; }
.contact-name { font-size: 13px; font-weight: 500; }
.detail { font-size: 11px; color: var(--color-muted); }
.date { font-size: 11px; color: var(--color-muted); white-space: nowrap; }
.unknown { color: var(--color-muted); font-style: italic; }
.empty, .loading { text-align: center; padding: 40px; color: var(--color-muted); }
</style>