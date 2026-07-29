import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
export function MainLayout() { const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); return <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950"><Sidebar collapsed={collapsed} onCollapsedChange={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><Header onMenuClick={() => setMobileOpen(true)} /><main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main><Footer /></div></div>; }
