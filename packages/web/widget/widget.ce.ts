import { createPinia } from 'pinia'
import { defineCustomElement } from './defineCustomElementWithStyles'
// @ts-ignore
import WidgetApp from '@/WidgetApp.ce.vue'
import VueDsfr from '@gouvminint/vue-dsfr'
// Styles imports
import '@/assets/main.css'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import { listIcons } from '../src/icons'
import Widget from '../src/utils/widget'

const store = createPinia()

Widget.is = true

const WidgetAppComponent = defineCustomElement(WidgetApp, {
  plugins: [
    { plugin: VueDsfr, options: { icons: listIcons() } },
    { plugin: store },
  ]
})

customElements.define('gov-aid-tree-app', WidgetAppComponent)
