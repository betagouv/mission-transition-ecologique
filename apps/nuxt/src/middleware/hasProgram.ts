import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'
import { ExternalProgramManager } from '@/tools/externalProgram/externalProgramManager'
import { useExternalProgramStore } from '@/stores/externalProgram'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.programId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Program not Found'
    })
  }

  Navigation.getInstance(to)

  // First try to get from regular programs
  await new ProgramManager().getOneById(to.params.programId as string)

  // If not found in regular programs, try external programs
  if (!useProgramStore().currentProgram) {
    await new ExternalProgramManager().getOneById(to.params.programId as string)

    // If still not found, throw 404
    if (!useExternalProgramStore().currentExternalProgram) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Program not Found'
      })
    }
  }
})
