import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware((to, from) => {
  if (
    [
      RouteName.Questionnaire,
      RouteName.QuestionnaireResult,
      RouteName.ProgramResultDetail,
      RouteName.ProjectResultDetail,
      RouteName.ProgramFromProjectResultDetail
    ].includes(from.name as RouteName)
  ) {
    useFiltersStore().resetFilters()
  }
})
