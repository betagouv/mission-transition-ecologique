import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'
import { Monitor, ProgramService, ProjectService } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)
  return projectsCached(event, questionnaireData)
})

const projectsCached = cachedFunction(
  async (event: H3Event, questionnaireData: QuestionnaireData) => {
    const programsResults = new ProgramService().getFilteredPrograms(questionnaireData)
    if (programsResults.isErr) {
      const err = programsResults.error
      Monitor.error('Error in ProgramFilters', { error: err })
      throw createError({
        statusCode: 500,
        statusMessage: programsResults.error.message
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
    const enrichedProjectResults = projectService.addEligibleProgramsCount(projectResults.value, programsResults.value)
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
