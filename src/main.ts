import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import { Theme } from '@primevue/themes'

const app = createApp(App)

// app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark-mode'
        }
    }
})
app.use(ConfirmationService)
app.use(ToastService)

app.mount('#app')
