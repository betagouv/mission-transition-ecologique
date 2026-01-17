export default defineEventHandler(async (event) => {
  const TABLE_ID = '790592';
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG';

  // URL sans aucun filtre de vue, ni filtre de colonnes
  const url = `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`;

  try {
    const response = await $fetch<any>(url, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    });

    // On renvoie TOUT ce que Baserow nous donne
    return response.results || [];
  } catch (error) {
    return [];
  }
});