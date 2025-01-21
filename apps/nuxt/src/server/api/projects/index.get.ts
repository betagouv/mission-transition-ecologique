import { ProjectFilterQuery, projectFilterQuerySchema, QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'
import { Monitor, ProgramService, ProjectService } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  const queries = await getValidatedQuery(event, projectFilterQuerySchema.parse)
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)
  console.log(questionnaireData)
  return projectsCached(event, queries, questionnaireData)
})

const projectsCached = cachedFunction(
  async (event: H3Event, queries: ProjectFilterQuery, questionnaireData: QuestionnaireData) => {
    const programsResults = new ProgramService().getFilteredPrograms(questionnaireData)
    console.log(programsResults)
    if (programsResults.isErr) {
      const err = programsResults.error
      Monitor.error('Error in ProgramFilters', { error: err })
      throw createError({
        statusCode: 500,
        statusMessage: programsResults.error.message
      })
    }
    const projectResults = new ProjectService().getFiltered(queries, programsResults.value)
    if (projectResults.isErr) {
      const err = projectResults.error
      Monitor.error('Error in ProjetFilter', { error: err })
      throw createError({
        statusCode: 500,
        statusMessage: projectResults.error.message
      })
    }

    return projectResults.value
  },
  {
    name: 'projects',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.formEvent(event)
    },
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
