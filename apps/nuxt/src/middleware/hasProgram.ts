import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = to.name === RouteName.ProgramResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage }
  if (!to.params.programId) {
    return navigateTo(redirectTo)
  }

  Navigation.getInstance(to)

  await new ProgramManager().getOneById(to.params.programId as string)
  if (!useProgramStore().currentProgram) {
    return navigateTo(redirectTo)
  }
})
