const BASEROW_API_URL = 'https://api.baserow.io'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const baserowToken = config.baserowToken
  const tableId = config.baserowTableId

  if (!baserowToken || !tableId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration serveur manquante (Token ou Table ID)'
    })
  }

  const allRows: unknown[] = []
  let currentPage = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(
      `${BASEROW_API_URL}/api/database/rows/table/${tableId}/?user_field_names=true&size=200&page=${currentPage}`,
      {
        headers: { Authorization: `Token ${baserowToken}` }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: 500,
        statusMessage: `Erreur Baserow: ${JSON.stringify(errorData)}`
      })
    }

    const data = await response.json()
    allRows.push(...data.results)
    hasMore = data.next !== null
    currentPage++
  }

  return allRows
})
