import { z } from 'zod'

const updateBodySchema = z.object({
  updates: z.array(
    z.object({
      id: z.number(),
      'Prio': z.number().optional(),
      'Prios spécifiques': z.string().optional()
    })
  ),
  nafCode: z.string().optional()
})

const BASEROW_API_URL = 'https://api.baserow.io'
const BATCH_SIZE = 200

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baserowToken = config.baserowToken
  const tableId = config.baserowTableId

  if (!baserowToken || !tableId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration serveur manquante (Token ou Table ID)'
    })
  }

  const body = await readValidatedBody(event, updateBodySchema.parse)

  const items = body.updates.map((update) => {
    const row: Record<string, number | string> = { id: update.id }
    if (!body.nafCode) {
      if (update['Prio'] !== undefined) row['Prio'] = update['Prio']
    } else {
      if (update['Prios spécifiques'] !== undefined) row['Prios spécifiques'] = update['Prios spécifiques']
    }
    return row
  })

  // Baserow limite à 200 items par batch - on boucle pour couvrir tous les items
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    const response = await fetch(`${BASEROW_API_URL}/api/database/rows/table/${tableId}/batch/?user_field_names=true`, {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${baserowToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: batch })
    })

    console.log('[priorities PATCH] status:', response.status)
    if (!response.ok) {
      const errorData = await response.json()
      console.error('[priorities PATCH] erreur:', JSON.stringify(errorData))
      throw createError({
        statusCode: 500,
        statusMessage: `Erreur Baserow: ${JSON.stringify(errorData)}`
      })
    }
  }

  console.log('[priorities PATCH] succès, items mis à jour:', items.length)
  return { success: true, updated: items.length }
})
