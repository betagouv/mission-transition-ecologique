import { z } from 'zod'
import { NAF1 } from '../establishment/types'
import { stringBoolean } from '../validator'
import { ProjectSortBy } from './types'

export const NAF1Schema = z.nativeEnum(NAF1)

export const projectFilterQuerySchema = z.object({
  sector: z.string().optional(),
  codeNAF1: NAF1Schema.optional(),
  onlyEligible: z.boolean().optional(),
  sortBy: z.nativeEnum(ProjectSortBy).optional()
})

export const serverProjectFilterQuerySchema = projectFilterQuerySchema.setKey('onlyEligible', stringBoolean.optional())
