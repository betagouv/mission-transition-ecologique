import { z } from 'zod'
import { NAF1 } from '../establishment/types'
import { sectorSchema } from '../questionnaire'

export const NAF1Schema = z.nativeEnum(NAF1)

export const projectFilterQuerySchema = z.object({
  sector: sectorSchema.optional(),
  codeNAF1: NAF1Schema.optional()
})
