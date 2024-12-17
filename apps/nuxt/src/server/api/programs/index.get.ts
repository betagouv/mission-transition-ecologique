import { Monitor, ProgramService } from '@tee/backend-ddd'
import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)

  return await programsCached(event, questionnaireData)
})

const programsCached = cachedFunction(
  async (event: H3Event, questionnaireData: QuestionnaireData) => {
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
    name: 'programs',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.formEvent(event)
    },
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
