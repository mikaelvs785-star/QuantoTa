import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Product, ProductInput } from "@/types/product";
const schema = z.object({
  name: z.string().trim().min(2, "Informe o nome"),
  category: z.string().trim().min(1, "Informe a categoria"),
  brand: z.string().trim(),
  unit: z.string().trim().min(1, "Informe a unidade ou embalagem"),
  description: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type Values = z.infer<typeof schema>;
export function ProductForm({
  product,
  submitting,
  onSubmit,
}: {
  product?: Product;
  submitting?: boolean;
  onSubmit: (input: ProductInput) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      unit: "",
      description: "",
      status: "ACTIVE",
    },
  });
  useEffect(() => {
    if (product)
      reset({
        name: product.name,
        category: product.category,
        brand: product.brand ?? "",
        unit: product.unit ?? "",
        description: product.description ?? "",
        status: product.status,
      });
  }, [product, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="qt-muted">
        Cadastre marca e embalagem para comparar exatamente o mesmo produto.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { key: "name", label: "Nome", example: "Arroz tipo 1" },
          { key: "category", label: "Categoria", example: "Mercearia" },
          { key: "brand", label: "Marca (opcional)", example: "Camil" },
          {
            key: "unit",
            label: "Unidade / embalagem",
            example: "5 kg, 1 L ou 1 unidade",
          },
        ].map((field) => (
          <label key={field.key}>
            <span className="mb-2 block text-sm font-semibold">
              {field.label}
            </span>
            <Input
              {...register(field.key as "name" | "category" | "brand" | "unit")}
              placeholder={field.example}
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
        <span className="mb-2 block text-sm font-semibold">
          Descrição (opcional)
        </span>
        <textarea
          {...register("description")}
          className="qt-select h-28 py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Status</span>
        <select {...register("status")} className="qt-select">
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>
      </label>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Salvando..." : "Salvar produto"}
      </Button>
    </form>
  );
}
