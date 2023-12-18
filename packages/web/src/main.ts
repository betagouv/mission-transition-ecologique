import { type Component, createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import WebApp from '@/WebApp.vue'
import VueDsfr from '@gouvminint/vue-dsfr'
// Styles imports
import './assets/main.css'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import { listIcons } from '@/icons'

const store = createPinia()

const app = createApp(WebApp as Component)

app.use(VueDsfr, { icons: listIcons() })
app.use(store)
app.use(router)
app.mount('#app')
