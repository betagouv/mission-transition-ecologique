import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'

import { tracksStore } from '../stores/tracks'

import TeeHomePage from '../components/pages/TeeHomePage.vue'

import TeeQuestionnairePage from '../components/pages/TeeQuestionnairePage.vue'
import TeeCatalogPage from '../components/pages/TeeCatalogPage.vue'
import TeeProgramPage from '../components/pages/TeeProgramPage.vue'

import TeeLegalPage from '../components/pages/TeeLegalPage.vue'
import TeeAccessibilityPage from '../components/pages/TeeAccessibilityPage.vue'
import TeePersonalDataPage from '../components/pages/TeePersonalDataPage.vue'

const defaultResultsTrack = 'track_results'

const resetTrackStore = async (to: any, from: any, next: any) => {
  console.log('\nrouter > beforeEnter > resetTrackStore > from :', from)
  console.log('router > beforeEnter > resetTrackStore > to :', to)
  const tracks = tracksStore()
  await tracks.resetUsedTracks()
  next()
}
const setResultsAsTrackSeed = async (to: any, from: any, next: any) => {
  console.log('\nrouter > beforeEnter > setResultsAsTrackSeed > from :', from)
  console.log('router > beforeEnter > setResultsAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack(defaultResultsTrack)
  next()
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
      component: TeeHomePage,
      beforeEnter: [
        // resetTrackStore,
        // setResultsAsTrackSeed
      ]
    },
    { 
      path: '/questionnaire',
      name: 'questionnaire', 
      component: TeeQuestionnairePage,
      beforeEnter: [
        resetTrackStore
      ],
      // children: [
      //   {
      //     path: '/:programId',
      //     component: TeeProgramPage,
      //   }
      // ]
    },
    { 
      path: '/questionnaire/:programId',
      name: 'questionnaire-detail', 
      component: TeeProgramPage,
    },
    { 
      path: '/catalogue',
      name: 'catalog', 
      component: TeeCatalogPage,
      beforeEnter: [
        resetTrackStore,
        setResultsAsTrackSeed,
      ],
      // children: [
      //   {
      //     path: '/:programId',
      //     component: TeeProgramPage,
      //   }
      // ]
    },
    { 
      path: '/catalogue/:programId',
      name: 'catalog-detail', 
      component: TeeProgramPage,
      beforeEnter: [
        resetTrackStore,
        setResultsAsTrackSeed,
      ]
    },
    { 
      path: '/mentions-legales', 
      name: 'legal',
      component: TeeLegalPage
    },
    { 
      path: '/accessibilite', 
      name: 'accessibility',
      component: TeeAccessibilityPage
    },
    { 
      path: '/donnees-personnelles', 
      name: 'personal-data',
      component: TeePersonalDataPage
    },
    {
      path: '/*',
      name: '404', 
      component: TeeHomePage,
    }
    // { path: '/track/:trackId', component: TeeTrack },
    // { path: '/program/:programId', component: TeeProgramDetail },
  ]
})