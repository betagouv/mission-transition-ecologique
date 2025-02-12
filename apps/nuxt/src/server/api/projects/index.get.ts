import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { ProgramType } from '@tee/data/server'
// import { ProjectFilterQuery, serverProjectFilterQuerySchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'
import { Monitor, ProjectService } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)
  return projectsCached(event, questionnaireData)
  // const queries = await getValidatedQuery(event, serverProjectFilterQuerySchema.parse)
  //
  // return projectsCached(event, queries)
})

const projectsCached = cachedFunction(
  async (event: H3Event, questionnaireData: QuestionnaireData) => {
    let programs: ProgramType[]
    try {
      const params = new URLSearchParams(questionnaireData as Record<string, string>)
      params.sort()
      const queryString = params.size === 0 ? '' : '?' + params.toString()
      programs = await $fetch<ProgramType[]>('/api/programs' + queryString)
    } catch (error: unknown) {
      Monitor.error('Error in fetching programs', { error: error })
      throw createError({
        statusCode: 500,
        statusMessage: 'Error in fetching programs'
      })
    }

    const projectService = new ProjectService()
    const projectResults = projectService.getFiltered(questionnaireData)
    if (projectResults.isErr) {
      const err = projectResults.error
      Monitor.error('Error in ProjetFilter', { error: err })
      throw createError({
        statusCode: 500,
        statusMessage: projectResults.error.message
      })
    }
    const enrichedProjectResults = projectService.addEligibleProgramsCount(projectResults.value, programs)
    if (enrichedProjectResults.isErr) {
      const err = enrichedProjectResults.error
      Monitor.error('Error in adding availablePrograms', { error: err })
      throw createError({
        statusCode: 500,
        statusMessage: enrichedProjectResults.error.message
      })
    }
    return enrichedProjectResults.value
  },
  {
    name: 'projects',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.formEvent(event)
    },
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
