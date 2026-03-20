export type OrderStatus = 'created' | 'paid' | 'preparing' | 'out_for_delivery' | 'delivered' | 'canceled'

export type OrderItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPriceCents: number
  notes: string
}

export type Order = {
  id: string
  customerId: string | null
  status: OrderStatus
  totalCents: number
  deliveryAddress: string
  createdAt: string
  items: OrderItem[]
}
