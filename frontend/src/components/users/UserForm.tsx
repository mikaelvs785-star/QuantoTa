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
  role: z.enum(["USER", "VENDEDOR"]),
});

type FormValues = z.infer<typeof schema>;

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
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  function submit(values: FormValues) {
  onSubmit({
    name: values.name,
    email: values.email,
    password: values.password,
    role: values.role,
  });
}

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <label className="block">
        <span className="text-sm font-bold">Nome</span>
        <Input
          className="mt-2"
          placeholder="Ex.: João da Silva"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <span className="mt-1 block text-xs text-red-600">
            {errors.name.message}
          </span>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-bold">E-mail</span>
        <Input
          className="mt-2"
          type="email"
          placeholder="usuario@exemplo.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <span className="mt-1 block text-xs text-red-600">
            {errors.email.message}
          </span>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-bold">Senha</span>
        <Input
          className="mt-2"
          type="password"
          placeholder="Digite uma senha"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <span className="mt-1 block text-xs text-red-600">
            {errors.password.message}
          </span>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-bold">Perfil</span>

        <select
          className="mt-2 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900"
          {...register("role")}
        >
          <option value="USER">Cliente</option>
          <option value="VENDEDOR">Vendedor</option>
        </select>

        {errors.role && (
          <span className="mt-1 block text-xs text-red-600">
            Selecione um perfil
          </span>
        )}
      </label>

      <div className="flex justify-end border-t pt-5">
        <Button type="submit" size="lg" disabled={submitting}>
          <Save className="size-4" />
          {submitting ? "Salvando..." : "Salvar usuário"}
        </Button>
      </div>
    </form>
  );
}