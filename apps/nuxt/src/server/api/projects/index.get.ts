import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { ProgramType } from '@tee/data/server'
import { defineEventHandler, H3Event } from 'h3'
import { Monitor, ProjectService } from '@tee/backend-ddd'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

defineRouteMeta({
  openAPI: {
    tags: ['Projets'],
    summary: 'Lister les projets',
    description:
      "Renvoie les projets de transition écologique, triés par priorité, avec pour chacun le nombre de dispositifs auxquels l'entreprise est éligible. Les critères de l'entreprise passés en query servent au tri et au filtrage.",
    parameters: [
      { $ref: '#/components/parameters/siret' },
      { $ref: '#/components/parameters/denomination' },
      { $ref: '#/components/parameters/codeNAF' },
      { $ref: '#/components/parameters/codeNAF1' },
      { $ref: '#/components/parameters/codeNaf' },
      { $ref: '#/components/parameters/secteur' },
      { $ref: '#/components/parameters/structure_size' },
      { $ref: '#/components/parameters/legalCategory' },
      { $ref: '#/components/parameters/creationDate' },
      { $ref: '#/components/parameters/isAdministration' },
      { $ref: '#/components/parameters/region' },
      { $ref: '#/components/parameters/ville' },
      { $ref: '#/components/parameters/codePostal' },
      { $ref: '#/components/parameters/is_questionnaire' },
      { $ref: '#/components/parameters/priority_objective' },
      { $ref: '#/components/parameters/building_property' },
      { $ref: '#/components/parameters/sustainable_mobility_objective' },
      { $ref: '#/components/parameters/wastes_management_objective' },
      { $ref: '#/components/parameters/wastes_sorting_objective' },
      { $ref: '#/components/parameters/wastes_materials_objective' },
      { $ref: '#/components/parameters/water_reduction_objective' },
      { $ref: '#/components/parameters/energy_reduction_objective' },
      { $ref: '#/components/parameters/recently_audited' },
      { $ref: '#/components/parameters/recent_audits' },
      { $ref: '#/components/parameters/onlyEligible' }
    ],
    responses: {
      200: {
        description: 'Liste des projets.',
        content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: {
        description: 'Erreur lors du filtrage des projets ou de la récupération des dispositifs.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

export default defineEventHandler(async (event) => {
  const questionnaireData = await getValidatedQuery(event, serverQuestionnaireDataSchema.parse)
  return await getProjects(questionnaireData)
  // return await _getProjectsCached(event, questionnaireData)
})

const getProjects = async (questionnaireData: QuestionnaireData) => {
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
}

const _getProjectsCached = cachedFunction(
  async (event: H3Event, questionnaireData: QuestionnaireData) => {
    return await getProjects(questionnaireData)
  },
  {
    name: 'projects',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.fromEvent(event)
    },
    maxAge: CacheKeyBuilder.MAX_AGE
  }
)
