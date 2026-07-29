import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Hero } from "@/components/sections/Hero";
import { Markets } from "@/components/sections/Markets";
export default function Home() { const { theme, setTheme } = useTheme(); return <div className="min-h-screen"><header className="border-b bg-white/90 backdrop-blur dark:bg-slate-950/90"><Container className="flex h-16 items-center justify-between"><Link to="/" className="flex items-center gap-2 text-xl font-black text-brand-600"><span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">Q</span>QuantoTá</Link><nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex"><a href="#ofertas">Ofertas</a><a href="#mercados">Mercados</a><Link to="/dashboard">Dashboard</Link></nav><div className="flex gap-2"><Button variant="ghost" size="icon" aria-label="Alternar tema" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}</Button><Button asChild className="hidden sm:inline-flex"><Link to="/dashboard">Entrar</Link></Button></div></Container></header><Hero /><Container className="space-y-16 py-14"><Categories /><div id="ofertas"><FeaturedProducts /></div><div id="mercados"><Markets /></div></Container><footer className="border-t bg-white py-10 dark:bg-slate-900"><Container className="flex flex-col justify-between gap-4 text-sm text-slate-500 sm:flex-row"><p className="font-bold text-brand-600">QuantoTá</p><p>© {new Date().getFullYear()} QuantoTá. Economia inteligente todos os dias.</p></Container></footer></div>; }
