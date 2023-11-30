import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
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
import { Component } from 'vue'

const resetTrackStore = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // console.log('\nrouter > beforeEnter > resetTrackStore > from :', from)
  // console.log('router > beforeEnter > resetTrackStore > to :', to)
  const tracks = tracksStore()
  await tracks.resetUsedTracks()
  next()
}
const resetDetailProgram = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // console.log('\nrouter > beforeEnter > resetDetailProgram > from :', from)
  // console.log('router > beforeEnter > resetDetailProgram > to :', to)
  const programs = programsStore()
  programs.resetDetailResult()
  next()
}
const setHelpAsTrackSeed = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // console.log('\nrouter > beforeEnter > setHelpAsTrackSeed > from :', from)
  // console.log('router > beforeEnter > setHelpAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack(TrackId.Help)
  // await tracks.addToUsedTracks('track_help', 'track_help')
  // next({ name: 'questionnaire' })
  next()
}
const setResultsAsTrackSeed = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // console.log('\nrouter > beforeEnter > setResultsAsTrackSeed > from :', from)
  // console.log('router > beforeEnter > setResultsAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack(TrackId.Results)
  // await tracks.addToUsedTracks('track_results', 'track_results')
  // next({ name: 'catalog' })
  next()
}

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: RouteName.Homepage,
      component: TeeHomePage as Component
    },
    {
      path: '/questionnaire',
      component: TeeQuestionnairePage as Component,
      beforeEnter: [resetTrackStore, resetDetailProgram, setHelpAsTrackSeed],
      children: [
        {
          path: '',
          name: 'questionnaire',
          component: WidgetApp as Component,
          props: {
            seed: 'track_help',
            disableWidget: true
          }
        },
        {
          path: ':programId',
          name: 'questionnaire-detail',
          component: TeeProgramPage as Component
        }
      ]
    },
    {
      path: '/annuaire',
      component: TeeCatalogPage as Component,
      // component: TeeQuestionnairePage,
      beforeEnter: [resetDetailProgram, resetTrackStore, setResultsAsTrackSeed],
      children: [
        {
          path: '',
          name: 'catalog',
          component: WidgetApp as Component,
          props: {
            seed: 'track_results',
            disableWidget: true
          }
        },
        {
          path: ':programId',
          name: 'catalogue-detail',
          component: TeeProgramPage as Component
        }
      ]
    },
    {
      path: '/mentions-legales',
      name: 'legal',
      component: TeeLegalPage as Component
    },
    {
      path: '/accessibilite',
      name: 'accessibility',
      component: TeeAccessibilityPage as Component
    },
    {
      path: '/donnees-personnelles',
      name: 'personal-data',
      component: TeePersonalDataPage as Component
    },
    {
      path: '/*',
      name: '404',
      component: TeeHomePage as Component
    },
    ...redirections
    // { path: '/track/:trackId', component: TeeTrack },
    // { path: '/program/:programId', component: TeeProgramDetail },
  ]
})
