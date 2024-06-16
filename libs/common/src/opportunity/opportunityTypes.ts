import { Operators } from '@tee/data'
import { PublicodeObjective, QuestionnaireRoute } from '../questionnaire/types'

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
  linkToProgramPage: string
  message: string
  questionnaireRoute?: QuestionnaireRoute
  priorityObjectives?: PublicodeObjective[]
  otherData?: string
}

export interface OpportunityBody {
  opportunity: Opportunity
  optIn: boolean
}
