import { Objectives } from '@tee/data/src/type/publicodesTypes'
import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types'
import { type Operators } from '@tee/data/src/generated/program'

export type Opportunity = ContactDetails & OpportunityDetails

export interface ContactDetails {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companySiret: string
  companyName?: string | null
  companySector?: string
  companySize?: number
}

export interface OpportunityDetails {
  programId: string
  programContactOperator?: Operators
  message: string
  questionnaireRoute?: QuestionnaireRoute
  priorityObjectives?: Objectives[]
  otherData?: string
}

export interface OpportunityUpdateAttributes {
  sentToOperator: boolean
}

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}

export type Year = `${number}${number}${number}${number}`
export type Month = `${number}${number}`

export type DemandsTimeSeries = {
  year: YYYY
  month: MM
  nDemands: number
}[]

export interface Statistics {
  nProgramsActivated: number
  nProgramsUnknownOutcome: number
  nProgramsProposed: number
  demandsTimeSeries: DemandsTimeSeries
}

type MM =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'

// Beware of the bug of the year 2030
type YYYY = '2023' | '2024' | '2025' | '2026' | '2027' | '2028' | '2029'
