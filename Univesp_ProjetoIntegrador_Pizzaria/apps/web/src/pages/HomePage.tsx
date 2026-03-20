import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { apiRequest } from '../lib/api'
import { formatBRLFromCents } from '../lib/money'

type Category = {
  id: string
  name: string
  slug: string
}

type Product = {
  id: string
  categoryId: string | null
  name: string
  description: string
  priceCents: number
  imageUrl: string
  active: boolean
}

type MenuResponse = {
  categories: Category[]
  products: Product[]
}

export function HomePage() {
  const cart = useCart()
  const [menu, setMenu] = useState<MenuResponse>({ categories: [], products: [] })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    apiRequest<MenuResponse>({ path: '/api/catalog/menu' })
      .then((data) => {
        if (!mounted) return
        setMenu(data)
        setError(null)
      })
      .catch((e: unknown) => {
        if (!mounted) return
        setError(e instanceof Error ? e.message : 'Falha ao carregar cardápio')
      })
    return () => {
      mounted = false
    }
  }, [])

  const products = useMemo(() => {
    if (selectedCategory === 'all') return menu.products
    const category = menu.categories.find((c) => c.slug === selectedCategory)
    if (!category) return menu.products
    return menu.products.filter((p) => p.categoryId === category.id)
  }, [menu, selectedCategory])

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <div className="pill">Pizzas artesanais • Delivery</div>
            <h1 className="hero__title">Seu pedido em poucos cliques.</h1>
            <p className="hero__subtitle">
              Escolha o sabor, personalize, finalize e acompanhe tudo sem depender de atendente.
            </p>
            <div className="hero__actions">
              <a className="btn" href="/#cardapio">
                Ver cardápio
              </a>
              <a className="btn btn--ghost" href="/#sobre">
                Como funciona
              </a>
            </div>
            <div className="hero__stats">
              <div className="stat">
                <div className="stat__value">30–45</div>
                <div className="stat__label">min entrega</div>
              </div>
              <div className="stat">
                <div className="stat__value">100%</div>
                <div className="stat__label">pedido online</div>
              </div>
              <div className="stat">
                <div className="stat__value">Pix</div>
                <div className="stat__label">e cartão</div>
              </div>
            </div>
          </div>

          <div className="hero__card" aria-hidden="true">
            <div className="hero__image" />
            <div className="hero__cardBody">
              <div className="hero__cardTitle">Promo do dia</div>
              <div className="hero__cardText">Margherita + Refrigerante 2L</div>
              <div className="hero__cardPrice">R$ 59,90</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="cardapio">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 className="section__title">Cardápio</h2>
              <p className="muted">Escolha seus itens e adicione ao carrinho.</p>
            </div>
            <div className="filters">
              <button
                type="button"
                className={selectedCategory === 'all' ? 'filter filter--active' : 'filter'}
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </button>
              {menu.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={selectedCategory === c.slug ? 'filter filter--active' : 'filter'}
                  onClick={() => setSelectedCategory(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {error ? <div className="alert">{error}</div> : null}

          <div className="grid">
            {products.map((p) => (
              <article key={p.id} className="card">
                <div className="card__media" style={{ backgroundImage: `url(${p.imageUrl})` }} />
                <div className="card__body">
                  <div className="card__top">
                    <div className="card__title">{p.name}</div>
                    <div className="price">{formatBRLFromCents(p.priceCents)}</div>
                  </div>
                  <div className="card__desc">{p.description}</div>
                  <button
                    type="button"
                    className="btn btn--small"
                    onClick={() => cart.addItem({ productId: p.id, name: p.name, imageUrl: p.imageUrl, priceCents: p.priceCents })}
                  >
                    Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" id="sobre">
        <div className="container about">
          <div>
            <h2 className="section__title">Automação para delivery</h2>
            <p className="muted">
              Um fluxo simples: escolha → carrinho → pagamento → entrega. Ideal para reduzir custo de atendimento e aumentar produtividade.
            </p>
            <div className="steps">
              <div className="step">
                <div className="step__n">1</div>
                <div>
                  <div className="step__t">Escolha</div>
                  <div className="muted">Cardápio com imagens e preços.</div>
                </div>
              </div>
              <div className="step">
                <div className="step__n">2</div>
                <div>
                  <div className="step__t">Personalize</div>
                  <div className="muted">Observações por item e endereço.</div>
                </div>
              </div>
              <div className="step">
                <div className="step__n">3</div>
                <div>
                  <div className="step__t">Acompanhe</div>
                  <div className="muted">Histórico de pedidos no seu perfil.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="about__box">
            <div className="quote">
              <div className="quote__text">“Interface rápida e fácil. Em 2 minutos fechei meu pedido.”</div>
              <div className="quote__author">Cliente</div>
            </div>
            <div className="quote">
              <div className="quote__text">“Reduzimos tempo de atendimento e erros de anotação.”</div>
              <div className="quote__author">Gestor</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

