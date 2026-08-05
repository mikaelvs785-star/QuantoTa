import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { UserInput } from "@/types/user";

const schema = z.object({
  name: z.string().min(2, "Informe o nome do usuário"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100 dark:bg-slate-900 dark:focus:ring-brand-500/20";

type Props = {
  submitting?: boolean;
  onSubmit: (input: UserInput) => void;
};

export function UserForm({ submitting, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function submit(values: FormValues) {
    onSubmit({ ...values });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <label className="block">
        <span className="text-sm font-bold">Nome</span>
        <Input className="mt-2" placeholder="Ex.: João da Silva" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
      </label>
      <label className="block">
        <span className="text-sm font-bold">E-mail</span>
        <Input className="mt-2" type="email" placeholder="usuario@exemplo.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
        {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
      </label>
      <label className="block">
        <span className="text-sm font-bold">Senha</span>
        <Input className="mt-2" type="password" placeholder="Digite uma senha" aria-invalid={Boolean(errors.password)} {...register("password")} />
        {errors.password && <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span>}
      </label>
      <div className="flex justify-end border-t pt-5">
        <Button type="submit" size="lg" disabled={submitting}>
          <Save className="size-4" /> {submitting ? "Salvando..." : "Salvar usuário"}
        </Button>
      </div>
    </form>
  );
}
