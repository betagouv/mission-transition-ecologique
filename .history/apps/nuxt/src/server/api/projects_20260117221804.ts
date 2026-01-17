// server/api/projects.ts
export default defineEventHandler(async (event) => {
  const TABLE_ID = '790592';
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG';

  // AJOUT : On force l'utilisation de la table brute sans passer par une vue potentiellement filtrée
  const url = `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`;

  try {
    const response = await $fetch<any>(url, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    });

    // On logue ici pour le voir dans le TERMINAL (Image 1)
    console.log("--- DEBUG BASEROW ---");
    console.log("Nombre total reçu :", response.results?.length);
    
    return response.results;
  } catch (error) {
    console.error("Erreur API :", error);
    return [];
  }
});