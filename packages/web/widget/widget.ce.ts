import { createPinia } from 'pinia'
import { defineCustomElement } from './defineCustomElementWithStyles'
// @ts-ignore
import WidgetApp from '@/WidgetApp.ce.vue'
import VueDsfr from '@gouvminint/vue-dsfr'
// Styles imports
import '@/assets/main.css'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import { addIcons, OhVueIcon } from '../src/icons'

addIcons()
const store = createPinia()

const WidgetAppComponent = defineCustomElement(WidgetApp, {
  plugins: [
    { plugin: VueDsfr },
    { plugin: store },
  ],
  comps: [
    { name: 'v-icon', comp: OhVueIcon }
  ]
})

customElements.define('gov-aid-tree-app', WidgetAppComponent)
