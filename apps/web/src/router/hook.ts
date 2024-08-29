import { useProgramStore } from '@/stores/program'
import { useProjectStore } from '@/stores/project'
import { RouteName } from '@/types/routeType'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'

export default class Hook {
  static readonly resetUsedTrackStore = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useUsedTrackStore().resetUsedTracks()
    next()
  }

  static readonly resetProgramFilters = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useProgramStore().resetFilters()
    next()
  }

  static readonly resetQueries = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useNavigationStore().resetSearchParams()
    if (Hook.hasQuery(to)) {
      next({ ...to, query: undefined })
    } else {
      next()
    }
  }

  static readonly hasUsedTracks = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (useUsedTrackStore().hasUsedTracks()) {
      next()
    } else {
      next(
        to.name === RouteName.QuestionnaireResultDetail
          ? { name: RouteName.CatalogProgramDetail, params: { programId: to.params.programId } }
          : { name: RouteName.QuestionnaireStart }
      )
    }
  }

  static readonly setUsedTracks = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (Hook.hasQuery(to) && !Hook.hasNameRoute(from)) {
      useNavigationStore().setSearchParams(to.query)
      await useUsedTrackStore().setFromNavigation()
    }

    next()
  }

  static readonly hasProgram = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.params.programId && (await useProgramStore().getProgramById(to.params.programId as string)).isOk) {
      next()
    } else {
      next(to.name === RouteName.QuestionnaireResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
    }
  }

  static readonly hasProject = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.params.projectSlug && (await useProjectStore().getProjectBySlug(to.params.projectSlug as string)).isOk) {
      next()
    } else {
      next(to.name === RouteName.ProjectResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
    }
  }

  private static readonly hasQuery = (route: RouteLocationNormalized) => {
    return Object.keys(route.query).length
  }

  private static hasNameRoute(from: RouteLocationNormalized) {
    return from.name !== undefined
  }
}
