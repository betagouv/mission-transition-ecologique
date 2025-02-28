export default defineNuxtRouteMiddleware((to) => {
  useNavigationStore().resetSearchParams()
  const currentQuery = { ...to.query }
  const shouldKeepModal = currentQuery.modal === 'true'
  const newQuery = shouldKeepModal ? { modal: 'true' } : {}

  if (JSON.stringify(currentQuery) !== JSON.stringify(newQuery)) {
    return navigateTo({ ...to, query: newQuery })
  }
})
