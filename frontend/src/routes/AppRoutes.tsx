import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import { MainLayout } from "../layouts/MainLayout";
import { PrivateRoute } from "./PrivateRoute";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<Dashboard />} />
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
