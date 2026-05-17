import type { ContactForm, Contact, ValidationErrors, Group } from './types'

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(
  form: ContactForm,
  existingContacts: Contact[] = []
): ValidationErrors {

  const errors: ValidationErrors = {}

  if (!form.firstName.trim()) {
    errors.firstName = 'El nom és obligatori'
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = 'El nom ha de tenir mínim 2 caràcters'
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Els cognoms són obligatoris'
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = 'Els cognoms han de tenir mínim 2 caràcters'
  }

  if (!form.phone.trim()) {
    errors.phone = 'El telèfon és obligatori'
  } else if (!PHONE_REGEX.test(form.phone)) {
    errors.phone = 'Format invàlid. Exemple: +34612345678'
  } else if (existingContacts.some(c => c.phone === form.phone)) {
    errors.phone = 'Aquest telèfon ja existeix'
  }

  if (form.email && !EMAIL_REGEX.test(form.email)) {
    errors.email = 'Format de correu invàlid'
  }

  if (!form.groupId) {
    errors.groupId = 'Has de seleccionar un grup'
  }

  return errors
}

export function validateGroup(
  name: string,  
  existingGroups: Group[] = [],
  editingId?: number

): string | null {

  if(!name.trim()) {
    return 'El nombre del grupo es obligatorio'
  }

  if(name.trim().length < 2) {
    return 'Mínim 2 caracteres'
  }

  const duplicate = existingGroups.find(grup => 
    grup.name.toLowerCase() === name.trim().toLowerCase() && grup.id !== editingId
  )

  if (duplicate) {
    return 'Ya existe un grupo con este nombre'
  }

  return null
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}