<template>
  <Dialog :visible="visible" @update:visible="emit('update:visible', $event)"
          :header="group ? 'Editar grup' : 'Nou grup'" :modal="true" :style="{ width: '380px' }">
    <div class="field">
      <label>Nom *</label>
      <InputText v-model="form.name" :class="{ 'p-invalid': nameError }" placeholder="Ex: Esport" />
      <small class="p-error" v-if="nameError">{{ nameError }}</small>
    </div>
    <div class="field">
      <label>Color</label>
      <div class="colors">
        <div v-for="c in COLORS" :key="c" class="col-opt"
             :class="{ sel: form.color === c }" :style="{ background: c }"
             @click="form.color = c"></div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel·lar" text @click="emit('update:visible', false)" />
      <Button label="Desar" @click="submit" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import type { Group } from '../../data/types'
import { validateGroup } from '../../data/validators'

const COLORS = ['#2563eb','#166534','#9d174d','#c2410c','#7c3aed','#0e7490','#854d0e','#1e293b']
const props = defineProps<{ 
    visible: boolean; group?: Group 
}>()

const emit  = defineEmits<{ 
    'update:visible': [v: boolean]
    save: [form: Omit<Group,'id'>] 
}>()

const form = ref({ 
    name: '', 
    color: '#2563eb' 
})

const nameError = ref('')

watch(() => props.visible, open => {
  if (open) {
    form.value = props.group ? { name: props.group.name, color: props.group.color } : { name: '', color: '#2563eb' }
    nameError.value = ''
  }
})

function submit() {
  const err = validateGroup(form.value.name)
  if (err) { nameError.value = err; return }
  emit('save', { ...form.value })
}
</script>


<style scoped>
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
label { font-size: 12px; font-weight: 500; color: var(--color-muted); }
.colors { display: flex; gap: 8px; flex-wrap: wrap; }
.col-opt { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: border-color .15s; }
.col-opt.sel { border-color: var(--color-text); }
</style>