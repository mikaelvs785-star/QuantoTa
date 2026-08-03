import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Products from "../pages/Products";
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
          <Route path="/mercados" element={<Dashboard />} />
          <Route path="/precos" element={<Dashboard />} />
          <Route path="/comparador" element={<Dashboard />} />
          <Route path="/lista" element={<Dashboard />} />
          <Route path="/configuracoes" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
