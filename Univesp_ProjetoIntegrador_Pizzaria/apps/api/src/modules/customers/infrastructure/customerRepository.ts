import { randomUUID } from 'node:crypto'
import { db } from '../../../config/db.js'
import type { Customer } from '../domain/customerTypes.js'

type CustomerRow = {
  id: string
  name: string
  email: string
  password_hash: string
}

function mapCustomer(row: CustomerRow): Customer {
  return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash }
}

export async function findCustomerByEmail(input: { email: string }): Promise<Customer | null> {
  const k = db()
  const row = await k<CustomerRow>('customers').select('*').where({ email: input.email }).first()
  return row ? mapCustomer(row) : null
}

export async function findCustomerById(input: { id: string }): Promise<Customer | null> {
  const k = db()
  const row = await k<CustomerRow>('customers').select('*').where({ id: input.id }).first()
  return row ? mapCustomer(row) : null
}

export async function createCustomer(input: {
  name: string
  email: string
  passwordHash: string
}): Promise<Customer> {
  const k = db()
  const customer: Customer = { id: randomUUID(), name: input.name, email: input.email, passwordHash: input.passwordHash }
  await k('customers').insert({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    password_hash: customer.passwordHash,
  })
  return customer
}

