import TeeHomePage from '../pages/TeeHomePage.vue'
import TeeQuestionnairePage from '../pages/TeeQuestionnairePage.vue'
import TeeCatalogPage from '../pages/TeeCatalogPage.vue'
import TeeAddProgram from '../pages/TeeAddProgram.vue'
import TeeLegalPage from '../pages/TeeLegalPage.vue'
import TeeAccessibilityPage from '../pages/TeeAccessibilityPage.vue'
import TeePersonalDataPage from '../pages/TeePersonalDataPage.vue'
import ChatAdvisorPage from '@/pages/ChatAdvisorPage.vue'
import TeeQuestionnaire from '@/components/TeeQuestionnaire.vue'
import TeeProgramDetail from '@/components/program/TeeProgramDetail.vue'
import { RouteName } from '@/types/routeType'
import { redirections } from '@/router/redirection'
import { TrackId } from '@/types'
import type { Component } from 'vue'
import { resetDetailProgram, resetTrackStore, setHelpAsTrackSeed, setResultsAsTrackSeed } from '@/router/hook'

export const routes = [
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
        component: TeeQuestionnaire as Component,
        props: {
          seed: TrackId.QuestionnaireRoute
        }
      }
    ]
  },
  {
    path: '/aides-entreprise',
    component: TeeCatalogPage as Component,
    beforeEnter: [resetDetailProgram, resetTrackStore, setResultsAsTrackSeed],
    children: [
      {
        path: '',
        name: RouteName.Catalog,
        component: TeeQuestionnaire as Component,
        props: {
          seed: TrackId.Results
        }
      },
      {
        path: ':programId',
        name: RouteName.CatalogDetail,
        component: TeeProgramDetail as Component,
        props: (route) => ({
          programId: route.params.programId as string,
          trackId: TrackId.Results
        })
      }
    ]
  },
  {
    path: '/ajouter-une-aide-entreprises',
    name: RouteName.AddProgram,
    component: TeeAddProgram as Component
  },
  {
    path: '/echanger-avec-un-conseiller',
    name: RouteName.ChatAdvisor,
    component: ChatAdvisorPage as Component
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
    path: '/:pathMatch(.*)*',
    name: '404',
    redirect: () => {
      return { name: RouteName.Homepage }
    }
  },
  ...redirections
]
