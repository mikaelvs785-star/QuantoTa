import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Products from "../pages/Products";
import MercadosPage from "../pages/Mercados";
import PrecosPage from "../pages/Precos";
import ComparadorPage from "../pages/Comparator";
import ListaPage from "../pages/Lista";
import ConfiguracoesPage from "../pages/Configuracoes";
import { ProductDetailsPage } from "../pages/Products/ProductDetailsPage";
import { ProductEditorPage } from "../pages/Products/ProductEditorPage";
import Markets from "../pages/Markets";
import { MarketDetailsPage } from "../pages/Markets/MarketDetailsPage";
import { MarketEditorPage } from "../pages/Markets/MarketEditorPage";
import Users from "../pages/Users";
import { UserEditorPage } from "../pages/Users/UserEditorPage";
import { MainLayout } from "../layouts/MainLayout";
import { PrivateRoute } from "./PrivateRoute";
import { AreaRedirect } from "./AreaRedirect";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ClienteDashboard from "../pages/cliente/ClienteDashboard";
import VendedorDashboard from "../pages/vendedor/VendedorDashboard";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute><AreaRedirect /></PrivateRoute>} />

        <Route element={<PrivateRoute allowedRoles={["ADMIN"]}><MainLayout /></PrivateRoute>}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route path="/admin/produtos" element={<Products />} />
          <Route path="/admin/produtos/novo" element={<ProductEditorPage mode="create" />} />
          <Route path="/admin/produtos/:id" element={<ProductDetailsPage />} />
          <Route path="/admin/produtos/:id/editar" element={<ProductEditorPage mode="edit" />} />
          <Route path="/admin/mercados" element={<Markets />} />
          <Route path="/admin/mercados/novo" element={<MarketEditorPage mode="create" />} />
          <Route path="/admin/mercados/:id" element={<MarketDetailsPage />} />
          <Route path="/admin/mercados/:id/editar" element={<MarketEditorPage mode="edit" />} />
          <Route path="/admin/usuarios" element={<Users />} />
          <Route path="/admin/usuarios/novo" element={<UserEditorPage />} />
          <Route path="/admin/precos" element={<PrecosPage />} />
        </Route>

        {/* ÁREA DO USUÁRIO */}
        <Route
          element={
            <PrivateRoute allowedRoles={["USER"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/cliente/dashboard"
            element={<ClienteDashboard />}
          />
          <Route path="/cliente/mercados" element={<MercadosPage />} />
          <Route path="/cliente/comparador" element={<ComparadorPage />} />
          <Route path="/cliente/lista" element={<ListaPage />} />
          <Route
            path="/cliente/configuracoes"
            element={<ConfiguracoesPage />}
          />
        </Route>

        {/* ÁREA DO VENDEDOR */}
        <Route
          element={
            <PrivateRoute allowedRoles={["VENDEDOR"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/vendedor/dashboard"
            element={<VendedorDashboard />}
          />
          <Route path="/vendedor/produtos" element={<Products />} />
          <Route path="/vendedor/mercado" element={<MercadosPage />} />
          <Route path="/vendedor/precos" element={<PrecosPage />} />
          <Route
            path="/vendedor/comparador"
            element={<ComparadorPage />}
          />
          <Route
            path="/vendedor/configuracoes"
            element={<ConfiguracoesPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
