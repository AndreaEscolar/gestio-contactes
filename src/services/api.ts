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
    getAll: async ():
        Promise<Contact[]> => (await api.get<Contact[]>('/contacts')).data,

    getById: async (id: number): Promise<Contact> => 
        (await api.get<Contact>(`/contacts/${id}`)).data,

    create: async (form: ContactForm): Promise<Contact> =>  {
        const payload = {
            ...form,
            createdAt: new Date().toISOString()
        }

        return ( await api.post<Contact>('/contacts', payload)).data
    },

    update: async (id: number, form: ContactForm): Promise<Contact> => 
        (await api.put<Contact>(`/contacts/${id}`, form)).data,
    
    delete: async (id:number): Promise<void> => {
        await api.delete(`/contacts/${id}`)
    },

    toggleFavorite: async (contact: Contact): Promise<Contact> => 
        (await api.patch<Contact>(`/contacts/${contact.id}`, {
            favorite: !contact.favorite
        })).data,
    
}

export const groupsApi = {
    getAll: async (): Promise<Group[]> => 
       (await api.get<Group[]>('/groups')).data,

    create: async (data: Omit<Group, 'id'>): Promise<Group> =>
        (await api.post<Group>('/groups', data)).data,

    update: async (id: number, data: Partial<Group>): Promise<Group> =>
        (await api.put<Group>(`/groups/${id}`, data)).data,

    delete: async (id: number): Promise<void> => { 
        await api.delete(`/groups/${id}`)
    },
}

export const historyApi = {
    getAll: async (): Promise<CallHistory[]> => 
        (await api.get<CallHistory[]>('/history?_sort=date&_order=desc')).data
}