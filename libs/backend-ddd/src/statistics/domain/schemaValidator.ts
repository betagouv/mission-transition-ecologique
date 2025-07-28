import { z } from 'zod'
import { StatsPeriodicity } from './types'

const statsPeriodicitySchema = z.nativeEnum(StatsPeriodicity)

export const statQueryParamsSchema = z.object({
  periodicity: statsPeriodicitySchema.optional(),
  since: z.coerce.date().optional(),
  to: z.coerce.date().optional()
})
