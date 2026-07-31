import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";
import type { DashboardMetric } from "@/types/dashboard";

export function StatCard({ metric, icon: Icon }: { metric: DashboardMetric; icon: LucideIcon }) { const isCurrency = metric.key === "savings"; const positive = metric.variation >= 0; return <DashboardCard><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"><Icon className="size-5" /></span><span className={`flex items-center text-xs font-bold ${positive ? "text-emerald-600" : "text-red-500"}`}>{positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{Math.abs(metric.variation)}%</span></div><p className="mt-5 text-2xl font-black tracking-tight">{isCurrency ? formatCurrency(metric.value) : metric.value.toLocaleString("pt-BR")}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{metric.label}</p></DashboardCard>; }
