import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { PrivateRoute } from "./PrivateRoute";
import { PermissionRoute } from "./PermissionRoute";
const Explorar = lazy(() => import("../pages/Explorar"));
const Vitrine = lazy(() => import("../pages/Vitrine"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Catalogo = lazy(() => import("../pages/Catalogo"));
const Comparador = lazy(() => import("../pages/Comparator"));
const Lista = lazy(() => import("../pages/Lista"));
const Configuracoes = lazy(() => import("../pages/Configuracoes"));
const Precos = lazy(() => import("../pages/Precos"));
const Users = lazy(() => import("../pages/Users"));
const ProductEditor = lazy(() =>
  import("../pages/Products/ProductEditorPage").then((m) => ({
    default: m.ProductEditorPage,
  })),
);
const MarketEditor = lazy(() =>
  import("../pages/Markets/MarketEditorPage").then((m) => ({
    default: m.MarketEditorPage,
  })),
);
function RouteRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  const { id = "" } = useParams();
  const [path, defaults] = to.replace(":id", id).split("?");
  const params = new URLSearchParams(search);
  new URLSearchParams(defaults).forEach((value, key) => params.set(key, value));
  const query = params.toString();
  return <Navigate to={path + (query ? "?" + query : "") + hash} replace />;
}
const aliases: Record<string, string> = {
  "/dashboard": "/",
  "/usuarios/novo": "/usuarios?novo=1",
  "/cliente": "/",
  "/cliente/dashboard": "/",
  "/admin": "/",
  "/admin/dashboard": "/",
  "/cliente/comparador": "/comparar",
  "/cliente/mercados": "/catalogo?aba=mercados",
  "/mercados": "/catalogo?aba=mercados",
  "/produtos": "/catalogo?aba=produtos",
  "/admin/produtos": "/catalogo?aba=produtos",
  "/admin/mercados": "/catalogo?aba=mercados",
  "/admin/produtos/novo": "/produtos/novo",
  "/admin/produtos/:id": "/produtos/:id/editar",
  "/admin/produtos/:id/editar": "/produtos/:id/editar",
  "/admin/mercados/novo": "/mercados/novo",
  "/admin/mercados/:id": "/mercados/:id/editar",
  "/admin/mercados/:id/editar": "/mercados/:id/editar",
  "/cliente/lista": "/lista",
  "/cliente/configuracoes": "/conta",
  "/admin/precos": "/precos",
  "/admin/usuarios": "/usuarios",
  "/admin/usuarios/novo": "/usuarios?novo=1",
};
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <p role="status" className="p-8">
            Carregando página...
          </p>
        }
      >
        <Routes>
          {Object.entries(aliases).map(([path, to]) => (
            <Route key={path} path={path} element={<RouteRedirect to={to} />} />
          ))}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/comparar" element={<Comparador />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route
              path="/vitrine"
              element={
                <PrivateRoute>
                  <PermissionRoute action="usuarios">
                    <Vitrine />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/produtos/novo"
              element={
                <PrivateRoute>
                  <PermissionRoute action="produto" create>
                    <ProductEditor mode="create" />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/produtos/:id/editar"
              element={
                <PrivateRoute>
                  <PermissionRoute action="produto">
                    <ProductEditor mode="edit" />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/mercados/novo"
              element={
                <PrivateRoute>
                  <PermissionRoute action="mercado" create>
                    <MarketEditor mode="create" />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/mercados/:id/editar"
              element={
                <PrivateRoute>
                  <PermissionRoute action="mercado">
                    <MarketEditor mode="edit" />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/lista"
              element={
                <PrivateRoute>
                  <PermissionRoute action="lista">
                    <Lista />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/conta"
              element={
                <PrivateRoute>
                  <PermissionRoute action="conta">
                    <Configuracoes />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route path="/precos" element={<Precos />} />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute>
                  <PermissionRoute action="usuarios">
                    <Users />
                  </PermissionRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <section className="qt-panel mx-auto max-w-6xl">
                  <h1 className="qt-heading">Página não encontrada.</h1>
                  <p className="qt-muted mt-4">
                    Use o menu para continuar sua compra.
                  </p>
                  <a href="/" className="qt-action mt-6">
                    Voltar ao início
                  </a>
                </section>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
