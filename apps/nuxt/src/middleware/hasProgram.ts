import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.programId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Program not Found'
    })
  }

  Navigation.getInstance(to)

  const programManager = new ProgramManager()

  await programManager.getOneById(to.params.programId as string)
  if (!useProgramStore().currentProgram) {
    await programManager.getOneExternal(to.params.programId as string)

    if (!useProgramStore().currentExtProgram) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Program not Found'
      })
    }
  }
})
