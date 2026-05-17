<template>
  <div class="groups-grid">
    <div v-for="group in groups" :key="group.id" class="group-card">
      <div class="group-top">
        <span class="dot" :style="{ background: group.color }"></span>
        <span class="group-name">{{ group.name }}</span>
      </div>
      <div class="group-count">{{ group.count }} contactes</div>
      <div class="prog">
        <div class="prog-f" :style="{ width: pct(group.count)+'%', background: group.color }"></div>
      </div>
      <div class="group-actions">
        <Button label="Editar"   text size="small" @click="emit('edit', group)" />
        <Button label="Eliminar" text size="small" severity="danger" @click="confirmDelete(group)" />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import type { GroupWithCount, Group } from '../../data/types'

const props = defineProps<{ 
    groups: GroupWithCount[] 
}>()

const emit = defineEmits<{ 
    edit: [group: Group]; delete: [id: number] 
}>()

const confirm = useConfirm()

const max = computed(() => Math.max(...props.groups.map(g => g.count), 1))

function pct(n: number) { 
    return Math.round(n / max.value * 100) 
}
function confirmDelete(g: GroupWithCount) {
  confirm.require({
    message: `Eliminar el grup "${g.name}"?`, 
    header: 'Eliminar grup',
    acceptLabel: 'Eliminar', 
    rejectLabel: 'Cancel·lar', 
    acceptClass: 'p-button-danger',
    accept: () => emit('delete', g.id)
  })
}
</script>

<style scoped>
.groups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 14px; }
.group-card  { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow); }
.group-top   { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.group-name  { font-size: 14px; font-weight: 500; }
.group-count { font-size: 12px; color: var(--color-muted); margin-bottom: 10px; }
.prog { height: 4px; background: var(--color-border); border-radius: 2px; overflow: hidden; margin-bottom: 12px; }
.prog-f { height: 100%; border-radius: 2px; transition: width .4s; }
.group-actions { display: flex; gap: 4px; }
</style>