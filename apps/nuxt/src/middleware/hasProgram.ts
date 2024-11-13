import ProgramApi from '@/tools/api/programApi'
import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = to.name === RouteName.QuestionnaireResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage }
  if (!to.params.programId) {
    navigateTo(redirectTo)
  }
  const programDataResult = await new ProgramApi().getOne(to.params.programId as string)

  if (!programDataResult.isOk) {
    navigateTo(to.name === RouteName.QuestionnaireResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
  }
})
