import { defineEventHandler } from 'h3'
import { ExternalProgramNotFoundError, ExternalProgramService, Monitor } from '@tee/backend-ddd'
import { z } from 'zod'

const programIdSchema = z.object({
  programId: z.string()
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, programIdSchema.parse)

  return getExternalProgramById(params.programId)
})

const getExternalProgramById = (programId: string) => {
  const externalProgramService = new ExternalProgramService()
  const program = externalProgramService.getById(programId)

  if (program.isErr) {
    if (program.error instanceof ExternalProgramNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'External program not found'
      })
    }

    Monitor.error('Error in get external program by id', { programId, error: program.error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Server internal error in get external program by id'
    })
  }

  return program.value
}
