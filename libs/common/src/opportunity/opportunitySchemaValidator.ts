import { PublicodeObjective, StructureSize } from '../questionnaire'
import { OpportunityType } from './opportunityTypes'
import { z } from 'zod'

const opportunityTypeSchema = z.nativeEnum(OpportunityType)
const publicodeObjectiveSchema = z.nativeEnum(PublicodeObjective)
const structureSizeSchema = z.nativeEnum(StructureSize)

export const contactDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  companySiret: z.string(),
  companyName: z.string().optional().nullable(),
  companySector: z.string().optional(),
  companySize: structureSizeSchema.optional()
})

export const opportunityDetailsBaseSchema = z.object({
  type: opportunityTypeSchema,
  linkToPage: z.string(),
  titleMessage: z.string().optional(),
  linkToCatalog: z.string().optional(),
  message: z.string(),
  priorityObjectives: z.array(publicodeObjectiveSchema).optional(),
  otherData: z.string().optional(),
  theme: z.string().optional()
})

export const opportunityDetailsSchema = opportunityDetailsBaseSchema.extend({
  id: z.string()
})

export const opportunitySchema = contactDetailsSchema.and(opportunityDetailsSchema)

export const opportunityBodySchema = z.object({
  opportunity: opportunitySchema,
  optIn: z.boolean()
})
