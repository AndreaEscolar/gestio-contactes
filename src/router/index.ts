import { createRouter, createWebHistory } from "vue-router";
import ContactsView from "../views/ContactsView.vue";
import GroupsView from "../views/GroupsView.vue";
import HistoryView from "../views/HistoryView.vue";
import StatsView from "../views/StatsView.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/',
            redirect: '/contacts'
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: () => import('../views/ContactsView.vue'),
            meta: { title: 'Contactos'}
        },
        {
            path: '/groups',
            name: 'groups',
            component: () => import('../views/GroupsView.vue'),
            meta: { title: 'Grupos'}
        },
        {
            path: '/history',
            name: 'history',
            component: () => import('../views/HistoryView.vue'),
            meta: { title: 'Historial'}
        },
        {
            path: '/stats',
            name: 'stats',
            component: () => import('../views/StatsView.vue'),
            meta: { title: 'Estadisticas'}
        },
        {
            path: `/:pathMatch(.*)*`,
            redirect: '/contacts'
        }
    ]
})

router.afterEach(to => {
    document.title = `${to.meta.title ?? 'App'} - Gestión de Contactos`
})

export default router