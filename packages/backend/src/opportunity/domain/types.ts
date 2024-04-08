import { QuestionnaireRoute, PublicodeObjective } from '@tee/common/src/questionnaire/types'
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
  priorityObjectives?: PublicodeObjective[]
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
