export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const TABLE_ID = '790592' // ID de ta table Baserow
  
  // 1. On définit les colonnes strictement nécessaires pour la liste
  // Cela rend la réponse 10x plus légère et évite les coupures
  const fields = ['id', 'title', 'sectors', 'priority', 'status'].join(',')

  // 2. On construit l'URL avec 'size=150' pour être large
  const url = `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=150&include=${fields}`

  try {
    const response = await $fetch<any>(url, {
      headers: {
        Authorization: `Token ${config.baserowToken || 'TON_TOKEN_ICI'}`
      }
    })

    // On retourne le tableau de résultats
    return response.results || []
  } catch (error) {
    console.error('Erreur API Baserow:', error)
    return []
  }
})