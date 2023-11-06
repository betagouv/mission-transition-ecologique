import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'

import TeeHome from '../components/pages/TeeHome.vue'

import TeeQuestionnaire from '../components/pages/TeeQuestionnaire.vue'
import TeeCatalog from '../components/pages/TeeCatalog.vue'
import TeeProgram from '../components/pages/TeeProgram.vue'

import TeeLegal from '../components/pages/TeeLegal.vue'
import TeeAccessibility from '../components/pages/TeeAccessibility.vue'
import TeePersonalData from '../components/pages/TeePersonalData.vue'

const resetTrackStore = (to: any) => {
  console.log('router > beforeEnter > resetTrackStore > to :', to)
}

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
      },
      beforeEnter: [
        resetTrackStore
      ]
    },
    { 
      path: '/aides/:programId',
      name: 'aides', 
      component: TeeProgram,
      meta: {
        layout: ''
      },
      beforeEnter: [
        resetTrackStore
      ]
    },
    { 
      path: '/catalogue',
      name: 'catalog', 
      component: TeeCatalog,
      meta: {
        layout: ''
      },
      beforeEnter: [
        resetTrackStore
      ]
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