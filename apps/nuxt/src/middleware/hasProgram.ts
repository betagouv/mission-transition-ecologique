import { useProgramStore } from '@/stores/program'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.programId || !(await useProgramStore().getProgramById(to.params.programId as string)).isOk) {
    navigateTo(to.name === RouteName.QuestionnaireResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
  }
})
