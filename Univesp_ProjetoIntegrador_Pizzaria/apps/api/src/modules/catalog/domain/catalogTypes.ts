export type Category = {
  id: string
  name: string
  slug: string
}

export type Product = {
  id: string
  categoryId: string | null
  name: string
  description: string
  priceCents: number
  imageUrl: string
  active: boolean
}
