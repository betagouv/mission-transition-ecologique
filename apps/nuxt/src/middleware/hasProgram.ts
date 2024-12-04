import Navigation from '@/tools/navigation'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = to.name === RouteName.ProgramResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage }
  if (!to.params.programId) {
    return navigateTo(redirectTo)
  }

  Navigation.getInstance(to)
  const programResult = await useProgramStore().getProgramById(to.params.programId as string)

  if (!programResult.isOk) {
    return navigateTo(redirectTo)
  }
})
