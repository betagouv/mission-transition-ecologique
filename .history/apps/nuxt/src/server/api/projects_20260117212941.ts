// server/api/projects.ts
export default defineEventHandler(async (event) => {
  const TABLE_ID = '790592';
  // On demande 150 lignes ET on ne demande que les colonnes utiles
  // Cela réduit la taille du transfert par 10 !
  const params = new URLSearchParams({
    user_field_names: 'true',
    size: '150',
    include: 'id,title,sectors,priority,status' // <--- On ignore les descriptions lourdes
  });

  const response = await $fetch<any>(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?${params}`, {
    headers: { Authorization: `Token ${BASEROW_TOKEN}` }
  });

  console.log("RECU DE BASEROW:", response.results.length); // Vérifie ton terminal Nuxt
  return response.results;
});