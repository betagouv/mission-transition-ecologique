import type { Component } from 'vue'
import TeeAddProgram from '@/pages/TeeAddProgram.vue'
import TeeLegalPage from '@/pages/TeeLegalPage.vue'
import TeeAccessibilityPage from '@/pages/TeeAccessibilityPage.vue'
import TeePersonalDataPage from '@/pages/TeePersonalDataPage.vue'
import ChatAdvisorPage from '@/pages/ChatAdvisorPage.vue'
import { RouteName } from '@/types/routeType'
import { redirections } from '@/app-backup/router/redirection'
import TeeStatPage from '@/pages/TeeStatPage.vue'

// please edit the sitemap.ts file if you add any route starting with /
// that you don't want to be listed in the sitemap

export const routes = [
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
    name: RouteName.Accessibility,
    component: TeeAccessibilityPage as Component
  },
  {
    path: '/donnees-personnelles',
    name: RouteName.PersonalData,
    component: TeePersonalDataPage as Component
  },
  {
    path: '/stats',
    name: RouteName.Statistics,
    component: TeeStatPage as Component
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
