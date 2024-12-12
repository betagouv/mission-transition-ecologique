import { Monitor, ProgramService } from '@tee/backend-ddd'
import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)

  return await programCached(questionnaireData)
})

const programCached = cachedFunction(
  async (questionnaireData: QuestionnaireData) => {
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
  },
  {
    getKey: (questionnaireData) => JSON.stringify(questionnaireData),
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
