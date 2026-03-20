export type Customer = {
  id: string
  name: string
  email: string
  passwordHash: string
}

export type CustomerPublic = Omit<Customer, 'passwordHash'>
