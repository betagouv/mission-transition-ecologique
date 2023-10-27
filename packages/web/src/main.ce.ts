// import { createApp, defineCustomElement } from 'vue'
import { createPinia } from 'pinia'
import { defineCustomElement } from './defineCustomElementWithStyles'
import { createRouter, createWebHistory } from 'vue-router'

// import App from './App.ce.vue'
import TeeApp from './TeeApp.ce.vue'
// console.log('TeeApp.styles :', TeeApp.styles) // ["/* inlined css */"]

// Import dsfr
// cf : https://vue-dsfr.netlify.app/?path=/docs/composants-tuile-dsfrtile--docs
// cf : https://vue-dsfr.netlify.app/?path=/docs/docs-2-guide-d-utilisation--docs#vue3
import VueDsfr from '@gouvminint/vue-dsfr'   // Import (par défaut) de la bibliothèque

// import more icons
// cf: https://oh-vue-icons.js.org/docs
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import * as RiIcons from 'oh-vue-icons/icons/ri' // all remix icons
import {
  // LaCircle,
  // LaDotCircle,
  MdRadiobuttonchecked,
  MdRadiobuttonunchecked,
  MdCheckboxoutlineblank,
  MdCheckboxOutlined,
} from 'oh-vue-icons/icons'
const Ri = Object.values({ ...RiIcons })
// console.log('TeeApp > main.ce.ts > Ri :', Ri)
addIcons(
  ...Ri, 
  // LaCircle, 
  // LaDotCircle,
  MdRadiobuttonchecked,
  MdRadiobuttonunchecked,
  MdCheckboxoutlineblank,
  MdCheckboxOutlined,
)

// Instantiate router
const router = createRouter({
  history: createWebHistory(),
  routes: []
})

// Styles imports
// import './assets/main.css'

// import '@gouvfr/dsfr/dist/core/core.main.min.css'            // Le CSS minimal du DSFR
// import '@gouvfr/dsfr/dist/component/component.main.min.css'  // Styles de tous les composants du DSFR
// import '@gouvfr/dsfr/dist/utility/utility.main.min.css'      // Classes utilitaires : les composants de VueDsfr en ont besoin
// import '@gouvminint/vue-dsfr/styles'                         // Les styles propres aux composants de VueDsfr
// import '@gouvfr/dsfr/dist/scheme/scheme.min.css'             // Facultatif : Si les thèmes sont utilisés (thème sombre, thème clair)
// import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'       // Facultatif : Si des icônes sont utilisées avec les classes "fr-icon-..."

// About Pinia
// cf : https://rimdev.io/vue-3-custom-elements/
// cf : https://stackblitz.com/github/piniajs/example-vue-3-vite?file=src%2FApp.vue,src%2Fmain.ts,src%2Fstores%2Fuser.ts
const store = createPinia()

// about custom elements in vue3
// cf : https://maximomussini.com/posts/vue-custom-elements
// cf : https://play.vuejs.org/#eNqNUstugzAQ/JUtF1MpBeUa0UhVVKn9gfaSC4IlovJLtkGqEP/eNTZpaZoSLnjXs7MzIw/Jk9ZZ32GySwpbmVY7sOg6vT/KVmhlHAxgsNlAjU0r8dBZp8QzR4HSwQiNUQIYzbMz/qCEjv0s94Wnp+tKSeugQnj8iyv1yHtC/WzaLCBTJj4fKgKwDRF41MQl7InISF3KXpBzBe/K8PqOEaDIgxmyQYVDoXnpkCqAwnsD+koLUhlRcvDUStLC3QTIA6KYnOQXQ0EiYNC4HIk690U+n7yW8/5kk8yJrAaujerbGq+HvF2kvF3E/E80RxmZU+bQOoo0/FdSq9s+RhCT2c7R5OHq0uYkadVnKz+w+v2WbvIRIF48YQJN9BSfiOKYcXX6bt5m8HWiwhreSt7hDoYhLBnHa37HL2LEH6k=
// cf : https://levelup.gitconnected.com/how-to-use-web-components-in-vue-js-bfbd16f6b26f
// cf : https://dev.to/nurlan_tl/tips-to-create-web-components-using-vue-3-ts-vite-3a7a
const TeeAppComponent = defineCustomElement(TeeApp, {
  plugins: [
    // @ts-ignore
    { plugin: VueDsfr },
    // { plugin: VueDsfr, options: { icons: Object.values(icons) }},
    // @ts-ignore
    { plugin: store },
    { plugin: router }
  ],
  comps: [
    { name: 'v-icon', comp: OhVueIcon }
  ]
})

customElements.define('gov-aid-tree-app', TeeAppComponent)

// const app = createApp(TeeApp)
// app.use(store)
// app.mount('#app')
