// CONSOLE LOG TEMPLATE
// console.log(`router.redirection > FUNCTION_NAME > MSG_OR_VALUE :`)

import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/types/routeType'

export const redirections: RouteRecordRaw[] = [
  {
    path: "/comprendre",
    redirect: to => {
      return { name: RouteName.Homepage }
    },
  },
  {
    path: "/recherche:afterSearch(.*)",
    redirect: to => {
      return { name: RouteName.Homepage, query: null }
    },
  }
]
