import { randomUUID } from 'node:crypto'
import { db } from '../../../config/db.js'
import type { Category, Product } from '../domain/catalogTypes.js'

type CategoryRow = {
  id: string
  name: string
  slug: string
}

type ProductRow = {
  id: string
  category_id: string | null
  name: string
  description: string
  price_cents: number
  image_url: string
  active: boolean
}

function mapCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, slug: row.slug }
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    imageUrl: row.image_url,
    active: row.active,
  }
}

export async function listPublicMenu(): Promise<{ categories: Category[]; products: Product[] }> {
  const k = db()
  const [categories, products] = await Promise.all([
    k<CategoryRow>('categories').select('*').orderBy('name', 'asc'),
    k<ProductRow>('products').select('*').where({ active: true }).orderBy('name', 'asc'),
  ])

  return { categories: categories.map(mapCategory), products: products.map(mapProduct) }
}

export async function findProductById(input: { id: string }): Promise<Product | null> {
  const k = db()
  const row = await k<ProductRow>('products').select('*').where({ id: input.id }).first()
  return row ? mapProduct(row) : null
}

export async function seedCatalogIfEmpty(): Promise<void> {
  const k = db()
  const [{ count }] = await k('products').count<{ count: string | number }>({ count: '*' })
  const total = typeof count === 'string' ? Number(count) : (count ?? 0)
  if (total > 0) return

  const categories: CategoryRow[] = [
    { id: randomUUID(), name: 'Pizzas', slug: 'pizzas' },
    { id: randomUUID(), name: 'Bebidas', slug: 'bebidas' },
    { id: randomUUID(), name: 'Sobremesas', slug: 'sobremesas' },
  ]

  const bySlug = new Map(categories.map((c) => [c.slug, c.id]))

  const products: ProductRow[] = [
    {
      id: randomUUID(),
      category_id: bySlug.get('pizzas') ?? null,
      name: 'Margherita',
      description: 'Molho de tomate, muçarela, manjericão e azeite.',
      price_cents: 4490,
      image_url: 'https://images.unsplash.com/photo-1548365328-9bdb51f8c0b1?auto=format&fit=crop&w=900&q=80',
      active: true,
    },
    {
      id: randomUUID(),
      category_id: bySlug.get('pizzas') ?? null,
      name: 'Pepperoni',
      description: 'Muçarela, pepperoni e toque de pimenta.',
      price_cents: 4990,
      image_url: 'https://images.unsplash.com/photo-1601924638867-3ecf0c3a5e3a?auto=format&fit=crop&w=900&q=80',
      active: true,
    },
    {
      id: randomUUID(),
      category_id: bySlug.get('pizzas') ?? null,
      name: 'Frango com Catupiry',
      description: 'Frango desfiado, catupiry e orégano.',
      price_cents: 5290,
      image_url: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?auto=format&fit=crop&w=900&q=80',
      active: true,
    },
    {
      id: randomUUID(),
      category_id: bySlug.get('bebidas') ?? null,
      name: 'Refrigerante 2L',
      description: 'Diversos sabores.',
      price_cents: 1290,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=80',
      active: true,
    },
    {
      id: randomUUID(),
      category_id: bySlug.get('sobremesas') ?? null,
      name: 'Brownie',
      description: 'Chocolate intenso e casquinha crocante.',
      price_cents: 1590,
      image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
      active: true,
    },
  ]

  await k.transaction(async (trx) => {
    await trx('categories').insert(categories)
    await trx('products').insert(products)
  })
}
