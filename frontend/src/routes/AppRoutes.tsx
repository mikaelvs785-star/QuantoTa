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
import { CatalogEditorRoute } from "./CatalogEditorRoute";
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Catalogo = lazy(() => import("../pages/Catalogo"));
const Comparador = lazy(() => import("../pages/Comparator"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
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
const UserEditor = lazy(() =>
  import("../pages/Users/UserEditorPage").then((m) => ({
    default: m.UserEditorPage,
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
  "/cliente": "/dashboard",
  "/cliente/dashboard": "/dashboard",
  "/admin": "/dashboard",
  "/admin/dashboard": "/dashboard",
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
  "/admin/usuarios/novo": "/usuarios/novo",
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {Object.entries(aliases).map(([path, to]) => (
            <Route key={path} path={path} element={<RouteRedirect to={to} />} />
          ))}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/comparar" element={<Comparador />} />
            <Route
              path="/produtos/novo"
              element={
                <PrivateRoute>
                  <CatalogEditorRoute type="produto" create>
                    <ProductEditor mode="create" />
                  </CatalogEditorRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/produtos/:id/editar"
              element={
                <PrivateRoute>
                  <CatalogEditorRoute type="produto">
                    <ProductEditor mode="edit" />
                  </CatalogEditorRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/mercados/novo"
              element={
                <PrivateRoute>
                  <CatalogEditorRoute type="mercado" create>
                    <MarketEditor mode="create" />
                  </CatalogEditorRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/mercados/:id/editar"
              element={
                <PrivateRoute>
                  <CatalogEditorRoute type="mercado">
                    <MarketEditor mode="edit" />
                  </CatalogEditorRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/lista"
              element={
                <PrivateRoute>
                  <Lista />
                </PrivateRoute>
              }
            />
            <Route
              path="/conta"
              element={
                <PrivateRoute>
                  <Configuracoes />
                </PrivateRoute>
              }
            />
            <Route
              path="/precos"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Precos />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios/novo"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <UserEditor />
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <main className="mx-auto max-w-xl px-6 py-24">
                <h1 className="qt-heading">Página não encontrada.</h1>
                <p className="qt-muted mt-4">
                  Use o menu para continuar sua compra.
                </p>
                <a href="/" className="qt-action mt-6">
                  Voltar ao início
                </a>
              </main>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
