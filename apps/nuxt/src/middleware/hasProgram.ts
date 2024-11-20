import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = to.name === RouteName.QuestionnaireResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage }
  if (!to.params.programId) {
    return navigateTo(redirectTo)
  }

  const programResult = await useProgramStore().getProgramById(to.params.programId as string)

  if (!programResult.isOk) {
    return navigateTo(redirectTo)
  }
})
