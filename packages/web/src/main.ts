import { type App, type Component, createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import WebApp from '@/WebApp.vue'
import VueDsfr from '@gouvminint/vue-dsfr'
import { listIcons } from '@/plugin/icons'
import Sentry from '@/plugin/sentry'
import '@gouvminint/vue-dsfr/styles'

const store = createPinia()

const app: App = createApp(WebApp as Component)

Sentry.init(app)

app.use(VueDsfr, { icons: listIcons() })
app.use(store)
app.use(router)
app.mount('#app')
