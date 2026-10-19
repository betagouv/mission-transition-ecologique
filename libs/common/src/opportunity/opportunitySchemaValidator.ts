import { PublicodeObjective, StructureSize } from '../questionnaire'
import { ThemeId } from '../theme/types'
import { OpportunityType } from './opportunityTypes'
import { z } from 'zod'

const opportunityTypeSchema = z.nativeEnum(OpportunityType)
const publicodeObjectiveSchema = z.nativeEnum(PublicodeObjective)
const structureSizeSchema = z.nativeEnum(StructureSize)
// An unknown theme must not reject the opportunity: it falls back to undefined (default subject for the hubs)
const themeIdSchema = z.nativeEnum(ThemeId).optional().catch(undefined)

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
  theme: themeIdSchema
})

export const opportunityDetailsSchema = opportunityDetailsBaseSchema.extend({
  id: z.string()
})

export const opportunitySchema = contactDetailsSchema.and(opportunityDetailsSchema)

export const opportunityBodySchema = z.object({
  opportunity: opportunitySchema,
  optIn: z.boolean()
})
