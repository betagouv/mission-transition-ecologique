import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, EventHandlerRequest, H3Event } from 'h3'
import { ProgramNotFoundError, ProgramService } from '@tee/backend-ddd'
import { z } from 'zod'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

const programIdSchema = z.object({
  programId: z.string()
})

defineRouteMeta({
  openAPI: {
    tags: ['Dispositifs'],
    summary: "Détail d'un dispositif d'aide",
    description:
      "Renvoie un dispositif d'aide. Si des critères de l'entreprise sont passés en query, la réponse indique aussi si l'entreprise y est éligible.",
    parameters: [
      { name: 'programId', in: 'path', required: true, description: 'Identifiant du dispositif.', schema: { type: 'string' } },
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
        description: 'Dispositif demandé.',
        content: { 'application/json': { schema: { type: 'object' } } }
      },
      301: { description: "L'identifiant a changé : redirection vers le nouvel identifiant, en conservant la query." },
      400: { $ref: '#/components/responses/BadRequest' },
      404: {
        description: 'Dispositif introuvable.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      500: {
        description: "Erreur lors du calcul de l'éligibilité.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
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

  return program.value
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
