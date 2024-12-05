import { z } from 'zod'

export const stringBoolean = z.union([z.literal('true'), z.literal('false')]).transform((val) => val.toLowerCase() === 'true')
