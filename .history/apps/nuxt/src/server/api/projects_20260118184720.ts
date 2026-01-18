export default defineEventHandler(async (event) => {
  const method = event.method;
  const TABLE_ID = '790592';
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG';

  // --- CAS 1 : RÉCUPÉRATION DES PROJETS (GET) ---
  if (method === 'GET') {
    return await $fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    });
  }

  // --- CAS 2 : SAUVEGARDE DES PRIORITÉS (PATCH) ---
  if (method === 'PATCH') {
    const body = await readBody(event);
    
    const payload = {
      items: body.items.map((i: any) => ({
        id: i.id,
        Prio: i.priorite // On fait bien le lien entre ton code et ta colonne Baserow
      }))
    };

    try {
      return await $fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/batch/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: payload
      });
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la mise à jour Baserow'
      });
    }
  }
});