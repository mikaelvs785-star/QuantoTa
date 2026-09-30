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
import { AreaRedirect } from "./AreaRedirect";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const MercadosPage = lazy(() => import("../pages/Mercados"));
const ComparadorPage = lazy(() => import("../pages/Comparator"));
const ConfiguracoesPage = lazy(() => import("../pages/Configuracoes"));
const ProductEditorPage = lazy(() =>
  import("../pages/Products/ProductEditorPage").then((module) => ({
    default: module.ProductEditorPage,
  })),
);
const Users = lazy(() => import("../pages/Users"));

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Products = lazy(() => import("../pages/Products"));
const PrecosPage = lazy(() => import("../pages/Precos"));
const ListaPage = lazy(() => import("../pages/Lista"));
const Markets = lazy(() => import("../pages/Markets"));
const MarketEditorPage = lazy(() =>
  import("../pages/Markets/MarketEditorPage").then((module) => ({
    default: module.MarketEditorPage,
  })),
);
const UserEditorPage = lazy(() =>
  import("../pages/Users/UserEditorPage").then((module) => ({
    default: module.UserEditorPage,
  })),
);

// Preserve parâmetros de busca e fragmentos nos endereços antigos.
function RouteRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  const { id = "" } = useParams();
  return <Navigate to={to.replace(":id", id) + search + hash} replace />;
}

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
          <Route
            path="/cliente"
            element={<RouteRedirect to="/cliente/dashboard" />}
          />
          <Route
            path="/cliente/mercados"
            element={<RouteRedirect to="/mercados" />}
          />
          <Route
            path="/cliente/comparador"
            element={<RouteRedirect to="/comparar" />}
          />
          <Route element={<MainLayout />}>
            <Route path="/comparar" element={<ComparadorPage />} />
            <Route path="/mercados" element={<MercadosPage />} />
            <Route path="/cliente/dashboard" element={<Dashboard />} />
          </Route>

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AreaRedirect />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<RouteRedirect to="/admin/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="produtos" element={<Products />} />
            <Route
              path="produtos/novo"
              element={<ProductEditorPage mode="create" />}
            />
            <Route
              path="produtos/:id"
              element={<RouteRedirect to="/admin/produtos/:id/editar" />}
            />
            <Route
              path="produtos/:id/editar"
              element={<ProductEditorPage mode="edit" />}
            />
            <Route path="mercados" element={<Markets />} />
            <Route
              path="mercados/novo"
              element={<MarketEditorPage mode="create" />}
            />
            <Route
              path="mercados/:id"
              element={<RouteRedirect to="/admin/mercados/:id/editar" />}
            />
            <Route
              path="mercados/:id/editar"
              element={<MarketEditorPage mode="edit" />}
            />
            <Route path="usuarios" element={<Users />} />
            <Route path="usuarios/novo" element={<UserEditorPage />} />
            <Route path="precos" element={<PrecosPage />} />
          </Route>

          <Route
            element={
              <PrivateRoute allowedRoles={["USER", "VENDEDOR", "ADMIN"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/cliente/lista" element={<ListaPage />} />
            <Route
              path="/cliente/configuracoes"
              element={<ConfiguracoesPage />}
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
