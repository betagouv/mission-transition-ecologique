import { serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler } from 'h3'
import { Monitor, ProgramService } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)

  const programService = new ProgramService()
  const programsResult = programService.getFilteredPrograms(questionnaireData)

  if (programsResult.isErr) {
    Monitor.error('Error in get programs', { questionnaireData, error: programsResult.error })
    throw createError({
      statusCode: 500,
      statusMessage: programsResult.error.message
    })
  }

  return programsResult.value.map((program) => programService.convertDomainToFront(program))
})
