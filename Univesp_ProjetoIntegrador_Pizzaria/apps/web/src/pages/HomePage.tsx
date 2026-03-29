import { useEffect, useMemo, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { apiRequest } from "../lib/api";
import { formatBRLFromCents } from "../lib/money";

type Category = {
  id: string;
  name: string;
  slug: string;
};
//asd
type Product = {
  id: string;
  categoryId: string | null;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  active: boolean;
};

type MenuResponse = {
  categories: Category[];
  products: Product[];
};

export function HomePage() {
  const cart = useCart();
  const [menu, setMenu] = useState<MenuResponse>({
    categories: [],
    products: [],
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [pizzaOpen, setPizzaOpen] = useState(false);
  const [pizzaSplit, setPizzaSplit] = useState<1 | 2 | 3>(1);
  const [pizzaFlavorIds, setPizzaFlavorIds] = useState<string[]>([]);
  const [pizzaStuffedCrust, setPizzaStuffedCrust] = useState(false);

  useEffect(() => {
    let mounted = true;
    apiRequest<MenuResponse>({ path: "/api/catalog/menu" })
      .then((data) => {
        if (!mounted) return;
        setMenu(data);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Falha ao carregar cardápio");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const STUFFED_CRUST_EXTRA_CENTS = 890;

  const categoriesById = useMemo(() => {
    return new Map(menu.categories.map((c) => [c.id, c]));
  }, [menu.categories]);

  const pizzaCategoryId = useMemo(() => {
    return menu.categories.find((c) => c.slug === "pizzas")?.id ?? null;
  }, [menu.categories]);

  const pizzaBase = useMemo(() => {
    return (
      menu.products.find(
        (p) =>
          p.categoryId === pizzaCategoryId && p.name.includes("Monte a sua"),
      ) ?? null
    );
  }, [menu.products, pizzaCategoryId]);

  const pizzaFlavors = useMemo(() => {
    if (!pizzaCategoryId) return [];
    return menu.products.filter(
      (p) =>
        p.categoryId === pizzaCategoryId && !p.name.includes("Monte a sua"),
    );
  }, [menu.products, pizzaCategoryId]);

  const pizzaFromCents = useMemo(() => {
    const prices = pizzaFlavors.map((p) => p.priceCents);
    return prices.length ? Math.min(...prices) : 0;
  }, [pizzaFlavors]);

  const pizzaFlavorsById = useMemo(() => {
    return new Map(pizzaFlavors.map((p) => [p.id, p]));
  }, [pizzaFlavors]);

  const selectedFlavors = useMemo(() => {
    return pizzaFlavorIds
      .map((id) => pizzaFlavorsById.get(id))
      .filter((p): p is Product => Boolean(p));
  }, [pizzaFlavorIds, pizzaFlavorsById]);

  const pizzaUnitPriceCents = useMemo(() => {
    if (selectedFlavors.length === 0) return 0;
    return Math.max(...selectedFlavors.map((p) => p.priceCents));
  }, [selectedFlavors]);

  const pizzaTotalCents =
    pizzaUnitPriceCents + (pizzaStuffedCrust ? STUFFED_CRUST_EXTRA_CENTS : 0);

  const pizzaCanConfirm =
    Boolean(pizzaBase) && pizzaFlavorIds.length === pizzaSplit;

  function openPizzaBuilder(initialFlavorId?: string) {
    setPizzaOpen(true);
    setPizzaSplit(1);
    setPizzaStuffedCrust(false);
    setPizzaFlavorIds(initialFlavorId ? [initialFlavorId] : []);
  }

  function closePizzaBuilder() {
    setPizzaOpen(false);
    setPizzaSplit(1);
    setPizzaStuffedCrust(false);
    setPizzaFlavorIds([]);
  }

  function toggleFlavor(id: string) {
    setPizzaFlavorIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= pizzaSplit)
        return [...prev.slice(0, pizzaSplit - 1), id];
      return [...prev, id];
    });
  }

  function confirmPizza() {
    if (!pizzaBase) return;
    if (pizzaFlavorIds.length !== pizzaSplit) return;
    const flavorsLabel = selectedFlavors.map((f) => f.name).join(" / ");
    const suffix = pizzaStuffedCrust ? " + borda recheada" : "";
    const pizzaName = `Pizza 8 pedaços (${pizzaSplit} sabor${
      pizzaSplit > 1 ? "es" : ""
    }): ${flavorsLabel}${suffix}`;
    const notes = `Sabores: ${flavorsLabel}${
      pizzaStuffedCrust ? " • Borda recheada" : ""
    }`;
    const imageUrl = selectedFlavors[0]?.imageUrl ?? pizzaBase.imageUrl;

    cart.addItem({
      productId: pizzaBase.id,
      name: pizzaName,
      imageUrl,
      priceCents: pizzaTotalCents,
      notes,
      pizza: { flavorIds: pizzaFlavorIds, stuffedCrust: pizzaStuffedCrust },
    });

    closePizzaBuilder();
  }

  const products = useMemo(() => {
    if (selectedCategory === "all") return menu.products;
    const category = menu.categories.find((c) => c.slug === selectedCategory);
    if (!category) return menu.products;
    return menu.products.filter((p) => p.categoryId === category.id);
  }, [menu, selectedCategory]);

  const categoriesForAll = useMemo(() => {
    const order = ["pizzas", "bebidas", "sobremesas"];
    const bySlug = new Map(menu.categories.map((c) => [c.slug, c]));
    const prioritized = order
      .map((slug) => bySlug.get(slug))
      .filter((c): c is Category => Boolean(c));
    const rest = menu.categories.filter((c) => !order.includes(c.slug));
    return [...prioritized, ...rest];
  }, [menu.categories]);

  function renderProductCard(p: Product) {
    return (
      <article key={p.id} className="card">
        <img
          className="card__media"
          src={p.imageUrl}
          alt={p.name}
          loading="lazy"
          decoding="async"
        />
        <div className="card__body">
          <div className="card__top">
            <div className="card__title">{p.name}</div>
            <div className="price">
              {(() => {
                const slug = p.categoryId
                  ? categoriesById.get(p.categoryId)?.slug
                  : null;
                const isPizza = slug === "pizzas";
                const isPizzaBaseProduct =
                  isPizza && p.name.includes("Monte a sua");
                if (isPizzaBaseProduct) {
                  return `A partir de ${formatBRLFromCents(pizzaFromCents)}`;
                }
                return formatBRLFromCents(p.priceCents);
              })()}
            </div>
          </div>
          <div className="card__desc">{p.description}</div>
          <button
            type="button"
            className="btn btn--small"
            onClick={() => {
              const slug = p.categoryId
                ? categoriesById.get(p.categoryId)?.slug
                : null;
              const isPizza = slug === "pizzas";
              const isPizzaBaseProduct =
                isPizza && p.name.includes("Monte a sua");
              if (isPizzaBaseProduct) {
                openPizzaBuilder();
                return;
              }
              if (isPizza) {
                openPizzaBuilder(p.id);
                return;
              }
              cart.addItem({
                productId: p.id,
                name: p.name,
                imageUrl: p.imageUrl,
                priceCents: p.priceCents,
              });
            }}
          >
            {(() => {
              const slug = p.categoryId
                ? categoriesById.get(p.categoryId)?.slug
                : null;
              const isPizza = slug === "pizzas";
              return isPizza ? "Personalizar" : "Adicionar";
            })()}
          </button>
        </div>
      </article>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <div className="pill">Pizzas artesanais • Delivery</div>
            <h1 className="hero__title">Seu pedido em poucos cliques.</h1>
            <p className="hero__subtitle">
              Escolha o sabor, personalize, finalize e acompanhe tudo sem
              depender de atendente.
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
            <img
              className="hero__image"
              alt=""
              src="/images/pizzas/hero-pizza.jpg"
              loading="lazy"
              decoding="async"
            />
            <div className="hero__cardBody">
              <div className="hero__cardTitle">Promo do dia</div>
              <div className="hero__cardText">
                Bacon com cheddar + Refrigerante 2L
              </div>
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
              <p className="muted">
                Escolha seus itens e adicione ao carrinho.
              </p>
            </div>
            <div className="filters">
              <button
                type="button"
                className={
                  selectedCategory === "all"
                    ? "filter filter--active"
                    : "filter"
                }
                onClick={() => setSelectedCategory("all")}
              >
                Todos
              </button>
              {menu.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={
                    selectedCategory === c.slug
                      ? "filter filter--active"
                      : "filter"
                  }
                  onClick={() => setSelectedCategory(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {error ? <div className="alert">{error}</div> : null}

          {selectedCategory === "all" ? (
            <div className="menuGroups">
              {categoriesForAll.map((c) => {
                const items = menu.products.filter(
                  (p) => p.categoryId === c.id,
                );
                if (!items.length) return null;
                return (
                  <div key={c.id} className="panel">
                    <div className="panel__title">{c.name}</div>
                    <div className="grid">{items.map(renderProductCard)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid">{products.map(renderProductCard)}</div>
          )}
        </div>
      </section>

      {pizzaOpen ? (
        <div className="modalOverlay" role="dialog" aria-modal="true">
          <div className="modal panel">
            <div className="modal__head">
              <div className="panel__title">Monte sua pizza (8 pedaços)</div>
              <button
                type="button"
                className="modal__close"
                onClick={closePizzaBuilder}
              >
                Fechar
              </button>
            </div>

            <div className="pizzaBuilder">
              <div className="pizzaBuilder__row">
                <div className="muted small">Quantos sabores?</div>
                <div className="pizzaBuilder__chips">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={
                        pizzaSplit === n ? "chip chip--active" : "chip"
                      }
                      onClick={() => {
                        const next = n as 1 | 2 | 3;
                        setPizzaSplit(next);
                        setPizzaFlavorIds((prev) => prev.slice(0, next));
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pizzaBuilder__row">
                <div className="muted small">
                  Escolha {pizzaSplit} sabor{pizzaSplit > 1 ? "es" : ""}:
                </div>
                <div className="pizzaBuilder__flavors">
                  {pizzaFlavors.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={
                        pizzaFlavorIds.includes(f.id)
                          ? "flavorBtn flavorBtn--active"
                          : "flavorBtn"
                      }
                      onClick={() => toggleFlavor(f.id)}
                    >
                      <span className="flavorBtn__name">{f.name}</span>
                      <span className="flavorBtn__price">
                        {formatBRLFromCents(f.priceCents)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="pizzaBuilder__check">
                <input
                  type="checkbox"
                  checked={pizzaStuffedCrust}
                  onChange={(e) => setPizzaStuffedCrust(e.target.checked)}
                />
                <span>
                  Borda recheada de Catupiry (+{" "}
                  {formatBRLFromCents(STUFFED_CRUST_EXTRA_CENTS)})
                </span>
              </label>

              <div className="pizzaBuilder__footer">
                <div>
                  <div className="muted small">Preço</div>
                  <div className="summary__total">
                    {formatBRLFromCents(pizzaTotalCents)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn"
                  disabled={!pizzaCanConfirm}
                  onClick={confirmPizza}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="section section--alt" id="sobre">
        <div className="container about">
          <div>
            <h2 className="section__title">Automação para delivery</h2>
            <p className="muted">
              Um fluxo simples: escolha → carrinho → pagamento → entrega. Ideal
              para reduzir custo de atendimento e aumentar produtividade.
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
                  <div className="muted">
                    Histórico de pedidos no seu perfil.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about__box">
            <div className="quote">
              <div className="quote__text">
                “Interface rápida e fácil. Em 2 minutos fechei meu pedido.”
              </div>
              <div className="quote__author">Cliente</div>
            </div>
            <div className="quote">
              <div className="quote__text">
                “Reduzimos tempo de atendimento e erros de anotação.”
              </div>
              <div className="quote__author">Gestor</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
