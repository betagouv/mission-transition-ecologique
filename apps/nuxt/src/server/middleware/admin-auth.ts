import { verifyJWT } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
  const path = event.path ?? ''

  if (path.startsWith('/api/auth/')) return
  if (!path.startsWith('/api/projects/priorities')) return

  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  try {
    const payload = verifyJWT(token, config.jwtSecret)
    event.context.user = { username: payload.username }
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Token invalide ou expiré' })
  }
})
