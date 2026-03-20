import { randomUUID } from 'node:crypto'
import { db } from '../../../config/db.js'
import type { Order, OrderItem, OrderStatus } from '../domain/orderTypes.js'

type OrderRow = {
  id: string
  customer_id: string | null
  status: string
  total_cents: number
  delivery_address: string
  created_at: Date
}

type OrderItemRow = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price_cents: number
  notes: string
}

function mapOrderRow(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    status: row.status as OrderStatus,
    totalCents: row.total_cents,
    deliveryAddress: row.delivery_address,
    createdAt: row.created_at.toISOString(),
    items,
  }
}

function mapItemRow(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    unitPriceCents: row.unit_price_cents,
    notes: row.notes,
  }
}

export async function createOrder(input: {
  customerId: string
  deliveryAddress: string
  status: OrderStatus
  totalCents: number
  items: Array<{ productId: string; productName: string; quantity: number; unitPriceCents: number; notes: string }>
}): Promise<{ orderId: string }> {
  const k = db()
  const orderId = randomUUID()
  await k.transaction(async (trx) => {
    await trx('orders').insert({
      id: orderId,
      customer_id: input.customerId,
      status: input.status,
      total_cents: input.totalCents,
      delivery_address: input.deliveryAddress,
    })

    await trx('order_items').insert(
      input.items.map((i) => ({
        id: randomUUID(),
        order_id: orderId,
        product_id: i.productId,
        product_name: i.productName,
        quantity: i.quantity,
        unit_price_cents: i.unitPriceCents,
        notes: i.notes,
      })),
    )
  })

  return { orderId }
}

export async function listOrdersByCustomer(input: { customerId: string }): Promise<Order[]> {
  const k = db()
  const orders = await k<OrderRow>('orders')
    .select('*')
    .where({ customer_id: input.customerId })
    .orderBy('created_at', 'desc')

  if (orders.length === 0) return []

  const orderIds = orders.map((o) => o.id)
  const items = await k<OrderItemRow>('order_items').select('*').whereIn('order_id', orderIds)
  const byOrderId = new Map<string, OrderItem[]>()

  for (const item of items) {
    const list = byOrderId.get(item.order_id) ?? []
    list.push(mapItemRow(item))
    byOrderId.set(item.order_id, list)
  }

  return orders.map((o) => mapOrderRow(o, byOrderId.get(o.id) ?? []))
}
