import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Products from "../pages/Products";
import MercadosPage from "../pages/Mercados";
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

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute><AreaRedirect /></PrivateRoute>} />

        <Route element={<PrivateRoute allowedRoles={["ADMIN"]}><MainLayout /></PrivateRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
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
          <Route path="/admin/precos" element={<Dashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["USER", "VENDEDOR"]}><MainLayout /></PrivateRoute>}>
          <Route path="/cliente/dashboard" element={<Dashboard />} />
          <Route path="/cliente/mercados" element={<MercadosPage />} />
          <Route path="/cliente/comparador" element={<ComparadorPage />} />
          <Route path="/cliente/lista" element={<ListaPage />} />
          <Route path="/cliente/configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
