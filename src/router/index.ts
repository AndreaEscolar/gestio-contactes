import { createRouter, createWebHistory } from "vue-router";

const route = createRouter({
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
        },
        {
            path: '/groups',
            name: 'groups',
            component: () => import('../views/GroupsView.vue'),
        },
        {
            path: '/history',
            name: 'history',
            component: () => import('../views/HistoryView.vue'),
        },
        {
            path: '/stats',
            name: 'stats',
            component: () => import('../views/StatsView.vue'),
        },
        {
            path: `/:pathMatch(.*)*`,
            redirect: '/contacts'
        }
    ]
})

export default route