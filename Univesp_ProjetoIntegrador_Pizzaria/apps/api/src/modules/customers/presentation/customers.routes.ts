import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { AppError } from '../../../shared/appError.js'
import { signAccessToken } from '../../../shared/auth.js'
import { requireAuth, type AuthenticatedRequest } from '../../../shared/requireAuth.js'
import { createCustomer, findCustomerByEmail, findCustomerById } from '../infrastructure/customerRepository.js'

export const customersRoutes = Router()

customersRoutes.post('/auth/register', async (req, res) => {
  const body = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      cep: z.string().min(8).max(9),
      street: z.string().min(2),
      number: z.string().min(1).max(20),
      complement: z.string().max(60).optional(),
      neighborhood: z.string().min(2),
      city: z.string().min(2),
      state: z.string().min(2).max(2),
    })
    .parse(req.body)

  const existing = await findCustomerByEmail({ email: body.email.toLowerCase() })
  if (existing) throw new AppError({ statusCode: 409, code: 'EMAIL_IN_USE', message: 'E-mail já cadastrado' })

  const passwordHash = await bcrypt.hash(body.password, 10)
  const customer = await createCustomer({
    name: body.name,
    email: body.email.toLowerCase(),
    passwordHash,
    cep: body.cep,
    street: body.street,
    number: body.number,
    complement: body.complement ?? '',
    neighborhood: body.neighborhood,
    city: body.city,
    state: body.state.toUpperCase(),
  })
  const accessToken = signAccessToken({ customerId: customer.id })

  res.status(201).json({
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      cep: customer.cep,
      street: customer.street,
      number: customer.number,
      complement: customer.complement,
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
    },
    accessToken,
  })
})

customersRoutes.post('/auth/login', async (req, res) => {
  const body = z
    .object({
      email: z.string().email(),
      password: z.string().min(1),
    })
    .parse(req.body)

  const customer = await findCustomerByEmail({ email: body.email.toLowerCase() })
  if (!customer) throw new AppError({ statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' })

  const ok = await bcrypt.compare(body.password, customer.passwordHash)
  if (!ok) throw new AppError({ statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' })

  const accessToken = signAccessToken({ customerId: customer.id })
  res.json({
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      cep: customer.cep,
      street: customer.street,
      number: customer.number,
      complement: customer.complement,
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
    },
    accessToken,
  })
})

customersRoutes.get('/me', requireAuth, async (req, res) => {
  const auth = (req as AuthenticatedRequest).auth
  const customer = await findCustomerById({ id: auth.customerId })
  if (!customer) throw new AppError({ statusCode: 401, code: 'UNAUTHORIZED', message: 'Usuário inválido' })
  res.json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    cep: customer.cep,
    street: customer.street,
    number: customer.number,
    complement: customer.complement,
    neighborhood: customer.neighborhood,
    city: customer.city,
    state: customer.state,
  })
})
