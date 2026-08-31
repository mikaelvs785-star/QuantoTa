import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, Mail, ShoppingBasket, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { registerUser } from "@/services/auth";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading, isAuthenticated, user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registering, setRegistering] = useState(false);
  const loading = mode === "register" ? registering : authLoading;

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", password: "" },
  });

  if (isAuthenticated) return <Navigate to={user?.role === "ADMIN" ? "/admin/dashboard" : "/cliente/dashboard"} replace />;

  async function onLoginSubmit(credentials: LoginRequest) {
    try {
      await login(credentials);
      toast.success("Login realizado com sucesso.");
      const authenticatedUser = JSON.parse(localStorage.getItem("quantota-user") ?? "{}");
      navigate(authenticatedUser.role === "ADMIN" ? "/admin/dashboard" : "/cliente/dashboard", { replace: true });
    } catch (error: unknown) {
      const status = typeof error === "object" && error !== null && "response" in error ? (error.response as { status?: number }).status : undefined;
      toast.error(status === 401 ? "Credenciais inválidas." : "Ocorreu um erro inesperado. Tente novamente.");
    }
  }

  async function onRegisterSubmit(values: RegisterRequest) {
    setRegistering(true);
    try {
      const normalizedValues = { ...values, nome: values.nome.trim(), email: values.email.trim().toLowerCase() };
      await registerUser(normalizedValues);
      toast.success("Conta criada com sucesso. Você já pode entrar.");
      setMode("login");
      loginForm.reset({ email: normalizedValues.email, password: values.password });
      registerForm.reset();
    } catch (error: unknown) {
      const status = typeof error === "object" && error !== null && "response" in error ? (error.response as { status?: number }).status : undefined;
      if (status === 409) {
        toast.error("Este e-mail já está em uso.");
        return;
      }
      toast.error("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setRegistering(false);
    }
  }

  return <main className="grid min-h-screen lg:grid-cols-2"><section className="hidden bg-brand-600 p-10 text-white lg:flex lg:flex-col lg:justify-between"><Link to="/" className="flex items-center gap-2 text-2xl font-black"><span className="grid size-10 place-items-center rounded-xl bg-white text-brand-600">Q</span>QuantoTá</Link><div><span className="grid size-14 place-items-center rounded-2xl bg-white/15"><ShoppingBasket className="size-7" /></span><h1 className="mt-6 max-w-md text-5xl font-black leading-tight">Economize em cada item da sua lista.</h1><p className="mt-5 max-w-md text-lg text-brand-100">Compare preços e acompanhe as melhores ofertas da sua região em um só lugar.</p></div><p className="text-sm text-brand-100">© {new Date().getFullYear()} QuantoTá</p></section><section className="flex items-center justify-center bg-slate-50 p-6 dark:bg-slate-950"><div className="w-full max-w-md"><Link to="/" className="mb-12 flex items-center gap-2 text-2xl font-black text-brand-600 lg:hidden"><span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white">Q</span>QuantoTá</Link><div className="rounded-3xl border bg-white p-7 shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none sm:p-9"><div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800"><button type="button" onClick={() => setMode("login")} className={`rounded-xl px-3 py-2 text-sm font-bold transition ${mode === "login" ? "bg-white text-brand-600 shadow-sm dark:bg-slate-900" : "text-slate-500"}`}>Entrar</button><button type="button" onClick={() => setMode("register")} className={`rounded-xl px-3 py-2 text-sm font-bold transition ${mode === "register" ? "bg-white text-brand-600 shadow-sm dark:bg-slate-900" : "text-slate-500"}`}>Criar conta</button></div>{mode === "login" ? <div className="mt-6"><h2 className="text-3xl font-black">Boas-vindas</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Entre para acompanhar suas economias.</p><form className="mt-8 space-y-5" onSubmit={loginForm.handleSubmit(onLoginSubmit)} noValidate><label className="block"><span className="mb-2 block text-sm font-bold">E-mail</span><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="email" autoComplete="email" placeholder="voce@email.com" className="pl-10" aria-invalid={Boolean(loginForm.formState.errors.email)} {...loginForm.register("email")} /></div>{loginForm.formState.errors.email && <span className="mt-1.5 block text-xs font-medium text-red-600">{loginForm.formState.errors.email.message}</span>}</label><label className="block"><span className="mb-2 block text-sm font-bold">Senha</span><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="password" autoComplete="current-password" placeholder="Sua senha" className="pl-10" aria-invalid={Boolean(loginForm.formState.errors.password)} {...loginForm.register("password")} /></div>{loginForm.formState.errors.password && <span className="mt-1.5 block text-xs font-medium text-red-600">{loginForm.formState.errors.password.message}</span>}</label><Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <LoaderCircle className="size-4 animate-spin" />}{loading ? "Entrando..." : "Entrar"}</Button></form></div> : <div className="mt-6"><h2 className="text-3xl font-black">Crie sua conta</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Cadastre-se e use a mesma conta para entrar no futuro.</p><form className="mt-8 space-y-5" onSubmit={registerForm.handleSubmit(onRegisterSubmit)} noValidate><label className="block"><span className="mb-2 block text-sm font-bold">Nome</span><div className="relative"><UserRoundPlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="text" autoComplete="name" placeholder="Seu nome" className="pl-10" aria-invalid={Boolean(registerForm.formState.errors.nome)} {...registerForm.register("nome")} /></div>{registerForm.formState.errors.nome && <span className="mt-1.5 block text-xs font-medium text-red-600">{registerForm.formState.errors.nome.message}</span>}</label><label className="block"><span className="mb-2 block text-sm font-bold">E-mail</span><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="email" autoComplete="email" placeholder="voce@email.com" className="pl-10" aria-invalid={Boolean(registerForm.formState.errors.email)} {...registerForm.register("email")} /></div>{registerForm.formState.errors.email && <span className="mt-1.5 block text-xs font-medium text-red-600">{registerForm.formState.errors.email.message}</span>}</label><label className="block"><span className="mb-2 block text-sm font-bold">Senha</span><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="password" autoComplete="new-password" placeholder="Sua senha" className="pl-10" aria-invalid={Boolean(registerForm.formState.errors.password)} {...registerForm.register("password")} /></div>{registerForm.formState.errors.password && <span className="mt-1.5 block text-xs font-medium text-red-600">{registerForm.formState.errors.password.message}</span>}</label><Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <LoaderCircle className="size-4 animate-spin" />}{loading ? "Criando..." : "Criar conta"}</Button></form></div>}<p className="mt-6 text-center text-sm text-slate-500">Já tem conta? <button type="button" onClick={() => setMode("login")} className="font-bold text-brand-600 hover:underline">Entre agora</button></p></div></div></section></main>;
}
