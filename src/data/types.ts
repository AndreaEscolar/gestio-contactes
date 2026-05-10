export interface Group {
    id: number
    name: string
    color: string
}

export interface Contact {
    id: number
    firstName: string
    lastName: string
    phone: string
    email: string
    groupId: number
    favorite: boolean
    createdAt: string
}

export interface CallHistory {
    id: number
    contactId: number 
    type: 'call' | 'message'
    direction: 'incoming' | 'outgoing'
    date: string
    duration?: number
}

// Formulario (sin id para crear un nuevo contacto)
export type ContactForm = Omit<Contact, 'id' | 'createdAt'>

// Estados error validación
export interface ValidationErrors {
    firstName?: string
    lastName?: string
    phone?: string 
    email?: string
    groupId?: string
}