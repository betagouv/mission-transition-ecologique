import ProjectApi from '@/tools/api/projectApi'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = to.name === RouteName.ProjectResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage }
  if (!to.params.projectSlug) {
    return navigateTo(redirectTo)
  }
  const projectResult = await new ProjectApi().getOne(to.params.projectSlug as string)
  if (!projectResult.isOk) {
    return navigateTo(to.name === RouteName.ProjectResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
  }
})