import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiRequest } from '../lib/api'
import { formatBRLFromCents } from '../lib/money'

type OrderItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPriceCents: number
  notes: string
}

type Order = {
  id: string
  status: string
  totalCents: number
  deliveryAddress: string
  createdAt: string
  items: OrderItem[]
}

type OrdersResponse = { orders: Order[] }

export function OrdersPage() {
  const auth = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  const from = useMemo(() => location.pathname + location.search, [location.pathname, location.search])

  useEffect(() => {
    if (!auth.token) return
    let mounted = true
    apiRequest<OrdersResponse>({ path: '/api/orders/mine', token: auth.token })
      .then((res) => {
        if (!mounted) return
        setOrders(res.orders)
        setError(null)
      })
      .catch((e: unknown) => {
        if (!mounted) return
        setError(e instanceof Error ? e.message : 'Falha ao carregar pedidos')
      })
    return () => {
      mounted = false
    }
  }, [auth.token])

  if (!auth.token) return <Navigate to="/login" state={{ from }} replace />

  return (
    <div className="container orders">
      <div className="orders__head">
        <h2 className="section__title">Meus pedidos</h2>
        <p className="muted">Acompanhe seu histórico e detalhes.</p>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      <div className="orders__grid">
        {orders.map((o) => (
          <article key={o.id} className="panel">
            <div className="orderTop">
              <div>
                <div className="orderTop__id">Pedido {o.id.slice(0, 8)}</div>
                <div className="muted small">{new Date(o.createdAt).toLocaleString('pt-BR')}</div>
              </div>
              <div className="orderTop__right">
                <span className="status">{o.status}</span>
                <span className="summary__total">{formatBRLFromCents(o.totalCents)}</span>
              </div>
            </div>

            <div className="muted small">{o.deliveryAddress}</div>

            <div className="orderItems">
              {o.items.map((i) => (
                <div key={i.id} className="orderItem">
                  <div className="orderItem__name">
                    {i.quantity}× {i.productName}
                  </div>
                  <div className="orderItem__price">{formatBRLFromCents(i.unitPriceCents * i.quantity)}</div>
                  {i.notes ? <div className="orderItem__notes">{i.notes}</div> : null}
                </div>
              ))}
            </div>
          </article>
        ))}
        {orders.length === 0 && !error ? <div className="alert">Você ainda não tem pedidos.</div> : null}
      </div>
    </div>
  )
}

