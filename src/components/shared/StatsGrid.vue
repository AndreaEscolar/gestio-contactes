<template>
    <div class="stats grid">
        <div class="card">
            <div class="val">{{ total }}</div>
            <div class="lbl"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Group } from '../../data/types'
defineProps<{
  total: number; favorites: number; recent: number; groupsCount: number
  contactsByGroup: Record<number, number>; availableGroups: Group[]
}>()
</script>

<style scoped>
.stats-grid  { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 14px; }
.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 16px 18px; box-shadow: var(--shadow); }
.val { font-size: 28px; font-weight: 600; line-height: 1; }
.lbl { font-size: 12px; color: var(--color-muted); margin-top: 6px; }
.groups-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.group-chip { font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 20px; }
</style>