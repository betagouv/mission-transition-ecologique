export default defineNuxtRouteMiddleware((to) => {
  useNavigationStore().resetSearchParams()
  const currentQuery = { ...to.query }
  const newQuery: Record<string, string> = {}
  if (currentQuery['theme']) {
    newQuery['theme'] = currentQuery['theme'] as string
  }
  if (currentQuery['profil-entreprise'] === 'oui') {
    newQuery['profil-entreprise'] = 'oui'
  }
  Object.keys(currentQuery).forEach((key) => {
    if (key.toLowerCase().startsWith('utm')) {
      newQuery[key] = currentQuery[key] as string
    }
  })

  if (JSON.stringify(currentQuery) !== JSON.stringify(newQuery)) {
    return navigateTo({ ...to, query: newQuery })
  }
})
