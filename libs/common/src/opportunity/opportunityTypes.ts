import { PublicodeObjective, StructureSize } from '../questionnaire/types/types'

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
export interface OpportunityDetails extends OpportunityDetailsBase {
  id: string
}

export interface OpportunityDetailsBase {
  type: OpportunityType
  linkToPage: string
  titleMessage?: string
  linkToCatalog?: string
  message: string
  priorityObjectives?: PublicodeObjective[]
  otherData?: string
  theme?: string
}
export enum OpportunityType {
  Program = 'program',
  Project = 'project',
  CustomProject = 'customProject'
}

export interface OpportunityBody {
  opportunity: Opportunity
  optIn: boolean
}
