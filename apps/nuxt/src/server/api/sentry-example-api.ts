import { defineEventHandler } from '#imports'

export default defineEventHandler((event) => {
  throw new Error('Sentry Example API Route Error')
})
