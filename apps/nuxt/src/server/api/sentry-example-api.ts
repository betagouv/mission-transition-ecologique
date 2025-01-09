import { defineEventHandler } from '#imports'

export default defineEventHandler(() => {
  throw new Error('Sentry Example API Route Error')
})
