import ProgramApi from '@/tools/api/programApi'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = to.name === RouteName.QuestionnaireResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage }
  if (!to.params.programId) {
    navigateTo(redirectTo)
  }

  const programResult = await new ProgramApi().getOne(to.params.programId as string)

  if (!programResult.isOk) {
    navigateTo(redirectTo)
  }
})
