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

export enum FormType {
  Program = 'program',
  Project = 'project'
}

export interface OpportunityDetails {
  type: FormType
  id: string
  linkToPage: string
  linkToCatalog: string
  message: string
  questionnaireRoute?: QuestionnaireRoute
  priorityObjectives?: PublicodeObjective[]
  otherData?: string
  projectTitle?: string
  projectTheme?: string
}

export interface OpportunityBody {
  opportunity: Opportunity
  optIn: boolean
}
