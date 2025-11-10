import { opportunityBodySchema } from '@tee/common'
import { defineEventHandler } from 'h3'
import { Monitor, OpportunityService, ServiceNotFoundError } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  const opportunityBody = await readValidatedBody(event, opportunityBodySchema.safeParse)

  if (opportunityBody.error) {
    Monitor.error('Error in opportunity validation', { error: opportunityBody.error })
    throw createError({
      statusCode: 422,
      statusMessage: opportunityBody.error.message
    })
  }

  const opportunityResult = await new OpportunityService().createOpportunity(opportunityBody.data.opportunity, opportunityBody.data.optIn)

  if (opportunityResult.isErr) {
    Monitor.error('Error in createOpportunity', { query: opportunityBody.data, error: opportunityResult.error })
    if (opportunityResult.error instanceof ServiceNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: `Opportunity not created: ${opportunityResult.error.message}`
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error: ${opportunityResult.error.message}`
    })
  }

  return opportunityResult.value
})
