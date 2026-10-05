import { Outlet, useLocation, NavLink, Link } from "react-router-dom";
import {
  House,
  Search,
  ListChecks,
  CircleUserRound,
  Package,
  Store,
  Tags,
  Users,
  Images,
  ArrowLeft,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { usePermissions } from "@/hooks/usePermissions";

const customerLinks = [
  { label: "Início", icon: House, to: "/" },
  { label: "Explorar", icon: Search, to: "/explorar" },
  { label: "Lista", icon: ListChecks, to: "/lista" },
  { label: "Conta", icon: CircleUserRound, to: "/conta" },
];

export function MainLayout() {
  const { pathname } = useLocation();
  const { data: p } = usePermissions();
  const management =
    Boolean(p?.gerenciarPrecos || p?.gerenciarProdutos) &&
    /^\/(catalogo|precos|produtos|mercados|usuarios|vitrine)(\/|$)/.test(
      pathname,
    );
  const home = pathname === "/";
  const links = [
    { label: "Catálogo", icon: Package, to: "/catalogo?aba=produtos" },
    { label: "Meus mercados", icon: Store, to: "/catalogo?aba=mercados" },
    { label: "Ofertas e preços", icon: Tags, to: "/precos" },
    ...(p?.gerenciarUsuarios
      ? [
          { label: "Usuários", icon: Users, to: "/usuarios" },
          { label: "Vitrine", icon: Images, to: "/vitrine" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className={management ? "mx-auto flex max-w-[1600px]" : ""}>
        {management && (
          <aside className="hidden w-60 shrink-0 border-r px-5 py-9 lg:block">
            <p className="qt-eyebrow mb-5">GESTÃO DO QUANTOTÁ</p>
            <nav aria-label="Gestão" className="space-y-2">
              {links.map(({ label, icon: Icon, to }) => (
                <NavLink key={to} to={to} className="qt-nav-item">
                  <Icon className="size-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <Link className="qt-nav-item mt-8" to="/">
              <ArrowLeft className="size-5" />
              Ver como cliente
            </Link>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          {management && (
            <nav
              aria-label="Gestão móvel"
              className="flex gap-2 overflow-x-auto border-b p-3 lg:hidden"
            >
              {links.map(({ label, to }) => (
                <Link key={to} to={to} className="qt-chip shrink-0">
                  {label}
                </Link>
              ))}
            </nav>
          )}

          <main
            className={
              home
                ? "mx-auto max-w-[1460px] px-3 pb-24 pt-3 sm:px-5 sm:pt-4 lg:px-6 lg:pb-8"
                : "mx-auto max-w-[1320px] p-4 pb-24 sm:p-6 sm:pb-24 lg:px-10 lg:py-9"
            }
          >
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <TabBar items={customerLinks} />
    </div>
  );
}
