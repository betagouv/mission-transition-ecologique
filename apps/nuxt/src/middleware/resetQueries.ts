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
  if (JSON.stringify(currentQuery) !== JSON.stringify(newQuery)) {
    return navigateTo({ ...to, query: newQuery })
  }
})
