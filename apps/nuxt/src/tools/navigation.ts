import { RouteName, TrackId } from '@/types'
import { RouteLocationNormalizedLoaded, RouteParamsGeneric, Router } from 'vue-router'

export default class Navigation {
  constructor(
    private _route: RouteLocationNormalizedLoaded = useRoute(),
    private _router: Router = useRouter()
  ) {}

  private static instance: Navigation
  static getInstance(route: RouteLocationNormalizedLoaded | undefined = undefined, router: Router | undefined = undefined) {
    if (!this.instance) {
      this.instance = new Navigation(route, router)
    }
    return this.instance
  }

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

  isByRoutePath(routePath: string | string[]) {
    if (Array.isArray(routePath) && this._route.path) {
      return new Set(routePath).has(this._route.path as string)
    }

    return this._route.path === routePath
  }

  get name() {
    return this._route.name
  }

  isHomepage() {
    return this.isByRouteName(RouteName.Homepage)
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
    return this.isQuestionnaireResult() || this.isQuestionnaireResultDetail() || this.isByRouteName(RouteName.Questionnaire)
  }

  isQuestionnaireThemeCards() {
    return this.isByRoutePath(this._router.resolve({ name: RouteName.Questionnaire, params: { trackId: TrackId.Goals } }).path)
  }

  isQuestionnaireStep() {
    return this.isByRouteName([RouteName.Questionnaire]) && !this.isQuestionnaireThemeCards()
  }

  isQuestionnaireResult() {
    return this.isByRouteName(RouteName.QuestionnaireResult)
  }

  isQuestionnaireResultDetail() {
    return this.isByRouteName([RouteName.ProgramResultDetail, RouteName.ProgramFromProjectResultDetail, RouteName.ProjectResultDetail])
  }

  isProgramDetail() {
    return this.isCatalogProgramDetail() || this.isQuestionnaireResultDetail()
  }

  isProjectDetail() {
    return this.isCatalogProjectDetail() || this.isQuestionnaireProjectDetail()
  }

  isQuestionnaireProjectDetail() {
    return this.isByRouteName(RouteName.ProjectResultDetail)
  }

  isProgramFromProject() {
    return this.isByRouteName([RouteName.ProgramFromProjectResultDetail, RouteName.CatalogProgramFromCatalogProjectDetail])
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

  async redirectAfterModal() {
    const navigationStore = useNavigationStore()
    if (this.isByRouteName(RouteName.Homepage)) {
      if (navigationStore.isFromCtaRegisterModal) {
        useNavigationStore().setFromCtaRegisterModal(false)
        await this._router.push({
          name: RouteName.CatalogProjects
        })
      }

      if (navigationStore.isFromQuestionnaireCtaRegisterModal) {
        useNavigationStore().setFromQuestionnaireCtaRegisterModal(false)
        await this._router.push({
          name: RouteName.QuestionnaireStart
        })
      }
    }
  }
}
