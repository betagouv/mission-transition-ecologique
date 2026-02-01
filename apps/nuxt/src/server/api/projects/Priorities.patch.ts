import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // 1. Récupération sécurisée des variables d'environnement
  const config = process.env
  const BASEROW_TOKEN = config.BASEROW_TOKEN
  const TABLE_ID = config.BASEROW_TABLE_ID
  const BASEROW_API_URL = 'https://api.baserow.io'

  if (!BASEROW_TOKEN || !TABLE_ID) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration serveur manquante (Token ou Table ID)'
    })
  }

  try {
    const body = await readBody(event)
    
    if (!body.updates || !Array.isArray(body.updates)) {
      throw createError({ statusCode: 400, statusMessage: 'Payload invalide' })
    }

    // 2. Préparation du Batch Update (Beaucoup plus rapide et sûr)
    const items = body.updates.map((update: any) => {
      const row: any = { id: update.id }
      if (!body.nafCode) {
        row['Prio'] = update.Prio
      } else {
        row['Prios spécifiques'] = update['Prios spécifiques']
      }
      return row
    })

    // Baserow limite à 200 items par patch batch
    const response = await fetch(
      `${BASEROW_API_URL}/api/database/rows/table/${TABLE_ID}/batch/`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    }

    return { success: true, updated: items.length }

  } catch (error: any) {
    console.error('Erreur Baserow:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la mise à jour des données'
    })
  }
})