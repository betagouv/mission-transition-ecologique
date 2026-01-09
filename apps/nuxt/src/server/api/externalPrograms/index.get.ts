import { ExternalProgramService, Monitor } from '@tee/backend-ddd'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return getExternalPrograms()
})

const getExternalPrograms = () => {
  try {
    const externalProgramService = new ExternalProgramService()
    return externalProgramService.getAll()
  } catch (error) {
    Monitor.error('Error in get external programs', { error })
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
