import { TrackId } from '@/types'

export default defineNuxtRouteMiddleware((to) => {
  useNavigationStore().resetSearchParams()

  const allParams = Object.entries(to.query)
  const allowedParams = allParams.filter(([key, value]) => isAllowedParam(key, value))

  // Si le nombre de paramètres a changé, cela signifie que nous avons filtré des clés indésirables
  if (allParams.length !== allowedParams.length) {
    return navigateTo({
      ...to,
      query: Object.fromEntries(allowedParams)
    })
  }
})

function isAllowedParam(key: string, value: any): boolean {
  const allowedKeys = ['theme', TrackId.Siret, TrackId.StructureWorkforce]

  if (allowedKeys.includes(key)) {
    return true
  }
  if (key === 'profil-entreprise') {
    return value === 'oui'
  }

  return key.toLowerCase().startsWith('utm')
}
