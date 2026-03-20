import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { AppError } from './appError.js'

type JwtPayload = {
  sub: string
}

export function signAccessToken(input: { customerId: string }): string {
  return jwt.sign({}, env.JWT_SECRET, { subject: input.customerId, expiresIn: '7d' })
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    if (typeof payload !== 'object' || payload === null) throw new Error('Invalid token payload')
    const sub = (payload as { sub?: unknown }).sub
    if (typeof sub !== 'string' || !sub) throw new Error('Invalid subject')
    return { sub }
  } catch {
    throw new AppError({ statusCode: 401, code: 'UNAUTHORIZED', message: 'Token inválido' })
  }
}
