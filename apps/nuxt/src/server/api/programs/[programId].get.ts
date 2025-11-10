import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, EventHandlerRequest, H3Event } from 'h3'
import { ProgramNotFoundError, ProgramService } from '@tee/backend-ddd'
import { z } from 'zod'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

const programIdSchema = z.object({
  programId: z.string()
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, programIdSchema.parse)
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)

  return getProgramById(event, params.programId, questionnaireData)
  // return await _getProgramByIdCached(event, params.programId, questionnaireData)
})

const getProgramById = (event: H3Event<EventHandlerRequest>, programId: string, questionnaireData: QuestionnaireData) => {
  const programService = new ProgramService()
  const redirect = programService.getRedirect(programId)

  if (redirect) {
    const queryString = getRequestURL(event).search
    const newUrl = `/api/programs/${redirect}${queryString}`
    return sendRedirect(event, newUrl, 301)
  }

  const program = programService.getOneWithMaybeEligibility(programId, questionnaireData)

  if (program.isErr) {
    if (program.error instanceof ProgramNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Program not found'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Server internal error in get Program by id'
    })
  }

  return programService.convertDomainToFront(program.value)
}
const _getProgramByIdCached = cachedFunction(
  async (event: H3Event, programId: string, questionnaireData: QuestionnaireData) => {
    return getProgramById(event, programId, questionnaireData)
  },
  {
    name: 'program',
    getKey: (event: H3Event, programId: string) => CacheKeyBuilder.fromEvent(event, programId),
    maxAge: CacheKeyBuilder.MAX_AGE
  }
)
