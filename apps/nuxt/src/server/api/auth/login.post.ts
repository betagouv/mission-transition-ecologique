import { createHash } from 'node:crypto'
import { z } from 'zod'
import { signJWT } from '~/server/utils/jwt'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

const parseUsers = (raw: string): Array<{ username: string; passwordHash: string }> => {
  if (!raw) return []
  return raw.split(',').flatMap((entry) => {
    const colonIndex = entry.indexOf(':')
    if (colonIndex === -1) return []
    return [{ username: entry.slice(0, colonIndex).trim(), passwordHash: entry.slice(colonIndex + 1).trim() }]
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readValidatedBody(event, loginSchema.parse)

  const users = parseUsers(config.adminUsers as string)
  const passwordHash = createHash('sha256').update(body.password).digest('hex')
  const user = users.find((u) => u.username === body.username && u.passwordHash === passwordHash)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiant ou mot de passe incorrect' })
  }

  const token = signJWT({ username: user.username }, config.jwtSecret as string)

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400
  })

  return { username: user.username }
})
