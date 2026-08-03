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
          <Route path="/mercados" element={<MercadosPage />} />
          <Route path="/precos" element={<PrecosPage />} />
          <Route path="/comparador" element={<ComparadorPage />} />
          <Route path="/lista" element={<ListaPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
