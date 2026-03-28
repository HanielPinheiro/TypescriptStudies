import { useMemo, useState, type FormEvent } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { apiRequest } from "../lib/api";
import { formatBRLFromCents } from "../lib/money";

export function CheckoutPage() {
  const auth = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const hasSavedAddress = Boolean(
    auth.customer?.cep?.trim() &&
      auth.customer?.street?.trim() &&
      auth.customer?.number?.trim() &&
      auth.customer?.neighborhood?.trim() &&
      auth.customer?.city?.trim() &&
      auth.customer?.state?.trim(),
  );

  const savedDeliveryAddress = useMemo(() => {
    if (!auth.customer) return "";
    const c = auth.customer;
    const complement = c.complement?.trim() ? `, ${c.complement.trim()}` : "";
    return `${c.street}, ${c.number}${complement} - ${c.neighborhood}, ${c.city}-${c.state} - CEP ${c.cep}`;
  }, [auth.customer]);

  const [deliveryMode, setDeliveryMode] = useState<"saved" | "other">(
    () => (hasSavedAddress ? "saved" : "other"),
  );
  const [otherDeliveryAddress, setOtherDeliveryAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmpty = cart.items.length === 0;
  const deliveryAddress =
    deliveryMode === "saved" ? savedDeliveryAddress : otherDeliveryAddress;
  const canSubmit = !isEmpty && deliveryAddress.trim().length >= 10 && !loading;

  const from = useMemo(
    () => location.pathname + location.search,
    [location.pathname, location.search],
  );

  if (!auth.token) {
    return <Navigate to="/login" state={{ from }} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{ id: string }>({
        path: "/api/orders",
        method: "POST",
        token: auth.token,
        body: {
          deliveryAddress,
          items: cart.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            notes: i.notes,
            pizza: i.pizza,
          })),
        },
      });
      cart.clear();
      navigate("/orders", { replace: true, state: { highlight: res.id } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Falha ao criar pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container checkout">
      <div className="checkout__head">
        <h2 className="section__title">Finalizar pedido</h2>
        <p className="muted">
          Logado como <strong>{auth.customer?.email}</strong>.{" "}
          <Link to="/">Continuar comprando</Link>
        </p>
      </div>

      <div className="checkout__grid">
        <section className="panel">
          <div className="panel__title">Seu carrinho</div>
          {isEmpty ? (
            <div className="alert">Seu carrinho está vazio.</div>
          ) : null}

          <div className="cartList">
            {cart.items.map((i) => (
              <div key={i.id} className="cartItem">
                <img
                  className="cartItem__img"
                  src={i.imageUrl}
                  alt={i.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className="cartItem__body">
                  <div className="cartItem__top">
                    <div className="cartItem__name">{i.name}</div>
                    <div className="price">
                      {formatBRLFromCents(i.priceCents * i.quantity)}
                    </div>
                  </div>
                  <div className="cartItem__controls">
                    <button
                      type="button"
                      className="qty"
                      onClick={() => cart.setQuantity(i.id, i.quantity - 1)}
                    >
                      –
                    </button>
                    <div className="qty__value">{i.quantity}</div>
                    <button
                      type="button"
                      className="qty"
                      onClick={() => cart.setQuantity(i.id, i.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="linkDanger"
                      onClick={() => cart.removeItem(i.id)}
                    >
                      Remover
                    </button>
                  </div>
                  <label className="field field--tight">
                    <span className="field__label">Observações</span>
                    <input
                      className="input"
                      value={i.notes}
                      onChange={(e) => cart.setNotes(i.id, e.target.value)}
                      placeholder="Ex.: sem cebola, meio a meio..."
                      maxLength={200}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__title">Entrega</div>
          {error ? <div className="alert">{error}</div> : null}

          <form className="form" onSubmit={onSubmit}>
            <label className="field">
              <span className="field__label">Entregar</span>
              <label className="pizzaBuilder__check">
                <input
                  type="radio"
                  name="deliveryMode"
                  value="saved"
                  checked={deliveryMode === "saved"}
                  onChange={() => setDeliveryMode("saved")}
                  disabled={!hasSavedAddress}
                />
                No endereço cadastrado
              </label>
              {hasSavedAddress ? (
                <div className="muted small">{savedDeliveryAddress}</div>
              ) : (
                <div className="muted small">
                  Você ainda não tem endereço cadastrado.
                </div>
              )}
              <label className="pizzaBuilder__check">
                <input
                  type="radio"
                  name="deliveryMode"
                  value="other"
                  checked={deliveryMode === "other"}
                  onChange={() => setDeliveryMode("other")}
                />
                Em outro endereço
              </label>
            </label>

            {deliveryMode === "other" ? (
            <label className="field">
              <span className="field__label">Endereço completo</span>
              <input
                className="input"
                value={otherDeliveryAddress}
                onChange={(e) => setOtherDeliveryAddress(e.target.value)}
                placeholder="Rua, número, bairro, complemento..."
                required
                minLength={10}
              />
            </label>
            ) : null}

            <div className="summary">
              <div className="summary__row">
                <span className="muted">Total</span>
                <span className="summary__total">
                  {formatBRLFromCents(cart.totalCents)}
                </span>
              </div>
              <button className="btn" type="submit" disabled={!canSubmit}>
                {loading ? "Enviando..." : "Confirmar pedido"}
              </button>
              <div className="muted small">
                Pagamento e status ficam prontos para evoluções do projeto.
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
