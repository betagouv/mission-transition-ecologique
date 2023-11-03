import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'

import TeeHome from '../components/pages/TeeHome.vue'

import TeeQuestionnaire from '../components/pages/TeeQuestionnaire.vue'
import TeeCatalog from '../components/pages/TeeCatalog.vue'

import TeeLegal from '../components/pages/TeeLegal.vue'
import TeeAccessibility from '../components/pages/TeeAccessibility.vue'
import TeePersonalData from '../components/pages/TeePersonalData.vue'
// import TeeTrack from './components/TeeTrack.vue'
// import TeeProgramDetail from './components/TeeProgramDetail.vue'

// Instantiate router
// declare module 'pinia' {
//   export interface PiniaCustomProperties {
//     router: Router;
//   }
// }
export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  },
  routes: [
    { 
      path: '/',
      name: 'homepage', 
      component: TeeHome,
      meta: {
        layout: ''
      }
    },
    { 
      path: '/questionnaire',
      name: 'questionnaire', 
      component: TeeQuestionnaire,
      meta: {
        layout: ''
      }
    },
    { 
      path: '/catalogue',
      name: 'catalog', 
      component: TeeCatalog,
      meta: {
        layout: ''
      }
    },
    { 
      path: '/mentions-legales', 
      name: 'legal',
      component: TeeLegal,
      meta: {
        layout: ''
      }
    },
    { 
      path: '/accessibilite', 
      name: 'accessibility',
      component: TeeAccessibility,
      meta: {
        layout: ''
      }
    },
    { 
      path: '/donnees-personnelles', 
      name: 'personal-data',
      component: TeePersonalData,
      meta: {
        layout: ''
      }
    },
    // { path: '/track/:trackId', component: TeeTrack },
    // { path: '/program/:programId', component: TeeProgramDetail },
  ]
})