export type Customer = {
  id: string
  name: string
  email: string
  passwordHash: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type CustomerPublic = Omit<Customer, 'passwordHash'>
