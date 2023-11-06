import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'

import { tracksStore } from '../stores/tracks'
import { programsStore } from '../stores/programs'

import TeeHomePage from '../components/pages/TeeHomePage.vue'

import WidgetApp from '../WidgetApp.ce.vue'
import TeeQuestionnairePage from '../components/pages/TeeQuestionnairePage.vue'
import TeeCatalogPage from '../components/pages/TeeCatalogPage.vue'
import TeeProgramPage from '../components/pages/TeeProgramPage.vue'
// import TeeProgramDetail from '../components/TeeProgramDetail.vue'

import TeeLegalPage from '../components/pages/TeeLegalPage.vue'
import TeeAccessibilityPage from '../components/pages/TeeAccessibilityPage.vue'
import TeePersonalDataPage from '../components/pages/TeePersonalDataPage.vue'


const resetTrackStore = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > resetTrackStore > from :', from)
  // console.log('router > beforeEnter > resetTrackStore > to :', to)
  const tracks = tracksStore()
  await tracks.resetUsedTracks()
  await next()
}
const resetDetailProgram = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > resetDetailProgram > from :', from)
  // console.log('router > beforeEnter > resetDetailProgram > to :', to)
  const programs = programsStore()
  await programs.resetDetailResult()
  await next()
}
const setHelpAsTrackSeed = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > setHelpAsTrackSeed > from :', from)
  // console.log('router > beforeEnter > setHelpAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack('track_help')
  // await tracks.addToUsedTracks('track_help', 'track_help')
  // next({ name: 'questionnaire' })
  await next()
}
const setResultsAsTrackSeed = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > setResultsAsTrackSeed > from :', from)
  // console.log('router > beforeEnter > setResultsAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack('track_results')
  // await tracks.addToUsedTracks('track_results', 'track_results')
  // next({ name: 'catalog' })
  await next()
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
      component: TeeQuestionnairePage,
      beforeEnter: [
        resetTrackStore,
        resetDetailProgram,
        setHelpAsTrackSeed,
      ],
      children: [
        {
          path: '',
          name: 'questionnaire', 
          // component: TeeQuestionnairePage,
          component: WidgetApp,
          // component: TeeProgramPage,
          props: {
            seed: 'track_help',
            disableWidget: true
          }
        },
        { 
          path: ':programId',
          name: 'questionnaire-detail', 
          // component: TeeQuestionnairePage,
          component: TeeProgramPage,
          // component: TeeProgramPage,
        },
      ]
    },
    { 
      path: '/catalogue',
      // name: 'catalog', 
      component: TeeCatalogPage,
      beforeEnter: [
        resetDetailProgram,
        resetTrackStore,
        setResultsAsTrackSeed,
      ],
      children: [
        {
          path: '',
          name: 'catalogue', 
          component: WidgetApp,
          props: {
            seed: 'track_results',
            disableWidget: true
          }
        },
        { 
          path: ':programId',
          name: 'catalogue-detail', 
          component: TeeProgramPage,
        },
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