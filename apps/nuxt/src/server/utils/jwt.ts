import { createHmac, timingSafeEqual } from 'node:crypto'

const base64url = (input: string | Buffer): string => {
  const b64 = Buffer.isBuffer(input) ? input.toString('base64') : Buffer.from(input).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const base64urlDecode = (input: string): string => {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + ((4 - (input.length % 4)) % 4), '=')
  return Buffer.from(padded, 'base64').toString('utf-8')
}

export const signJWT = (payload: object, secret: string, expiresIn = 86400): string => {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  const body = base64url(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }))
  const signature = base64url(createHmac('sha256', secret).update(`${header}.${body}`).digest())
  return `${header}.${body}.${signature}`
}

export const verifyJWT = (token: string, secret: string): Record<string, unknown> => {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token format')

  const [header, body, signature] = parts
  const expectedSig = base64url(createHmac('sha256', secret).update(`${header}.${body}`).digest())

  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSig)

  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    throw new Error('Invalid token signature')
  }

  const payload = JSON.parse(base64urlDecode(body)) as Record<string, unknown>

  if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }

  return payload
}
