import { ProjectManager } from '@/tools/project/projectManager'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = to.name === RouteName.ProjectResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage }
  if (!to.params.projectSlug) {
    return navigateTo(redirectTo)
  }

  const projectStore = useProjectStore()
  await new ProjectManager().getProjectBySlug(to.params.projectSlug as string)
  if (!projectStore.currentProject) {
    return navigateTo(to.name === RouteName.ProjectResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
  }
})
