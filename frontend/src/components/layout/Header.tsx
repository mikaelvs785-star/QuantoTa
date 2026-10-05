import { Link, NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="qt-header">
      <div className="qt-header-inner !max-w-none">
        <Link to="/" className="qt-brand" aria-label="QuantoTá - início">
          <span>QuantoTá</span>
          <i className="qt-brand-accent" aria-hidden="true" />
        </Link>

        <nav aria-label="Navegação principal" className="qt-main-nav">
          {[
            ["/", "Início"],
            ["/explorar", "Explorar"],
            ["/lista", "Minha lista"],
            ["/conta", "Conta"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `qt-main-nav-link ${isActive ? "qt-main-nav-link-active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
