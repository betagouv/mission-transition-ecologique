import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'

import { tracksStore } from '../stores/tracks'
import { programsStore } from '../stores/programs'

import TeeHomePage from '../components/pages/TeeHomePage.vue'

import TeeQuestionnairePage from '../components/pages/TeeQuestionnairePage.vue'
import TeeCatalogPage from '../components/pages/TeeCatalogPage.vue'
import TeeProgramPage from '../components/pages/TeeProgramPage.vue'
// import TeeProgramDetail from '../components/TeeProgramDetail.vue'

import TeeLegalPage from '../components/pages/TeeLegalPage.vue'
import TeeAccessibilityPage from '../components/pages/TeeAccessibilityPage.vue'
import TeePersonalDataPage from '../components/pages/TeePersonalDataPage.vue'


const resetTrackStore = async (to: any, from: any, next: any) => {
  console.log('\nrouter > beforeEnter > resetTrackStore > from :', from)
  console.log('router > beforeEnter > resetTrackStore > to :', to)
  const tracks = tracksStore()
  await tracks.resetUsedTracks()
  next()
}
const resetDetailProgram = async (to: any, from: any, next: any) => {
  console.log('\nrouter > beforeEnter > resetDetailProgram > from :', from)
  console.log('router > beforeEnter > resetDetailProgram > to :', to)
  const programs = programsStore()
  await programs.resetDetailResult()
  next()
}
const setHelpAsTrackSeed = async (to: any, from: any, next: any) => {
  console.log('\nrouter > beforeEnter > setHelpAsTrackSeed > from :', from)
  console.log('router > beforeEnter > setHelpAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack('track_help')
  tracks.addToUsedTracks('track_help', 'track_help')
  // next({ name: 'questionnaire' })
  next()
}
const setResultsAsTrackSeed = async (to: any, from: any, next: any) => {
  console.log('\nrouter > beforeEnter > setResultsAsTrackSeed > from :', from)
  console.log('router > beforeEnter > setResultsAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack('track_results')
  tracks.addToUsedTracks('track_results', 'track_results')
  // next({ name: 'catalog' })
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
      component: TeeHomePage
    },
    { 
      path: '/questionnaire',
      name: 'questionnaire', 
      component: TeeQuestionnairePage,
      beforeEnter: [
        resetTrackStore,
        resetDetailProgram,
      ],
      // children: [
      //   { 
      //     path: ':programId',
      //     name: 'questionnaire-detail', 
      //     // component: TeeQuestionnairePage,
      //     component: TeeProgramPage,
      //     // component: TeeProgramPage,
      //   },
      // ]
    },
    { 
      path: '/questionnaire/:programId',
      name: 'questionnaire-detail', 
      // component: TeeProgramPage,
      // component: TeeProgramDetail,
      component: TeeProgramPage,
      beforeEnter: [
        setHelpAsTrackSeed
      ]
    },
    { 
      path: '/catalogue',
      name: 'catalog', 
      component: TeeCatalogPage,
      beforeEnter: [
        resetDetailProgram,
        resetTrackStore,
        setResultsAsTrackSeed,
      ],
      // children: [
      //   { 
      //     path: ':programId',
      //     name: 'catalog-detail', 
      //     component: TeeCatalogPage,
      //     // component: TeeProgramPage,
      //   },
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