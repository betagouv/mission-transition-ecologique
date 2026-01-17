export default defineEventHandler(async (event) => {
  const TABLE_ID = '790592';
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG';

  const url = `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`;

  try {
    const response = await $fetch<any>(url, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    });

    console.log("Nombre reçu de Baserow :", response.results?.length);
    return response.results;
  } catch (error) {
    console.error("Erreur API :", error);
    return [];
  }
});