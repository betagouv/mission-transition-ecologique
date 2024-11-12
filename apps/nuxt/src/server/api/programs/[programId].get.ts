import { serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler } from 'h3'
import { EstablishmentNotFoundError, Monitor, ProgramService } from '@tee/backend-ddd'
import { z } from 'zod'

const programIdSchema = z.object({
  programId: z.string()
})

export default defineEventHandler(async (event) => {
  console.log('event', event.context.params)
  const params = await getValidatedRouterParams(event, programIdSchema.parse)
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)

  const programService = new ProgramService()
  const program = programService.getOneWithMaybeEligibility(params.programId, questionnaireData)

  if (program.isErr) {
    if (program.error instanceof EstablishmentNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Program not found'
      })
    }

    Monitor.error('Error in get Program id', { params })
    throw createError({
      statusCode: 500,
      statusMessage: 'Server internal error'
    })
  }

  return programService.convertDomainToFront(program.value)
})
