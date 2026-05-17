<template>
    <Dialog
        :visible="visible"
        @update:visible="emit('update:visible', $event)"
        :header="isEditing ? 'Editar contacte' : 'Nou contacte'"
        :modal="true" :style="{ width: '500px' }" :draggable="false"
    >
        <div class="form-grid">
            <div class="field">
                <label>Nombre <span class="req">*</span></label>
                <InputText v-model="form.firstName" :class="{ 'p-invalid': errors.firstName}" placeholder="Nombre" />
                <small class="p-error" v-if="errors.firstName">{{  errors.firstName }}</small>
            </div>
            <div class="field">
                <label>Apellidos <span class="req">*</span></label>
                <InputText v-model="form.lastName" :class="{'p-invalid': errors.lastName }" placeholder="Apellidos" />
                <small class="p-error" v-if="errors.lastName">{{  errors.lastName }}</small>
            </div>
            <div class="field">
                <label>Teléfono <span class="req">*</span></label>
                <InputText v-model="form.phone" :class="{ 'p-invalid': errors.phone}" placeholder="+34612345678" />
                <small class="p-error" v-if="errors.phone">{{  errors.phone }}</small>
            </div>
            <div class="field">
                <label>Correo electrónico <span class="req">*</span></label>
                <InputText v-model="form.email" :class="{ 'p-invalid': errors.email }" placeholder="email@example.com" />
                <small class="p-error" v-if="errors.email">{{  errors.email  }}</small>
            </div>
            <div class="field full">
                <label>Grupo <span class="req">*</span></label>
                <Select v-model="form.groupId" :options="groups" option-label="name" option-value="id"
                placeholder="Selecciona un grup..." :class="{ 'p-invalid': errors.groupId }" />
                <small class="p-error" v-if="errors.groupId">{{  errors.groupId }}</small>
            </div>
            <div class="field full row">
                <Checkbox v-model="form.favorite" :binary="true" inputId="fav" />
                <label for="fav" style="cursor:pointer">Marcar como favorito ★</label>
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" text @click="emit('update:visible', false)" />
            <Button label="Guardar" icon="pi pi-check" @click="submit" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import type { Contact, Group, ContactForm, ValidationErrors } from '../../data/types'

const props = defineProps <{
    visible: boolean
    contact?: Contact
    groups: Group[]
    errors: ValidationErrors
}>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
    save: [form: ContactForm]
}>()

const isEditing = computed(() => !!props.contact)

const form = ref<ContactForm>(emptyForm())

function emptyForm(): ContactForm {
    return { firstName: '', lastName: '', phone: '', email: '', groupId: 0, favorite: false }
}

watch(() => props.visible, (isOpen) => {
    if (isOpen) {
        form.value = props.contact ? {...props.contact} : emptyForm()
    }
})

function submit() {
    emit('save', {...form.value})
}
</script>

<style>
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 8px 0 4px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field.full{ grid-column: 1 / -1; }
.field.row { flex-direction: row; align-items: center; gap: 10px; }
label { font-size: 12px; font-weight: 500; color: var(--color-muted); }
.req { color: var(--color-danger); }
</style>