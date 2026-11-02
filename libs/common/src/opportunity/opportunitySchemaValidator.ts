import { PublicodeObjective, StructureSize } from '../questionnaire'
import { ThemeId } from '../theme/types'
import { OpportunityType } from './opportunityTypes'
import { z } from 'zod'
import { PhoneValidator } from '../establishment/validator/phoneValidator'
import { LinkValidator } from '../validator/linkValidator'
import { NameValidator } from '../validator/nameValidator'

const opportunityTypeSchema = z.nativeEnum(OpportunityType)
const publicodeObjectiveSchema = z.nativeEnum(PublicodeObjective)
const structureSizeSchema = z.nativeEnum(StructureSize)
// An unknown theme must not reject the opportunity: it falls back to undefined (default subject for the hubs)
const themeIdSchema = z.nativeEnum(ThemeId).optional().catch(undefined)

// Fields echoed in the acknowledgement email sent to the given address must not carry links (phishing)
const textWithoutLinkSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(maxLength)
    .refine((value) => !LinkValidator.containsLink(value), { message: 'Links are not allowed' })
const nameSchema = z
  .string()
  .trim()
  .refine(NameValidator.validate, { message: 'Only letters, spaces, hyphens, apostrophes and dots are allowed' })
const httpUrlSchema = z.string().max(2000).refine(LinkValidator.isHttpUrl, { message: 'Must be an absolute http(s) URL' })

export const contactDetailsSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.string().trim().max(254).email(),
  phoneNumber: z.string().max(30).refine(PhoneValidator.validate, { message: 'Invalid phone number' }),
  companySiret: z.string().max(20),
  companyName: z.string().optional().nullable(),
  companySector: z.string().optional(),
  companySize: structureSizeSchema.optional()
})

export const opportunityDetailsBaseSchema = z.object({
  type: opportunityTypeSchema,
  linkToPage: httpUrlSchema,
  titleMessage: textWithoutLinkSchema(200).optional(),
  // Required: sent as origin_url to Place des Entreprises, which rejects the solicitation without it
  linkToCatalog: httpUrlSchema,
  message: z.string().max(10000),
  priorityObjectives: z.array(publicodeObjectiveSchema).optional(),
  otherData: z.string().optional(),
  theme: themeIdSchema
})

export const opportunityDetailsSchema = opportunityDetailsBaseSchema.extend({
  id: z.string().max(200)
})

export const opportunitySchema = contactDetailsSchema.and(opportunityDetailsSchema)

export const opportunityBodySchema = z.object({
  opportunity: opportunitySchema,
  optIn: z.boolean()
})
