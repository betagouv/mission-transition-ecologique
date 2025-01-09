import { z } from 'zod'

// coerce from zod can be used to transform the value: https://zod.dev/?id=coercion-for-primitives
export const stringBoolean = z.union([z.literal('true'), z.literal('false')]).transform((val) => val.toLowerCase() === 'true')
