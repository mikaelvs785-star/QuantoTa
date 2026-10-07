import { ImageUpload } from "@/components/storefront/Media";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";
import { userService } from "@/services/userService";
import { Controller, useForm } from "react-hook-form";
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
  vendedorId: z.string().optional(),
  imageId: z.string().nullable().optional(),
});
type Values = z.infer<typeof schema>;
export function MarketForm({
  market,
  submitting,
  vendedorId,
  onSubmit,
}: {
  market?: Market;
  vendedorId?: string;
  submitting?: boolean;
  onSubmit: (input: MarketInput) => void;
}) {
  const [uploading,setUploading]=useState(false);
  const permissions = usePermissions();
  const canAssign = permissions.data?.gerenciarTodosMercados === true;
  const sellers = useQuery({
    queryKey: ["usuarios", "vendedores"],
    queryFn: userService.listarVendedores,
    enabled: canAssign,
  });
  const {
    register,
    control,
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
      vendedorId: "",
      imageId: null,
    },
  });
  useEffect(() => {
    if (market)
      reset({
        name: market.name,
        imageId: market.imageId ?? null,
        address: market.address ?? "",
        neighborhood: market.neighborhood ?? "",
        city: market.city,
        state: market.state,
        phone: market.phone,
        status: market.status,
        vendedorId: vendedorId ?? "",
      });
  }, [market, vendedorId, reset]);
  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({ ...values, state: values.state.toUpperCase() }),
      )}
      className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]"
    >
      <Controller name="imageId" control={control} render={({field})=><ImageUpload label="Foto do mercado" value={field.value} onChange={field.onChange} onBusy={setUploading} previewClassName="w-full max-w-60"/>}/>
      <div className="min-w-0 space-y-5">
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
      {canAssign && (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Vendedor responsável (opcional)
          </span>
          <Controller
            name="vendedorId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ""}
                className="qt-select"
                disabled={sellers.isPending || sellers.isError}
              >
                <option value="">Sem vendedor responsável</option>
                {sellers.data?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}
          />
          {sellers.isError && (
            <p role="alert">
              Não foi possível carregar os vendedores.{" "}
              <button type="button" onClick={() => void sellers.refetch()}>
                Tentar novamente
              </button>
            </p>
          )}
        </label>
      )}
      {canAssign && (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Status</span>
          <select {...register("status")} className="qt-select">
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </label>
      )}
      <Button
        type="submit"
        disabled={
          submitting || uploading || (canAssign && (sellers.isPending || sellers.isError))
        }
      >
        {submitting ? "Salvando..." : "Salvar mercado"}
      </Button>
      </div>
    </form>
  );
}
