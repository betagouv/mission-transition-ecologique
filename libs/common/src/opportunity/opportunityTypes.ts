import { PublicodeObjective, QuestionnaireRoute, StructureSize } from '../questionnaire/types/types'

export type Opportunity = ContactDetails & OpportunityDetails

export interface ContactDetails {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companySiret: string
  companyName?: string | null
  companySector?: string
  companySize?: StructureSize
}

export enum OpportunityType {
  Program = 'program',
  Project = 'project'
}

export interface OpportunityDetails {
  type: OpportunityType
  id: string
  linkToPage: string
  linkToCatalog: string
  message: string
  questionnaireRoute?: QuestionnaireRoute
  priorityObjectives?: PublicodeObjective[]
  otherData?: string
}

export interface OpportunityBody {
  opportunity: Opportunity
  optIn: boolean
}
