import type { ReactNode } from "react";
import { DashboardCard } from "./DashboardCard";
export function ChartCard({ title, description, children }: { title: string; description: string; children: ReactNode }) { return <DashboardCard><div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p></div><div className="mt-5 h-64">{children}</div></DashboardCard>; }
