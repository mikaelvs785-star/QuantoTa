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
import AdminProdutos from "../pages/admin/Produtos";

import ClienteDashboard from "../pages/cliente/ClienteDashboard";
import VendedorDashboard from "../pages/vendedor/VendedorDashboard";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================================
            PÚBLICO
        ========================================================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AreaRedirect />
            </PrivateRoute>
          }
        />

        {/* =========================================================
            ÁREA DO ADMINISTRADOR
        ========================================================= */}

        <Route
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          {/* Produtos */}
          <Route
            path="/admin/produtos"
            element={<AdminProdutos />}
          />

          <Route
            path="/admin/produtos/novo"
            element={<ProductEditorPage mode="create" />}
          />

          <Route
            path="/admin/produtos/:id"
            element={<ProductDetailsPage />}
          />

          <Route
            path="/admin/produtos/:id/editar"
            element={<ProductEditorPage mode="edit" />}
          />

          {/* Mercados */}
          <Route
            path="/admin/mercados"
            element={<Markets />}
          />

          <Route
            path="/admin/mercados/novo"
            element={<MarketEditorPage mode="create" />}
          />

          <Route
            path="/admin/mercados/:id"
            element={<MarketDetailsPage />}
          />

          <Route
            path="/admin/mercados/:id/editar"
            element={<MarketEditorPage mode="edit" />}
          />

          {/* Usuários */}
          <Route
            path="/admin/usuarios"
            element={<Users />}
          />

          <Route
            path="/admin/usuarios/novo"
            element={<UserEditorPage />}
          />

          {/* Preços */}
          <Route
            path="/admin/precos"
            element={<PrecosPage />}
          />
        </Route>

        {/* =========================================================
            ÁREA DO USUÁRIO / CLIENTE
        ========================================================= */}

        <Route
          element={
            <PrivateRoute allowedRoles={["USER"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route
            path="/cliente/dashboard"
            element={<ClienteDashboard />}
          />

          {/* Mercados */}
          <Route
            path="/cliente/mercados"
            element={<MercadosPage />}
          />

          {/* Comparador */}
          <Route
            path="/cliente/comparador"
            element={<ComparadorPage />}
          />

          {/* Lista de compras */}
          <Route
            path="/cliente/lista"
            element={<ListaPage />}
          />

          {/* Configurações */}
          <Route
            path="/cliente/configuracoes"
            element={<ConfiguracoesPage />}
          />
        </Route>

        {/* =========================================================
            ÁREA DO VENDEDOR
        ========================================================= */}

        <Route
          element={
            <PrivateRoute allowedRoles={["VENDEDOR"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route
            path="/vendedor/dashboard"
            element={<VendedorDashboard />}
          />

          {/* Produtos */}
          <Route
            path="/vendedor/produtos"
            element={<Products />}
          />

          {/* Meu mercado */}
          <Route
            path="/vendedor/mercado"
            element={<MercadosPage />}
          />

          {/* Meus preços */}
          <Route
            path="/vendedor/precos"
            element={<PrecosPage />}
          />

          {/* Comparador */}
          <Route
            path="/vendedor/comparador"
            element={<ComparadorPage />}
          />

          {/* Configurações */}
          <Route
            path="/vendedor/configuracoes"
            element={<ConfiguracoesPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}