import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar collapsed={collapsed} onCollapsedChange={() => setCollapsed((value) => !value)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto pb-20 lg:pb-0">
        <Header />
        <main className="flex-1 p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
