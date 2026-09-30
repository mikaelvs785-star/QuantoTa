import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Market, MarketInput } from "@/types/market";
const schema = z.object({
  name: z.string().trim().min(2, "Informe o nome"),
  address: z.string().trim().min(2, "Informe o endereço"),
  neighborhood: z.string().trim().min(2, "Informe o bairro"),
  city: z.string().trim().min(2, "Informe a cidade"),
  state: z.string().trim().length(2, "Use a sigla do estado"),
  phone: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type Values = z.infer<typeof schema>;
export function MarketForm({
  market,
  submitting,
  onSubmit,
}: {
  market?: Market;
  submitting?: boolean;
  onSubmit: (input: MarketInput) => void;
}) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      neighborhood: "",
      city: "",
      state: "",
      phone: "",
      status: "ACTIVE",
    },
  });
  useEffect(() => {
    if (market)
      reset({
        name: market.name,
        address: market.address ?? "",
        neighborhood: market.neighborhood ?? "",
        city: market.city,
        state: market.state,
        phone: market.phone,
        status: market.status,
      });
  }, [market, reset]);
  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({ ...values, state: values.state.toUpperCase() }),
      )}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { key: "name", label: "Nome", placeholder: "Nome do mercado" },
          {
            key: "phone",
            label: "Telefone (opcional)",
            placeholder: "(61) 3333-3333",
          },
          {
            key: "address",
            label: "Endereço completo",
            placeholder: "Rua, número e complemento",
          },
          {
            key: "neighborhood",
            label: "Bairro",
            placeholder: "Taguatinga Norte",
          },
          { key: "city", label: "Cidade", placeholder: "Brasília" },
          { key: "state", label: "Estado", placeholder: "DF" },
        ].map((field) => (
          <label key={field.key}>
            <span className="mb-2 block text-sm font-semibold">
              {field.label}
            </span>
            <Input
              {...register(field.key as keyof Omit<Values, "status">)}
              placeholder={field.placeholder}
            />
            {errors[field.key as keyof Values] && (
              <p className="mt-1 text-xs text-red-600">
                {errors[field.key as keyof Values]?.message}
              </p>
            )}
          </label>
        ))}
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Status</span>
        <select {...register("status")} className="qt-select">
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>
      </label>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Salvando..." : "Salvar mercado"}
      </Button>
    </form>
  );
}
