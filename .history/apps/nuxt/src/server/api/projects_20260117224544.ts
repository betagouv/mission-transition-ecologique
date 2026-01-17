export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const TABLE_ID = '790592'
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG'

  // Construction du payload pour Baserow
  const payload = {
    items: body.items.map((i: any) => ({
      // Baserow a toujours besoin de l'id technique de la ligne pour savoir quoi modifier
      id: i.id, 
      // On utilise "Prio" comme nom de clé car c'est le nom de ta colonne Baserow
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
})