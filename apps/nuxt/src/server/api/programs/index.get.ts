import { Monitor, ProgramService } from '@tee/backend-ddd'
import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

export default defineEventHandler(async (event) => {
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)

  return getPrograms(questionnaireData)
  // return await _getProgramsCached(event, questionnaireData)
})

const getPrograms = (questionnaireData: QuestionnaireData) => {
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
}

const _getProgramsCached = cachedFunction(
  async (event: H3Event, questionnaireData: QuestionnaireData) => {
    return getPrograms(questionnaireData)
  },
  {
    name: 'programs',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.fromEvent(event)
    },
    maxAge: CacheKeyBuilder.MAX_AGE
  }
)
