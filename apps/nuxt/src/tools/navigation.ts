import { RouteName } from '@/types'
import { RouteLocationNormalizedLoaded, RouteParamsGeneric, Router } from 'vue-router'

export default class Navigation {
  constructor(
    private _route: RouteLocationNormalizedLoaded = useRoute(),
    private _router: Router = useRouter()
  ) {}

  static toggleRegisterModal = (forceStatus?: boolean) => {
    if (import.meta.client) {
      const navigationStore = useNavigationStore()
      navigationStore.hasRegisterModal = forceStatus || !navigationStore.hasRegisterModal
      document.body.style.overflow = navigationStore.hasRegisterModal ? 'hidden' : ''
      const header = document.getElementById('tee-header')
      if (header) {
        const headerHeight = header.offsetHeight + 'px'
        document.documentElement.style.setProperty('--header-height', headerHeight)
      }
      if (navigationStore.hasRegisterModal) {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        })
      }
    }
  }

  isByRouteName(routeName: string | string[]) {
    if (Array.isArray(routeName) && this._route.name) {
      return new Set(routeName).has(this._route.name as string)
    }
    return this._route.name === routeName
  }

  isCatalogPrograms() {
    return this.isByRouteName(RouteName.CatalogPrograms)
  }

  isCatalogProjects() {
    return this.isByRouteName(RouteName.CatalogProjects)
  }

  isCatalogProjectDetail() {
    return this.isByRouteName(RouteName.CatalogProjectDetail)
  }

  isCatalogProgramDetail() {
    return this.isByRouteName([RouteName.CatalogProgramDetail, RouteName.CatalogProgramFromCatalogProjectDetail])
  }

  isCatalogAboutPrograms() {
    return this.isCatalogPrograms() || this.isCatalogProgramDetail()
  }

  isCatalogAboutProjects() {
    return this.isCatalogProjects() || this.isCatalogProjectDetail()
  }

  isCatalogList() {
    return this.isCatalogPrograms() || this.isCatalogProjects()
  }

  isCatalogDetail() {
    return this.isCatalogProgramDetail() || this.isCatalogProjectDetail()
  }

  isCatalog() {
    return this.isCatalogDetail() || this.isCatalogList()
  }

  isQuestionnaire() {
    return this.isQuestionnaireResult() || this.isQuestionnaireResultDetail()
  }

  isQuestionnaireResult() {
    return this.isByRouteName(RouteName.QuestionnaireResult)
  }

  isQuestionnaireResultDetail() {
    return this.isByRouteName([RouteName.QuestionnaireResultDetail, RouteName.ProgramFromProjectDetail, RouteName.ProjectResultDetail])
  }

  isProgramDetail() {
    return this.isCatalogProgramDetail() || this.isQuestionnaireResultDetail()
  }

  isProgramFromProject() {
    return this.isByRouteName([RouteName.ProgramFromProjectDetail, RouteName.CatalogProgramFromCatalogProjectDetail])
  }

  isStaticPage() {
    return !this.isQuestionnaire() && !this.isCatalog()
  }

  getHrefByRouteName(routeName: RouteName, params: RouteParamsGeneric = {}): string | undefined {
    if (this._router) {
      return this._router.resolve({ name: routeName, params: params }).href
    }
  }

  static hashByRouteName = (routeName: string) => {
    return `#${routeName}`
  }
}
