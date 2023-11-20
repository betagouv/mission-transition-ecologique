import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import WebApp from '@/WebApp.vue'
import VueDsfr from '@gouvminint/vue-dsfr'
// Styles imports
import './assets/main.css'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import { addIcons } from '@/icons'

addIcons()
const store = createPinia()

const app = createApp(WebApp)
app.use(VueDsfr)
app.use(store)
app.use(router)
app.mount('#app')
