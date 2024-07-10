import { PublicodeObjective, QuestionnaireRoute } from '../questionnaire/types/types'

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
