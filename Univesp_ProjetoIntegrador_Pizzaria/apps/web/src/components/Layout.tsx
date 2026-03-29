import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export function Layout() {
  const auth = useAuth();
  const cart = useCart();

  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand">
            <img className="brand__logo" src="/logo.png" alt="Logo da Pizzaria" />
            <span className="brand__text">Pizzaria</span>
          </Link>

          <nav className="nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Início
            </NavLink>
            <a className="nav__link" href="/#cardapio">
              Cardápio
            </a>
            <a className="nav__link" href="/#sobre">
              Sobre
            </a>
            <a className="nav__link" href="/#contato">
              Contato
            </a>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Pedidos
            </NavLink>
          </nav>

          <div className="header__actions">
            <Link to="/checkout" className="chip" aria-label="Carrinho">
              Carrinho
              <span className="chip__badge">{cart.totalItems}</span>
            </Link>
            {auth.customer ? (
              <button
                type="button"
                className="chip chip--ghost"
                onClick={auth.logout}
              >
                Sair ({auth.customer.name.split(" ")[0]})
              </button>
            ) : (
              <Link to="/login" className="chip chip--ghost">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer" id="contato">
        <div className="container footer__grid">
          <div>
            <div className="brand brand--footer">
              <img className="brand__logo" src="/logo.png" alt="Logo da Pizzaria" />
              <span className="brand__text">Pizzaria</span>
            </div>
            <p className="muted">
              Delivery rápido, pedido online e acompanhamento do seu pedido.
            </p>
          </div>
          <div>
            <div className="footer__title">Horário</div>
            <p className="muted">Seg–Dom: 18:00–23:59</p>
          </div>
          <div>
            <div className="footer__title">Contato</div>
            <p className="muted">(11) 0000-0000</p>
            <p className="muted">contato@pizzaria.com</p>
          </div>
        </div>
        <div className="footer__bottom">
          © {new Date().getFullYear()} Pizzaria
        </div>
      </footer>
    </div>
  );
}
