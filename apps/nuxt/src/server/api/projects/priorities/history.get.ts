import type { HistoryEntry } from '~/types/baserow'

const BASEROW_API_URL = 'https://api.baserow.io'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const baserowToken = config.baserowToken as string
  const historyTableId = config.baserowHistoryTableId as string

  if (!historyTableId) return []

  const response = await fetch(
    `${BASEROW_API_URL}/api/database/rows/table/${historyTableId}/?user_field_names=true&size=50`,
    { headers: { Authorization: `Token ${baserowToken}` } }
  )

  if (!response.ok) return []

  const data = await response.json()

  return (data.results ?? []).map((row: Record<string, unknown>) => ({
    id: row['id'] as number,
    date: row['Date'] as string,
    user: row['Utilisateur'] as string,
    nafCode: row['Code NAF'] as string,
    count: row['Nombre projets'] as number,
    avant: row['Avant modifications'] as string,
    après: row['Après modifications'] as string
  })) as HistoryEntry[]
})
