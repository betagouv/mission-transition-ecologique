// CONSOLE LOG TEMPLATE
// console.log(`router.redirection > FUNCTION_NAME > MSG_OR_VALUE :`)

import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/types/routeType'

export const redirections: RouteRecordRaw[] = [
  {
    path: '/comprendre',
    redirect: () => {
      return { name: RouteName.Homepage }
    }
  },
  {
    path: '/recherche:afterSearch(.*)',
    redirect: () => {
      return { name: RouteName.Homepage, query: null }
    }
  },
  {
    path: '/annuaire',
    children: [
      {
        path: '',
        redirect: () => {
          return { name: RouteName.CatalogPrograms }
        }
      },
      {
        path: ':programId',
        redirect: (route) => {
          return { name: RouteName.CatalogProgramDetail, params: { programId: route.params.programId } }
        }
      }
    ]
  }
]
