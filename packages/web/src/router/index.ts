// CONSOLE LOG TEMPLATE
//console.log(`router.index > FUNCTION_NAME > MSG_OR_VALUE :`)

import { createRouter, createWebHistory } from 'vue-router'
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
import type { Component } from 'vue'
import { resetDetailProgram, resetTrackStore, setHelpAsTrackSeed, setResultsAsTrackSeed } from '@/router/hook'

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
            seed: TrackId.Help,
            disableWidget: true
          }
        }
      ]
    },
    {
      path: '/annuaire',
      component: TeeCatalogPage as Component,
      beforeEnter: [resetDetailProgram, resetTrackStore, setResultsAsTrackSeed],
      children: [
        {
          path: '',
          name: RouteName.Catalog,
          component: WidgetApp as Component,
          props: {
            seed: TrackId.Results,
            disableWidget: true
          }
        },
        {
          path: ':programId',
          name: RouteName.CatalogueDetail,
          component: TeeProgramPage as Component
        }
      ]
    },
    {
      path: '/mentions-legales',
      name: RouteName.Legal,
      component: TeeLegalPage as Component
    },
    {
      path: '/accessibilite',
      name: 'accessibility',
      component: TeeAccessibilityPage as Component
    },
    {
      path: '/donnees-personnelles',
      name: RouteName.PersonalData,
      component: TeePersonalDataPage as Component
    },
    {
      path: '/*',
      name: '404',
      component: TeeHomePage as Component
    },
    ...redirections
  ]
})
