import axios from 'axios'
import { logger } from './logger'
import type { Contact, Group, CallHistory, ContactForm} from '../data/types'

const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 8000,
    headers: { 'Content-Type': 'application/json'}
})

api.interceptors.request.use (
    (config) => {
        logger.debug(`$config.method?.toUppercase() ${config.url}`, config.data)
        return config
    },
    (error) => {
        logger.error('Error en la petición', error)
        return Promise.reject(error)
    }
)

api.interceptors.response.use (
    (response) => {
        logger.debug(`${response.status} $response.config.url`, response.data)
        return response
    },
    (error) => {
        const status = error.response?.status
        const url = error.config?.url

        logger.error(`Error ${status} a ${url}`, error.response?.data)
        return Promise.reject(error)
    }
)

export const contactsApi = {
    getAll: () => 
        api.get<Contact[]>('/contacts').then(r => r.data),

    getById: (id: number) => 
        api.get<Contact>(`/contacts/${id}`).then(r => r.data),

    create: (data: ContactForm) => 
        api.post<Contact>(`/contacts`, {
            ...data,
            createdAt: new Date().toISOString()
        }).then(r => r.data),

    update: (id: number, data: Partial<Contact>) => 
        api.put<Contact>(`/contacts/${id}`, data).then(r => r.data),
    
    delete: (id:number) => 
        api.delete(`/contacts/${id}`).then(r => r.data),

    toggleFavorite: (contact: Contact) => 
        api.put<Contact>(`/contacts/${contact.id}`, {
            ...contact,
            favorite: !contact.favorite
        }).then(r => r.data),
    
}

export const groupsApi = {
    getAll: () => 
        api.get<Group[]>('/groups').then(r => r.data),

    create: (data: Omit<Group, 'id'>) =>
        api.post<Group>('/groups', data).then(r => r.data),

    update: (id: number, data: Partial<Group>) =>
        api.put<Group>(`/groups/${id}`, data).then(r => r.data),

    delete: (id: number) => 
        api.delete(`/groups/${id}`).then(r => r.data),
}

export const historyApi = {
    getAll: () => 
        api.get<CallHistory[]>('/history').then(r => r.data)
}