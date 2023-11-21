import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'
import { tracksStore } from '../stores/tracks'
import { programsStore } from '../stores/programs'

import TeeHomePage from '../pages/TeeHomePage.vue'

import WidgetApp from '../WidgetApp.ce.vue'
import TeeQuestionnairePage from '../pages/TeeQuestionnairePage.vue'
import TeeCatalogPage from '../pages/TeeCatalogPage.vue'
import TeeProgramPage from '../pages/TeeProgramPage.vue'

import TeeLegalPage from '../pages/TeeLegalPage.vue'
import TeeAccessibilityPage from '../pages/TeeAccessibilityPage.vue'
import TeePersonalDataPage from '../pages/TeePersonalDataPage.vue'
import { RouteName } from '@/types/routeType'
import { redirections } from '@/router/redirection'
import { TrackId } from '@/types'


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
  await tracks.setSeedTrack(TrackId.Help)
  // await tracks.addToUsedTracks('track_help', 'track_help')
  // next({ name: 'questionnaire' })
  await next()
}
const setResultsAsTrackSeed = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > setResultsAsTrackSeed > from :', from)
  // console.log('router > beforeEnter > setResultsAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack(TrackId.Results)
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
      name: RouteName.Homepage,
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
          component: WidgetApp,
          props: {
            seed: 'track_help',
            disableWidget: true
          }
        },
        {
          path: ':programId',
          name: 'questionnaire-detail',
          component: TeeProgramPage,
        },
      ]
    },
    {
      path: '/annuaire',
      component: TeeCatalogPage,
      // component: TeeQuestionnairePage,
      beforeEnter: [
        resetDetailProgram,
        resetTrackStore,
        setResultsAsTrackSeed,
      ],
      children: [
        {
          path: '',
          name: 'catalog',
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
    },
    ...redirections,
    // { path: '/track/:trackId', component: TeeTrack },
    // { path: '/program/:programId', component: TeeProgramDetail },
  ]
})
