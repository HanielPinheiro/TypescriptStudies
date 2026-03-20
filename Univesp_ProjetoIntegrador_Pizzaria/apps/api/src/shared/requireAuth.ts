import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from './auth.js'

export type AuthenticatedRequest = Request & { auth: { customerId: string } }

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization') ?? ''
  const [kind, token] = header.split(' ')
  if (kind !== 'Bearer' || !token) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token ausente' })
    return
  }

  const payload = verifyAccessToken(token)
  ;(req as AuthenticatedRequest).auth = { customerId: payload.sub }
  next()
}
