import { verifyJWT } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  try {
    const payload = verifyJWT(token, config.jwtSecret)
    return { username: payload.username as string }
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Token invalide ou expiré' })
  }
})
