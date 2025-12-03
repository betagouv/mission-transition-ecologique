import Config from '@/config'
import { RouteName, TrackId } from '@/types'
import { RouteLocationNormalizedLoaded, RouteParamsGeneric, Router } from 'vue-router'
import { Scroll } from './scroll/scroll'

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

      const navigation = Navigation.getInstance()
      if (!navigationStore.hasRegisterModal && navigation._route.hash) {
        Scroll.toHashWithRetries(navigation._route.hash)
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

  isAboutPage() {
    return this.isByRouteName(RouteName.About)
  }

  isSitemapPage() {
    return this.isByRouteName(RouteName.SitemapPage)
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

  isQuestionnaireProgramDetail() {
    return this.isByRouteName([RouteName.ProgramResultDetail, RouteName.ProgramFromProjectResultDetail])
  }

  isProgramFromProject() {
    return this.isByRouteName([RouteName.ProgramFromProjectResultDetail, RouteName.CatalogProgramFromCatalogProjectDetail])
  }

  isStaticPage() {
    return !this.isQuestionnaire() && !this.isCatalog()
  }

  getHrefByRouteName(routeName: RouteName, params: RouteParamsGeneric = {}): string | undefined {
    if (this._router) {
      const href = this._router.resolve({ name: routeName, params: params }).href
      return this.baseUrl ? `${this.baseUrl}${href}` : href
    }
  }

  getAbsoluteUrlByRouteName(routeName: RouteName, params: RouteParamsGeneric = {}): string | undefined {
    if (this._router) {
      return new URL(this._router.resolve({ name: routeName, params: params }).href, window.location.origin).href
    }
  }

  get baseUrl() {
    const baseUrl = Config.baseUrl
    if (baseUrl) {
      return baseUrl
    }

    if (import.meta.client) {
      return window.location.origin
    }

    return undefined
  }

  static getClassesBySideMenu(hasSideMenu: boolean) {
    return hasSideMenu
      ? 'fr-col-offset-md-3 fr-col-md-9 fr-col-justify-md--left fr-col-offset-xl-2 fr-col-xl-10 fr-col-justify--center'
      : ''
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

    if (this.isByRouteName(RouteName.Faq)) {
      if (navigationStore.isFromCtaRegisterModal) {
        useNavigationStore().setFromCtaRegisterModal(false)
        await this._router.push({
          name: RouteName.CatalogPrograms
        })
      }
    }
  }
}
