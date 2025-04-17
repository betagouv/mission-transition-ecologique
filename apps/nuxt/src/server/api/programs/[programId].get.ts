import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'
import { ProgramNotFoundError, ProgramService } from '@tee/backend-ddd'
import { z } from 'zod'

const programIdSchema = z.object({
  programId: z.string()
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, programIdSchema.parse)
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)

  return await programCached(event, params.programId, questionnaireData)
})

const programCached = cachedFunction(
  async (event: H3Event, programId: string, questionnaireData: QuestionnaireData) => {
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
  },
  {
    name: 'program',
    getKey: (event: H3Event, programId: string) => CacheKeyBuilder.formEvent(event, programId),
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
