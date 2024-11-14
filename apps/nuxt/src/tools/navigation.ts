import { RouteName } from '@/types'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

export default class Navigation {
  constructor(
    private _route: RouteLocationNormalizedLoaded = useRoute(),
    private _router: Router = useRouter()
  ) {}

  isByRouteName(routeName: string | string[]) {
    if (Array.isArray(routeName) && this._route.name) {
      return new Set(routeName).has(this._route.name as string)
    }
    return this._route.name === routeName
  }

  isCatalogProgramDetail() {
    return this.isByRouteName([RouteName.CatalogProgramDetail, RouteName.CatalogProgramFromCatalogProjectDetail])
  }

  isCatalogProjectDetail() {
    return this.isByRouteName(RouteName.CatalogProjectDetail)
  }

  static hashByRouteName = (routeName: string) => {
    return `#${routeName}`
  }
}
