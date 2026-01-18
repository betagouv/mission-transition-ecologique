export default defineEventHandler(async (event) => {
  const method = event.method
  const TABLE_ID = '790592'
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG'

  if (method === 'GET') {
    return await $fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    })
  }

  // Construction du payload pour Baserow
  if (method === 'PATCH') {
    // On ne lit le body QUE si on est en PATCH
    const body = await readBody(event);

    // On prépare les données pour Baserow
    const payload = {
      items: body.items.map((i: any) => ({
        id: i.id,
        Prio: i.priorite
      }))
    }

    try {
      return await $fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/batch/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: payload
      })
    } catch (error) {
      console.error("Erreur lors du batch update Baserow:", error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la sauvegarde des priorités'
      })
    }
  }
})