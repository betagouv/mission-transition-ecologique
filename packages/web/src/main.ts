import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@gouvminint/vue-dsfr/styles'
import '@/assets/custom.css'
import '@/assets/main.scss'

import { type App, type Component, createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import WebApp from '@/WebApp.vue'
import { addIcons } from '@/plugin/icons'
import Sentry from '@/plugin/sentry'
import { createHead } from '@unhead/vue'

addIcons()

const store = createPinia()

const app: App = createApp(WebApp as Component)

Sentry.init(app)

const head = createHead()
app.use(head)
app.use(store)
app.use(router)
app.mount('#app')
