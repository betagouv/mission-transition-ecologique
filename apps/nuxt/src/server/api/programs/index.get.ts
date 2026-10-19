import { Monitor, ProgramService } from '@tee/backend-ddd'
import { QuestionnaireData, serverQuestionnaireDataSchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

defineRouteMeta({
  openAPI: {
    $global: {
      components: {
        parameters: {
          siret: {
            name: 'siret',
            in: 'query',
            required: false,
            description: "SIRET de l'entreprise (14 chiffres).",
            schema: { type: 'string' }
          },
          denomination: {
            name: 'denomination',
            in: 'query',
            required: false,
            description: "Raison sociale de l'entreprise.",
            schema: { type: 'string' }
          },
          codeNAF: {
            name: 'codeNAF',
            in: 'query',
            required: false,
            description: "Code NAF de l'activité de l'entreprise (ex. 62.01Z).",
            schema: { type: 'string' }
          },
          codeNAF1: {
            name: 'codeNAF1',
            in: 'query',
            required: false,
            description:
              "Section NAF de l'activité (lettre majuscule de A à U). Utilisée pour filtrer les dispositifs et projets selon le secteur : une autre valeur n'est pas rejetée mais ne correspond à aucun secteur.",
            schema: { type: 'string' }
          },
          codeNaf: {
            name: 'codeNaf',
            in: 'query',
            required: false,
            description: 'Obsolète.',
            deprecated: true,
            schema: { type: 'string' }
          },
          secteur: {
            name: 'secteur',
            in: 'query',
            required: false,
            description: "Libellé du secteur d'activité.",
            schema: { type: 'string' }
          },
          structure_size: {
            name: 'structure_size',
            in: 'query',
            required: false,
            description: "Taille de l'entreprise : EI (entreprise individuelle), MICRO, TPE, PE, ME, ETI ou GE.",
            schema: { type: 'string', enum: ['EI', 'MICRO', 'TPE', 'PE', 'ME', 'ETI', 'GE'] }
          },
          legalCategory: {
            name: 'legalCategory',
            in: 'query',
            required: false,
            description: "Code de catégorie juridique INSEE de l'entreprise.",
            schema: { type: 'string' }
          },
          creationDate: {
            name: 'creationDate',
            in: 'query',
            required: false,
            description: "Date de création de l'entreprise (AAAA-MM-JJ).",
            schema: { type: 'string', format: 'date' }
          },
          isAdministration: {
            name: 'isAdministration',
            in: 'query',
            required: false,
            description: 'Indique si la structure est une administration.',
            schema: { type: 'string', enum: ['true', 'false'] }
          },
          region: {
            name: 'region',
            in: 'query',
            required: false,
            description: "Nom de la région de l'entreprise (ex. Pays de la Loire).",
            schema: { type: 'string' }
          },
          ville: {
            name: 'ville',
            in: 'query',
            required: false,
            description: "Commune de l'entreprise.",
            schema: { type: 'string' }
          },
          codePostal: {
            name: 'codePostal',
            in: 'query',
            required: false,
            description: "Code postal de l'entreprise.",
            schema: { type: 'string' }
          },
          is_questionnaire: {
            name: 'is_questionnaire',
            in: 'query',
            required: false,
            description: 'Indique que les critères proviennent du parcours questionnaire.',
            schema: { type: 'string', enum: ['true', 'false'] }
          },
          priority_objective: {
            name: 'priority_objective',
            in: 'query',
            required: false,
            description: "Thématique prioritaire de l'entreprise.",
            schema: {
              type: 'string',
              enum: ['energy', 'environmental', 'mobility', 'building', 'water', 'waste', 'eco-design', 'rh', 'biodiversite']
            }
          },
          building_property: {
            name: 'building_property',
            in: 'query',
            required: false,
            description: "Situation de l'entreprise vis-à-vis de ses locaux.",
            schema: { type: 'string', enum: ['proprietaire', 'locataire', 'proprietaire-et-locataire', 'non'] }
          },
          sustainable_mobility_objective: {
            name: 'sustainable_mobility_objective',
            in: 'query',
            required: false,
            description: "L'entreprise a-t-elle un objectif de mobilité durable ?",
            schema: { type: 'string', enum: ['oui', 'non', 'je-ne-sais-pas', 'non-max'] }
          },
          wastes_management_objective: {
            name: 'wastes_management_objective',
            in: 'query',
            required: false,
            description: "L'entreprise a-t-elle un objectif de gestion des déchets ?",
            schema: { type: 'string', enum: ['oui', 'non', 'je-ne-sais-pas', 'non-max'] }
          },
          wastes_sorting_objective: {
            name: 'wastes_sorting_objective',
            in: 'query',
            required: false,
            description: "Avancement du tri des déchets dans l'entreprise.",
            schema: { type: 'string', enum: ['en-place', 'peut-mieux-faire', 'je-ne-sais-pas'] }
          },
          wastes_materials_objective: {
            name: 'wastes_materials_objective',
            in: 'query',
            required: false,
            description: "L'entreprise souhaite-t-elle réduire ses déchets ou matières ?",
            schema: { type: 'string', enum: ['oui', 'non', 'je-ne-sais-pas'] }
          },
          water_reduction_objective: {
            name: 'water_reduction_objective',
            in: 'query',
            required: false,
            description: "L'entreprise souhaite-t-elle réduire sa consommation d'eau ?",
            schema: { type: 'string', enum: ['oui', 'non', 'je-ne-sais-pas'] }
          },
          energy_reduction_objective: {
            name: 'energy_reduction_objective',
            in: 'query',
            required: false,
            description: "L'entreprise souhaite-t-elle réduire sa consommation d'énergie ?",
            schema: { type: 'string', enum: ['oui', 'non', 'je-ne-sais-pas'] }
          },
          recently_audited: {
            name: 'recently_audited',
            in: 'query',
            required: false,
            description: "L'entreprise a-t-elle réalisé un audit environnemental récemment ?",
            schema: { type: 'string', enum: ['oui', 'non', 'je-ne-sais-pas'] }
          },
          recent_audits: {
            name: 'recent_audits',
            in: 'query',
            required: false,
            description: "Audits réalisés récemment par l'entreprise.",
            schema: { type: 'string' }
          },
          onlyEligible: {
            name: 'onlyEligible',
            in: 'query',
            required: false,
            description:
              "Par défaut, les éléments pour lesquels l'entreprise n'est pas éligible sont exclus. Passer `false` pour tout renvoyer.",
            schema: { type: 'string', enum: ['true', 'false'] }
          }
        },
        responses: {
          BadRequest: {
            description: 'Paramètre de requête ou de chemin invalide (valeur hors des valeurs autorisées, type incorrect).',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer' },
              statusMessage: { type: 'string' },
              message: { type: 'string' }
            }
          },
          OpportunityBody: {
            type: 'object',
            required: ['opportunity', 'optIn'],
            properties: {
              opportunity: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'phoneNumber', 'companySiret', 'type', 'id', 'linkToPage', 'message'],
                properties: {
                  firstName: { type: 'string', description: 'Prénom du contact.' },
                  lastName: { type: 'string', description: 'Nom du contact.' },
                  email: { type: 'string', description: 'Email du contact.' },
                  phoneNumber: { type: 'string', description: 'Téléphone du contact.' },
                  companySiret: { type: 'string', description: "SIRET de l'entreprise." },
                  companyName: { type: ['string', 'null'], description: "Raison sociale de l'entreprise." },
                  companySector: { type: 'string', description: "Secteur d'activité de l'entreprise." },
                  companySize: {
                    type: 'string',
                    enum: ['EI', 'MICRO', 'TPE', 'PE', 'ME', 'ETI', 'GE'],
                    description: "Taille de l'entreprise."
                  },
                  type: {
                    type: 'string',
                    enum: ['program', 'project', 'customProject'],
                    description: 'Objet de la demande : un dispositif, un projet du catalogue ou un projet libre.'
                  },
                  id: { type: 'string', description: 'Identifiant du dispositif ou slug du projet concerné.' },
                  linkToPage: { type: 'string', description: 'URL de la page depuis laquelle la demande est envoyée.' },
                  titleMessage: {
                    type: 'string',
                    description:
                      'Nom du projet libre. Utilisé uniquement pour le type customProject (nom de la demande, email de confirmation, transmission aux partenaires) ; ignoré pour les autres types.'
                  },
                  linkToCatalog: { type: 'string', description: 'URL du catalogue de résultats.' },
                  message: { type: 'string', description: "Message de l'entreprise." },
                  priorityObjectives: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'questionnaire . objectif prioritaire . est mon impact environnemental',
                        'questionnaire . objectif prioritaire . est ma performance énergétique',
                        "questionnaire . objectif prioritaire . est diminuer ma consommation d'eau",
                        'questionnaire . objectif prioritaire . est rénover mon bâtiment',
                        'questionnaire . objectif prioritaire . est la mobilité durable',
                        'questionnaire . objectif prioritaire . est la gestion des déchets',
                        "questionnaire . objectif prioritaire . est l'écoconception",
                        'questionnaire . objectif prioritaire . est former ou recruter',
                        'questionnaire . objectif prioritaire . est faire des économies',
                        'questionnaire . objectif prioritaire . est investir durable',
                        'questionnaire . objectif prioritaire . est préserver la biodiversité',
                        'questionnaire . objectif prioritaire . est je ne sais pas encore'
                      ]
                    },
                    description: 'Obsolète.',
                    deprecated: true
                  },
                  otherData: { type: 'string', description: 'Informations complémentaires.' },
                  theme: {
                    type: 'string',
                    enum: ['energy', 'environmental', 'mobility', 'building', 'water', 'waste', 'eco-design', 'rh', 'biodiversite'],
                    description: 'Identifiant de la thématique de la demande. Une valeur inconnue est ignorée, sans rejeter la demande.'
                  }
                }
              },
              optIn: {
                type: 'boolean',
                description: "Consentement au traitement des données de contact. La demande est refusée (erreur 422) s'il vaut `false`."
              }
            }
          }
        }
      }
    },
    tags: ['Dispositifs'],
    summary: "Lister les dispositifs d'aide",
    description:
      "Renvoie les dispositifs d'aide à la transition écologique actifs. Les critères de l'entreprise passés en query permettent de filtrer les dispositifs selon leur éligibilité.",
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
        description: 'Liste des dispositifs.',
        content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: {
        description: 'Erreur lors du filtrage des dispositifs.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

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

  return programsResult.value
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
