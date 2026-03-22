import { z } from 'zod'

const updateBodySchema = z.object({
  updates: z.array(
    z.object({
      id: z.number(),
      titre: z.string().optional(),
      oldPrio: z.number().optional(),
      Prio: z.number().optional(),
      oldPriosSpec: z.string().optional(),
      'Prios spécifiques': z.string().optional()
    })
  ),
  nafCode: z.string().optional()
})

const BASEROW_API_URL = 'https://api.baserow.io'
const BATCH_SIZE = 200

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baserowToken = config.baserowToken as string
  const tableId = config.baserowTableId as string
  const historyTableId = config.baserowHistoryTableId as string

  if (!baserowToken || !tableId) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration serveur manquante (Token ou Table ID)' })
  }

  const body = await readValidatedBody(event, updateBodySchema.parse)
  const username = (event.context.user as { username?: string } | undefined)?.username ?? 'inconnu'

  // Prépare les items à envoyer à Baserow (sans les champs "avant")
  const items = body.updates.map((update) => {
    const row: Record<string, number | string> = { id: update.id }
    if (!body.nafCode) {
      if (update['Prio'] !== undefined) row['Prio'] = update['Prio']
    } else {
      if (update['Prios spécifiques'] !== undefined) row['Prios spécifiques'] = update['Prios spécifiques']
    }
    return row
  })

  // Envoi par batch de 200
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    const response = await fetch(`${BASEROW_API_URL}/api/database/rows/table/${tableId}/batch/?user_field_names=true`, {
      method: 'PATCH',
      headers: { Authorization: `Token ${baserowToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: batch })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw createError({ statusCode: 500, statusMessage: `Erreur Baserow: ${JSON.stringify(errorData)}` })
    }
  }

  // Log dans l'historique Baserow
  if (historyTableId) {
    const nafCode = body.nafCode ?? ''

    const extractNafValue = (priosSpec: string): string => {
      const regex = new RegExp(`(?:^|\\s)${nafCode.replace(/\./g, '\\.')}:([0-9]+\\.?[0-9]*)(?:\\s|$)`)
      const match = priosSpec.match(regex)
      return match ? match[1] : 'N/A'
    }

    const formatLine = (u: (typeof body.updates)[number], type: 'avant' | 'après'): string => {
      const titre = u.titre || `#${u.id}`
      const val = nafCode
        ? extractNafValue(type === 'avant' ? (u.oldPriosSpec ?? '') : (u['Prios spécifiques'] ?? ''))
        : String(type === 'avant' ? (u.oldPrio ?? 'N/A') : (u['Prio'] ?? 'N/A'))
      return `${titre} : ${val}`
    }

    const avant = body.updates.map((u) => formatLine(u, 'avant')).join('\n')
    const après = body.updates.map((u) => formatLine(u, 'après')).join('\n')

    // POST vers la table Historique de Baserow
    const historyResponse = await fetch(`${BASEROW_API_URL}/api/database/rows/table/${historyTableId}/?user_field_names=true`, {
      method: 'POST',
      headers: { Authorization: `Token ${baserowToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'Utilisateur': username,
        'Date': new Date().toISOString().slice(0, 19).replace('T', ' '),
        'Code NAF': body.nafCode ?? '',
        'Nombre projets': items.length,
        'Avant modifications': avant,
        'Après modifications': après
      })
    })

    // Log l'erreur dans le terminal si l'historique échoue (non bloquant pour l'utilisateur)
    if (!historyResponse.ok) {
      const err = await historyResponse.json().catch(() => historyResponse.statusText)
      console.error('[Historique] Erreur POST Baserow:', JSON.stringify(err))
    }
  }

  return { success: true, updated: items.length }
})
