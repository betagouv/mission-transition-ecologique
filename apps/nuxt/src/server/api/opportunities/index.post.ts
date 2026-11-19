import { opportunityBodySchema } from '@tee/common'
import { defineEventHandler, getRequestHeader, readRawBody, setResponseHeader } from 'h3'
import { Monitor, OpportunityService, OptInRequiredError, ServiceNotFoundError } from '@tee/backend-ddd'
import { JsonContentType } from '~/server/utils/jsonContentType'
import { OpportunityApiKey, OpportunityApiKeyStatus } from '~/server/utils/opportunityApiKey'
import { OpportunityLinkHosts } from '~/server/utils/opportunityLinkHosts'

defineRouteMeta({
  openAPI: {
    $global: {
      components: {
        securitySchemes: {
          partnerApiKey: {
            type: 'http',
            scheme: 'bearer',
            description:
              "Clé d'API remise aux partenaires qui appellent l'API depuis leur serveur. " +
              'Elle dispense du contrôle de domaine sur `linkToCatalog`.'
          }
        },
        // Only used by this route: declared here, the shared components (Error, ThemeId) stay in programs/index.get.ts
        schemas: {
          OpportunityBody: {
            type: 'object',
            required: ['opportunity', 'optIn'],
            properties: {
              opportunity: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'phoneNumber', 'companySiret', 'type', 'id', 'linkToCatalog', 'message'],
                properties: {
                  firstName: {
                    type: 'string',
                    maxLength: 100,
                    description:
                      'Prénom du contact : lettres (accents compris), espaces, tirets, apostrophes et points uniquement. Les liens sont refusés.'
                  },
                  lastName: {
                    type: 'string',
                    maxLength: 100,
                    description:
                      'Nom du contact : lettres (accents compris), espaces, tirets, apostrophes et points uniquement. Les liens sont refusés.'
                  },
                  email: { type: 'string', format: 'email', maxLength: 254, description: 'Email du contact.' },
                  phoneNumber: {
                    type: 'string',
                    maxLength: 20,
                    description: 'Téléphone du contact : au moins 10 chiffres, espaces et préfixe international `+` acceptés.'
                  },
                  companySiret: { type: 'string', maxLength: 20, description: "SIRET de l'entreprise." },
                  companyName: { type: ['string', 'null'], maxLength: 300, description: "Raison sociale de l'entreprise." },
                  companySector: { type: 'string', maxLength: 300, description: "Secteur d'activité de l'entreprise." },
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
                  id: { type: 'string', maxLength: 200, description: 'Identifiant du dispositif ou slug du projet concerné.' },
                  titleMessage: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 200,
                    description:
                      "Nom du projet libre. Utilisé uniquement pour le type customProject (nom de la demande, transmission aux partenaires). Facultatif, mais s'il est envoyé, il est validé quel que soit le type : 1 à 200 caractères, sans lien (URL, nom de domaine) ni balise HTML, sinon la demande est refusée (422). Pour les autres types, ne pas l'envoyer."
                  },
                  linkToCatalog: {
                    type: 'string',
                    format: 'uri',
                    maxLength: 2000,
                    description:
                      "URL absolue (http ou https) de la fiche du dispositif ou du projet, sur le domaine du site ou d'un partenaire autorisé, sans espace ni identifiant avant le domaine. Transmise aux Conseillers-Entreprises comme URL de la page d'origine. Une clé d'API valide (en-tête `Authorization: Bearer <clé>`) dispense du contrôle des domaines autorisés sur `linkToCatalog`."
                  },
                  message: { type: 'string', maxLength: 2500, description: "Message de l'entreprise." },
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
                  otherData: { type: 'string', maxLength: 20000, description: 'Informations complémentaires.' },
                  theme: {
                    $ref: '#/components/schemas/ThemeId',
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
    tags: ['Opportunités'],
    summary: 'Déposer une demande de contact',
    description:
      "Enregistre la demande de contact d'une entreprise sur un dispositif ou un projet, puis la transmet aux opérateurs concernés.\n\n" +
      "Les partenaires qui appellent depuis leur serveur s'authentifient avec l'en-tête `Authorization: Bearer <clé>`. " +
      'Une clé valide dispense du contrôle de domaine sur `linkToCatalog` ; toutes les autres validations restent appliquées. ' +
      'Sans en-tête `Authorization`, la demande est traitée comme un appel du site.',
    parameters: [],
    // Empty requirement first: the key is optional, the site calls the route without it
    security: [{}, { partnerApiKey: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/OpportunityBody' } } }
    },
    responses: {
      200: {
        description: 'Identifiant de la demande créée.',
        content: { 'application/json': { schema: { type: 'object' } } }
      },
      401: {
        description: "En-tête `Authorization` présent mais clé d'API invalide ou mal formée.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      404: {
        description: 'Demande non créée : aucun service ne peut la prendre en charge.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      413: {
        description: 'Body de plus de 100 Ko.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      415: {
        description: 'En-tête `Content-Type` absent ou différent de `application/json`.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      422: {
        description:
          'Body invalide (champ manquant, format incorrect, lien interdit, URL hors du domaine du site), ou consentement `optIn` absent. ' +
          "Une clé d'API valide dispense du contrôle des domaines autorisés sur `linkToCatalog`.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      500: {
        description: "Erreur lors de l'enregistrement de la demande.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

// A legitimate request weighs a few kilobytes: larger bodies are rejected before being validated.
// The size is measured on the body itself, as a chunked request has no Content-Length header.
// The xssValidator middleware of nuxt-security has already read the body at this point.
const maxBodySize = 100_000

export default defineEventHandler(async (event) => {
  // Checked first: a wrong key must not go through the other validations.
  // The key is not part of the logged data, and the Authorization header is removed from Sentry events (sentry.server.config.ts).
  const apiKeyCheck = OpportunityApiKey.check(getRequestHeader(event, 'authorization'))
  if (apiKeyCheck.status === OpportunityApiKeyStatus.Invalid) {
    // Warning without any detail on the key, like the other rejections: they must not flood the error alerts
    Monitor.warning('Opportunity rejected: invalid API key')
    // RFC 9110: a 401 response tells which authentication scheme is expected.
    // Set on the response, as the Nuxt error handler ignores the headers of createError.
    setResponseHeader(event, 'WWW-Authenticate', 'Bearer')
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API key'
    })
  }

  // Name of the partner calling with a valid key, to know who made the call (never the key itself)
  const monitorTags = apiKeyCheck.partner ? { partner: apiKeyCheck.partner } : undefined

  // Without this check, a third-party site could make its visitors' browsers send requests (text/plain skips the CORS preflight)
  if (!JsonContentType.isJson(getRequestHeader(event, 'content-type'))) {
    throw createError({
      statusCode: 415,
      statusMessage: `Content-Type must be ${JsonContentType.mediaType}`
    })
  }

  const rawBody = await readRawBody(event, false)
  if (rawBody !== undefined && rawBody.length > maxBodySize) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Request body too large'
    })
  }

  const opportunityBody = await readValidatedBody(event, opportunityBodySchema.safeParse)

  if (opportunityBody.error) {
    // Warning: rejections are expected (bots, phishing attempts) and must not flood the error alerts
    Monitor.warning('Error in opportunity validation', { error: opportunityBody.error }, monitorTags)
    throw createError({
      statusCode: 422,
      statusMessage: opportunityBody.error.message
    })
  }

  // Partners calling with a valid key send links to their own domains
  if (apiKeyCheck.status !== OpportunityApiKeyStatus.Valid) {
    const requestHost = OpportunityLinkHosts.requestHost(event)
    const allowedHosts = OpportunityLinkHosts.allowedHosts(requestHost, useRuntimeConfig(event).public.siteUrl as string | undefined)
    const invalidLinks = OpportunityLinkHosts.invalidLinks(opportunityBody.data.opportunity, allowedHosts)
    if (invalidLinks.length > 0) {
      // No personal data: only what is needed to understand the rejection
      Monitor.warning('Opportunity rejected: link outside of the allowed hosts', { invalidLinks, allowedHosts })
      throw createError({
        statusCode: 422,
        statusMessage: `Links must point to the site domain: ${invalidLinks.join(', ')}`
      })
    }
  }

  const opportunityResult = await new OpportunityService().createOpportunity(
    opportunityBody.data.opportunity,
    opportunityBody.data.optIn,
    apiKeyCheck.partner
  )

  if (opportunityResult.isErr) {
    Monitor.error('Error in createOpportunity', { query: opportunityBody.data, error: opportunityResult.error }, monitorTags)
    if (opportunityResult.error instanceof OptInRequiredError) {
      throw createError({
        statusCode: 422,
        statusMessage: opportunityResult.error.message
      })
    }

    if (opportunityResult.error instanceof ServiceNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: `Opportunity not created: ${opportunityResult.error.message}`
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error: ${opportunityResult.error.message}`
    })
  }

  return opportunityResult.value
})
