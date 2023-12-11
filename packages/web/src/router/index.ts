// CONSOLE LOG TEMPLATE
//console.log(`router.index > FUNCTION_NAME > MSG_OR_VALUE :`)

import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'

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
import { resetDetailProgram, resetTrackStore, setHelpAsTrackSeed, setResultsAsTrackSeed } from '@/router/hook'


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
            seed: TrackId.Help,
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
          name: RouteName.Catalog,
          component: WidgetApp,
          props: {
            seed: TrackId.Results,
            disableWidget: true
          }
        },
        {
          path: ':programId',
          name: RouteName.CatalogueDetail,
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
