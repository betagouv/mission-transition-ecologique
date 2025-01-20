import { z } from 'zod'
import { NAF1 } from '../establishment/types'

export const NAF1Schema = z.nativeEnum(NAF1)

export const projectFilterQuerySchema = z.object({
  sector: z.string().optional(),
  codeNAF1: NAF1Schema.optional()
})
