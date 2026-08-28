import {
  BarChart3,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  ListChecks,
  Package,
  ScanSearch,
  Store,
  Tags,
  Users
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ApiError } from "@/components/ui/ApiError";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { MarketCard } from "@/components/dashboard/MarketCard";
import { PriceTable } from "@/components/dashboard/PriceTable";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { SkeletonCard } from "@/components/dashboard/SkeletonCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import type { DashboardMetric } from "@/types/dashboard";

const metricIcons = { products: Package, markets: Store, prices: Tags, lists: ListChecks, savings: CircleDollarSign, monitored: ScanSearch, users: Users };

function DashboardSkeleton() { return <><div className="mb-8"><div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /><div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-900" /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}</div><div className="mt-6 grid gap-6 lg:grid-cols-2"><SkeletonCard /><SkeletonCard /></div></>; }

function Charts({ data }: { data: NonNullable<ReturnType<typeof useDashboard>["data"]> }) { return <div className="mt-6 grid gap-6 xl:grid-cols-2"><ChartCard title="Economia mensal" description="Total economizado em suas compras"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.monthlySavings}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Economia"]} /><Line type="monotone" dataKey="value" stroke="#22C55E" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></ChartCard><ChartCard title="Produtos mais pesquisados" description="Interesse na sua região"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.popularProducts}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="searches" fill="#2563EB" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Preços por mercado" description="Menores preços encontrados"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.pricesByMarket} layout="vertical"><CartesianGrid horizontal={false} strokeDasharray="3 3" /><XAxis type="number" hide /><YAxis dataKey="market" type="category" axisLine={false} tickLine={false} width={90} /><Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Preço"]} /><Bar dataKey="price" fill="#F59E0B" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Visão de preços" description="Acompanhe variações em tempo real"><div className="flex h-full flex-col items-center justify-center text-center"><ChartNoAxesColumnIncreasing className="size-10 text-blue-500" /><p className="mt-3 font-semibold">Dados centralizados</p><p className="mt-1 max-w-56 text-sm text-slate-500">Os gráficos usam informações atualizadas pelo backend.</p></div></ChartCard></div>; }

export default function Dashboard() {
  const dashboard = useDashboard();
  if (dashboard.isLoading) return <DashboardSkeleton />;
  if (dashboard.isError) return <ApiError onRetry={() => void dashboard.refetch()} offline />;
  const data = dashboard.data;
  if (!data) return <ApiError onRetry={() => void dashboard.refetch()} />;
  const metrics = data.metrics;
  return <div className="mx-auto max-w-7xl pb-4"><SectionTitle title="Visão geral" description="Acompanhe preços, ofertas e sua economia em um único lugar." action={<span className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-slate-500 sm:flex"><BarChart3 className="size-4 text-blue-600" /> Dados atualizados</span>} /><DashboardGrid>{metrics.length ? metrics.map((metric: DashboardMetric) => { const Icon = metricIcons[metric.key]; return <StatCard key={metric.key} metric={metric} icon={Icon} />; }) : <div className="col-span-full"><EmptyState title="Sem métricas disponíveis" description="As métricas aparecerão assim que o backend receber seus dados." /></div>}</DashboardGrid><Charts data={data} /><section className="mt-6"><SectionTitle title="Últimos preços cadastrados" description="Acompanhe as atualizações mais recentes." /><Card><CardContent className="p-4 sm:p-5"><PriceTable prices={data.latestPrices} /></CardContent></Card></section><section className="mt-8"><SectionTitle title="Mercados favoritos" description="Mercados que você acompanha com mais frequência." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.favoriteMarkets.length ? data.favoriteMarkets.map((market) => <MarketCard key={market.id} market={market} />) : <div className="col-span-full"><EmptyState title="Nenhum mercado favorito" description="Marque mercados para acompanhar os melhores preços." action={false} /></div>}</div></section><section className="mt-8"><SectionTitle title="Produtos monitorados" description="Histórico de preços dos produtos que importam para você." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.monitoredProducts.length ? data.monitoredProducts.map((product) => <ProductCard key={product.id} product={product} />) : <div className="col-span-full"><EmptyState title="Nenhum produto monitorado" description="Cadastre um produto para receber alertas de preço." /></div>}</div></section></div>;
}
