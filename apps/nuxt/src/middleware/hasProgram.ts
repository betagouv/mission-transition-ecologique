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

  const programStore = useProgramStore()
  await new ProgramManager().getOneById(to.params.programId as string)

  if (!programStore.currentProgram && !programStore.currentExtProgram) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Program not Found'
    })
  }
})
