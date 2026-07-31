import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, Mail, ShoppingBasket } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequest } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function onSubmit(credentials: LoginRequest) {
    try {
      await login(credentials);
      toast.success("Login realizado com sucesso.");
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      const status = typeof error === "object" && error !== null && "response" in error ? (error.response as { status?: number }).status : undefined;
      toast.error(status === 401 ? "Credenciais inválidas." : "Ocorreu um erro inesperado. Tente novamente.");
    }
  }

  return <main className="grid min-h-screen lg:grid-cols-2"><section className="hidden bg-brand-600 p-10 text-white lg:flex lg:flex-col lg:justify-between"><Link to="/" className="flex items-center gap-2 text-2xl font-black"><span className="grid size-10 place-items-center rounded-xl bg-white text-brand-600">Q</span>QuantoTá</Link><div><span className="grid size-14 place-items-center rounded-2xl bg-white/15"><ShoppingBasket className="size-7" /></span><h1 className="mt-6 max-w-md text-5xl font-black leading-tight">Economize em cada item da sua lista.</h1><p className="mt-5 max-w-md text-lg text-brand-100">Compare preços e acompanhe as melhores ofertas da sua região em um só lugar.</p></div><p className="text-sm text-brand-100">© {new Date().getFullYear()} QuantoTá</p></section><section className="flex items-center justify-center bg-slate-50 p-6 dark:bg-slate-950"><div className="w-full max-w-md"><Link to="/" className="mb-12 flex items-center gap-2 text-2xl font-black text-brand-600 lg:hidden"><span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white">Q</span>QuantoTá</Link><div className="rounded-3xl border bg-white p-7 shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none sm:p-9"><h2 className="text-3xl font-black">Boas-vindas</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Entre para acompanhar suas economias.</p><form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate><label className="block"><span className="mb-2 block text-sm font-bold">E-mail</span><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="email" autoComplete="email" placeholder="voce@email.com" className="pl-10" aria-invalid={Boolean(errors.email)} {...register("email")} /></div>{errors.email && <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.email.message}</span>}</label><label className="block"><span className="mb-2 block text-sm font-bold">Senha</span><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="password" autoComplete="current-password" placeholder="Sua senha" className="pl-10" aria-invalid={Boolean(errors.password)} {...register("password")} /></div>{errors.password && <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.password.message}</span>}</label><Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <LoaderCircle className="size-4 animate-spin" />}{loading ? "Entrando..." : "Entrar"}</Button></form><p className="mt-6 text-center text-sm text-slate-500">Ainda não tem conta? <a className="font-bold text-brand-600 hover:underline" href="mailto:contato@quantota.com">Fale conosco</a></p></div></div></section></main>;
}
