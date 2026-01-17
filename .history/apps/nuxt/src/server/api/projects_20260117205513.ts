export default defineEventHandler(async () => {
  const BASEROW_TOKEN = 'DfZJPxNKrDKiPlrtNuKjbdZRUFU8h6AG'
  const TABLE_ID = '790592'

  const response = await $fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`, {
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`
    }
  })

  return (response as any).results.map((row: any) => ({
    id: row.id,
    Nom: row.slug || '',
    Titre: row.title || 'Projet sans nom',
    status: row.status || 'autre',
    priorite: row.priority?.default ?? null,
    code_naf: row.sectors || []
  }))
})
