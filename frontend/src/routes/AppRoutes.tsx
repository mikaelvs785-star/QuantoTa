import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
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

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/novo" element={<ProductEditorPage mode="create" />} />
          <Route path="/produtos/:id" element={<ProductDetailsPage />} />
          <Route path="/produtos/:id/editar" element={<ProductEditorPage mode="edit" />} />
          <Route path="/mercados" element={<Markets />} />
          <Route path="/mercados/novo" element={<MarketEditorPage mode="create" />} />
          <Route path="/mercados/:id" element={<MarketDetailsPage />} />
          <Route path="/mercados/:id/editar" element={<MarketEditorPage mode="edit" />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/usuarios/novo" element={<UserEditorPage />} />
          <Route path="/precos" element={<Dashboard />} />
          <Route path="/comparador" element={<Dashboard />} />
          <Route path="/lista" element={<Dashboard />} />
          <Route path="/configuracoes" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
