export default defineNuxtRouteMiddleware((to) => {
  useNavigationStore().resetSearchParams()
  const currentQuery = { ...to.query }
  const shouldKeepRegisterModal = currentQuery['profil-entreprise'] === 'oui'
  const newQuery = shouldKeepRegisterModal ? { 'profil-entreprise': 'oui' } : {}

  if (JSON.stringify(currentQuery) !== JSON.stringify(newQuery)) {
    return navigateTo({ ...to, query: newQuery })
  }
})
