import { useProjectStore } from '@/stores/project'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.projectSlug || !(await useProjectStore().getProjectBySlug(to.params.projectSlug as string)).isOk) {
    navigateTo(to.name === RouteName.ProjectResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
  }
})
