<template>
  <div class="stats-view">
    <h1>Estadístiques</h1>
    <div v-if="loading">Carregant...</div>
    <div v-else>

      <h2>Contactes per grup</h2>
      <div class="stat-cards">
        <div v-for="g in groupsWithStats" :key="g.id" class="stat-card"
             :style="{ borderLeftColor: g.color }">
          <div class="sc-val">{{ g.count }}</div>
          <div class="sc-lbl">{{ g.name }}</div>
          <div class="sc-pct">{{ g.pct }}% del total</div>
          <div class="bar"><div class="bar-fill" :style="{ width: g.pct+'%', background: g.color }"></div></div>
        </div>
      </div>

      <h2>Contactes recents (últims 7 dies)</h2>
      <div v-if="recentContacts.length === 0" class="empty">
        Cap contacte afegit els últims 7 dies
      </div>
      <div v-else class="recent-list">
        <div v-for="c in recentContacts" :key="c.id" class="recent-item">
          <span>{{ c.firstName }} {{ c.lastName }}</span>
          <span class="recent-date">{{ formatDate(c.createdAt) }}</span>
        </div>
      </div>

      <h2>Grups disponibles</h2>
      <div class="groups-chips">
        <span v-for="g in availableGroups" :key="g.id" class="chip"
              :style="{ background: g.color + '22', color: g.color }">
          {{ g.name }}
        </span>
      </div>

      <h2>Resum general</h2>
      <div class="summary-grid">
        <div class="scard"><div class="sv">{{ contacts.length }}</div><div class="sl">Contactes totals</div></div>
        <div class="scard"><div class="sv">{{ favoriteContacts.length }}</div><div class="sl">Favorits ★</div></div>
        <div class="scard"><div class="sv">{{ groups.length }}</div><div class="sl">Grups</div></div>
        <div class="scard"><div class="sv">{{ recentContacts.length }}</div><div class="sl">Recents 7 dies</div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { contactsApi, groupsApi } from '../services/api'
import type { Contact, Group } from '../data/types'

const contacts = ref<Contact[]>([])
const groups = ref<Group[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  ;[contacts.value, groups.value] = await Promise.all([contactsApi.getAll(), groupsApi.getAll()])
  loading.value = false
})

const groupsWithStats = computed(() => {
  const total = contacts.value.length || 1
  return groups.value.map(g => {
    const count = contacts.value.filter(c => c.groupId === g.id).length
    return {
      ...g,
      count,
      pct: Math.round(count / total * 100)
    }
  })
})

const recentContacts = computed(() => {
  const limit = new Date()
  limit.setDate(limit.getDate() - 7)
  return contacts.value.filter(c => new Date(c.createdAt) > limit)
})

const availableGroups = computed(() => groups.value)

const favoriteContacts = computed(() => contacts.value.filter(c => c.favorite))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' })
}
</script>

<style scoped>
.stat-cards { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 12px; margin-bottom: 22px; }
.stat-card  { background: var(--color-surface); border: 1px solid var(--color-border); border-left: 4px solid; border-radius: var(--radius); padding: 14px; }
.sc-val { font-size: 28px; font-weight: 600; }
.sc-lbl{ font-size: 13px; color: var(--color-muted); margin: 2px 0; }
.sc-pct { font-size: 11px; color: var(--color-muted); margin-bottom: 8px; }
.bar { height: 4px; background: var(--color-border); border-radius: 2px; overflow: hidden; }
.bar-fill{ height: 100%; border-radius: 2px; }
.recent-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 22px; }
.recent-item { display: flex; justify-content: space-between; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 8px 14px; font-size: 13px; }
.recent-date { color: var(--color-muted); font-size: 11px; }
.groups-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
.chip { font-size: 12px; font-weight: 500; padding: 5px 14px; border-radius: 20px; }
.summary-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.scard { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 14px 16px; }
.sv { font-size: 24px; font-weight: 600; } .sl { font-size: 12px; color: var(--color-muted); margin-top: 4px; }
.empty { color: var(--color-muted); padding: 20px 0; margin-bottom: 22px; }
</style>