export default defineEventHandler(async (event) => {
  const TABLE_ID = '790592';
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG';

  const url = `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`;

  try {
    const response = await $fetch<any>(url, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    });

    // TEST 1 : Combien de lignes brutes arrivent ?
    const totalBrut = response.results?.length || 0;
    
    // TEST 2 : Combien ont un titre mais PAS de status ?
    const sansStatus = response.results?.filter((p: any) => !p.status || p.status === "").length;

    console.log(`--- RAPPORT API ---`);
    console.log(`Total brut reçu : ${totalBrut}`);
    console.log(`Projets sans statut : ${sansStatus}`);

    return response.results;
  } catch (error) {
    console.error("Erreur API :", error);
    return [];
  }
});