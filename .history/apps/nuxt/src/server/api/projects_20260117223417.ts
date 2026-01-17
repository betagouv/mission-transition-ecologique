export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const TABLE_ID = '790592'
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG'

  // Format attendu par Baserow pour un PATCH multiple : { items: [{id: 1, Champ: valeur}, ...] }
  const payload = {
    items: body.items.map((i: any) => ({
      id: i.id,
      priorite: i.priorite // Remplace par le nom exact de ta colonne dans Baserow
    }))
  }

  return await $fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/batch/`, {
    method: 'PATCH',
    headers: { 
      Authorization: `Token ${BASEROW_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: payload
  })
})