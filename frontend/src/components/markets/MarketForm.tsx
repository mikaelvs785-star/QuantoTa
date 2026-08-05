import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Market, MarketInput } from "@/types/market";

const schema = z.object({
  name: z.string().min(2, "Informe o nome do mercado"),
  cnpj: z.string().optional(),
  phone: z.string().min(8, "Informe o telefone do mercado"),
  email: z.string().email("Informe um e-mail válido").optional(),
  website: z.string().url("Informe uma URL válida").optional(),
  cep: z.string().optional(),
  address: z.string().min(2, "Informe o endereço"),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().min(2, "Informe o estado"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type MarketFormValues = z.infer<typeof schema>;
const fieldClass = "mt-2 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100 dark:bg-slate-900 dark:focus:ring-brand-500/20";

type Props = {
  market?: Market;
  submitting?: boolean;
  onSubmit: (input: MarketInput) => void;
};

export function MarketForm({ market, submitting, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MarketFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      cnpj: "",
      phone: "",
      email: "",
      website: "",
      cep: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      description: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (market) {
      reset({
        name: market.name,
        cnpj: market.cnpj ?? "",
        phone: market.phone,
        email: market.email ?? "",
        website: market.website ?? "",
        cep: market.cep ?? "",
        address: market.address ?? "",
        number: market.number ?? "",
        complement: market.complement ?? "",
        neighborhood: market.neighborhood ?? "",
        city: market.city,
        state: market.state,
        description: market.description ?? "",
        status: market.status,
      });
    }
  }, [market, reset]);

  function submit(values: MarketFormValues) {
    onSubmit({
      ...values,
      cnpj: values.cnpj || undefined,
      email: values.email || undefined,
      website: values.website || undefined,
      number: values.number || undefined,
      complement: values.complement || undefined,
      description: values.description || undefined,
      cep: values.cep || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold">Nome</span>
          <Input className="mt-2" placeholder="Ex.: Supermercado Central" aria-invalid={Boolean(errors.name)} {...register("name")} />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">CNPJ</span>
          <Input className="mt-2" placeholder="00.000.000/0000-00" {...register("cnpj")} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold">Telefone</span>
          <Input className="mt-2" placeholder="(61) 99999-9999" aria-invalid={Boolean(errors.phone)} {...register("phone")} />
          {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">E-mail</span>
          <Input className="mt-2" placeholder="contato@supermercado.com" {...register("email")} />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold">Site</span>
          <Input className="mt-2" placeholder="https://..." {...register("website")} />
          {errors.website && <span className="mt-1 block text-xs text-red-600">{errors.website.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">CEP</span>
          <Input className="mt-2" placeholder="00000-000" {...register("cep")} />
          {errors.cep && <span className="mt-1 block text-xs text-red-600">{errors.cep.message}</span>}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold">Endereço</span>
          <Input className="mt-2" placeholder="Rua, número e complemento" {...register("address")} />
          {errors.address && <span className="mt-1 block text-xs text-red-600">{errors.address.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">Número</span>
          <Input className="mt-2" placeholder="123" {...register("number")} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold">Complemento</span>
          <Input className="mt-2" placeholder="Bloco A, apto 12" {...register("complement")} />
        </label>
        <label className="block">
          <span className="text-sm font-bold">Bairro</span>
          <Input className="mt-2" placeholder="Asa Norte" aria-invalid={Boolean(errors.neighborhood)} {...register("neighborhood")} />
          {errors.neighborhood && <span className="mt-1 block text-xs text-red-600">{errors.neighborhood.message}</span>}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold">Cidade</span>
          <Input className="mt-2" placeholder="Brasília" aria-invalid={Boolean(errors.city)} {...register("city")} />
          {errors.city && <span className="mt-1 block text-xs text-red-600">{errors.city.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">Estado</span>
          <Input className="mt-2" placeholder="DF" aria-invalid={Boolean(errors.state)} {...register("state")} />
          {errors.state && <span className="mt-1 block text-xs text-red-600">{errors.state.message}</span>}
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-bold">Descrição <span className="font-normal text-slate-500">(opcional)</span></span>
        <textarea className={`${fieldClass} h-28 py-3`} placeholder="Detalhes sobre o mercado" {...register("description")} />
      </label>

      <label className="block max-w-xs">
        <span className="text-sm font-bold">Status</span>
        <select className={fieldClass} {...register("status")}>
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>
      </label>

      <div className="flex justify-end border-t pt-5">
        <Button type="submit" size="lg" disabled={submitting}>
          <Save className="size-4" />
          {submitting ? "Salvando..." : "Salvar mercado"}
        </Button>
      </div>
    </form>
  );
}
