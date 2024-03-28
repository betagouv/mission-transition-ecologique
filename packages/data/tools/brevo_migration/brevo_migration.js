#!/usr/bin/env node

// Script to migrate opportunity data originally stored as contact information into Brevo Deals
// Needs brevo token exported as environment variable BREVO_API_TOKEN to run

const SibApiV3Sdk = require('@getbrevo/brevo')
const ProgramApplication = require('@tee/backend/build/backend/src/program/application/programService')

const testPipeline = {
  pipeline: '65ce1a5e59d96ff2630f06c8',
  deal_stage: 'C8DrOEJbVoiqtWZHQbMHyxF'
}

// const prod_pipeline = {
//   pipeline: '65719d9023acb4f05e56e7eb',
//   deal_stage: '659d15cff01695.94588187'
// }

let selectedPipeline = testPipeline

const requestAllBrevoContacts = async () => {
  let apiInstance = new SibApiV3Sdk.ContactsApi()

  const token = process.env['BREVO_API_TOKEN'] || ''

  apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, token)

  const limit = 50
  const offset = 155
  const listIds = 2

  let contacts

  contacts = await apiInstance.getContacts(limit, offset, undefined, undefined, undefined, { listIds: listIds }).then(
    function (data) {
      return data.body.contacts
    },
    function (error) {
      console.error(error)
    }
  )

  return contacts
}

const filterOldContacts = (contacts) => {
  return contacts.filter((c) => {
    return 'PROGRAM_ID' in c.attributes
  })
}

const translateContactsToOpportunities = (contacts) => {
  const ProgramService = ProgramApplication.default
  ProgramService.init()
  const service = new ProgramService()

  return contacts.map((contact) => translateOneContactToOpportunity(contact, service))
}

const translateOneContactToOpportunity = (contact, service) => {
  let allResponses
  if (contact.attributes.ALL_RESPONSES) {
    allResponses = parseAllResponses(contact.attributes.ALL_RESPONSES)
  }

  // Some programs id have changed in the meanwhile
  const updatedId = updateProgramId(contact.attributes.PROGRAM_ID)
  const program = service.getById(updatedId)

  console.log(program ? program['opérateur de contact'] : undefined)

  const opportunity = {
    name: updatedId,
    attributes: {
      pipeline: selectedPipeline.pipeline,
      deal_stage: selectedPipeline.deal_stage,
      created_at: contact.createdAt,
      last_updated_date: contact.modifiedAt,
      message: contact.attributes.FORM_NEEDS,
      oprateur_de_contact: program ? program['opérateur de contact'] : undefined,
      parcours: allResponses ? allResponses.user_help : 'annuaire',
      autres_donnes: contact.attributes.ALL_RESPONSES
    },
    contact_id: contact.id
  }
  return opportunity
}

const parseAllResponses = (txt) => {
  const splitted = txt.split(' / ')
  const parsed = {}
  for (const s of splitted) {
    keyValue = s.split(': ')

    key = keyValue[0]
    value = keyValue[1]

    if (key == 'user_help') {
      value = translateUserHelp(value)
    }

    parsed[key] = value
  }
  return parsed
}

const translateUserHelp = (value) => {
  if (value == 'precise') {
    value = 'jai_un_objectif_prcis'
  } else {
    value = 'je_ne_sais_pas_par_o_commencer'
  }
  return value
}

const updateProgramId = (id) => {
  switch (id) {
    case 'formations-actions-baisse-les-watts':
      return 'baisse-les-watts'
    case 'etude-photovoltaique':
      return 'etude-photovoltaique-ademe'
    case 'formations-rse':
      return 'formations-tee'
    default:
      return id
  }
}

const sendOpportunitiesToBrevo = async (opportunities) => {
  let apiInstance = new SibApiV3Sdk.DealsApi()

  const token = process.env['BREVO_API_TOKEN'] || ''

  apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, token)

  for (let opportunity of opportunities) {
    const opportunity_id = await apiInstance.crmDealsPost(opportunity).then(
      function (data) {
        return data.body.id
      },
      function (error) {
        console.error(`Import failed with opportunity ${JSON.stringify(opportunity, null, 2)}: ${error}`)
      }
    )

    apiInstance.crmDealsLinkUnlinkIdPatch(opportunity_id, { linkContactIds: [opportunity.contact_id] }).catch(function (error) {
      console.error(`Could not link opportunity with ${opportunity.contact_id}: ${error}`)
    })
  }
}

const migrateOldContacts = async () => {
  const contacts = await requestAllBrevoContacts()
  const oldContacts = filterOldContacts(contacts)
  const opportunities = translateContactsToOpportunities(oldContacts)
  await sendOpportunitiesToBrevo(opportunities)
}

migrateOldContacts()
