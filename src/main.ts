import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import router from './router'
import App from './App.vue'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: 'none' } } })
app.use(ConfirmationService)
app.use(ToastService)
app.use(router)

app.mount('#app')