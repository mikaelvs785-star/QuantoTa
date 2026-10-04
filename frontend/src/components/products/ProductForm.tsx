import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Product, ProductInput } from "@/types/product";
const schema = z
  .object({
    name: z.string().trim().min(2, "Informe o nome"),
    category: z.string().trim().min(1, "Informe a categoria"),
    brand: z.string().trim(),
    unit: z.string().trim(),
    measureQuantity: z
      .string()
      .refine(
        (v) =>
          !v ||
          (Number(v.replace(",", ".")) > 0 && /^\d+([.,]\d{1,3})?$/.test(v)),
        "Informe uma quantidade positiva, com até 3 casas decimais",
      ),
    measureType: z.string(),
    comparisonGroup: z.string().trim(),
    description: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .superRefine((v, ctx) => {
    if (!v.unit && !v.measureQuantity)
      ctx.addIssue({
        code: "custom",
        path: ["unit"],
        message: "Informe a embalagem ou a medida abaixo",
      });
    if (Boolean(v.measureQuantity) !== Boolean(v.measureType))
      ctx.addIssue({
        code: "custom",
        path: ["measureQuantity"],
        message: "Preencha quantidade e unidade juntas",
      });
    if (
      v.measureType === "UN" &&
      !Number.isInteger(Number(v.measureQuantity.replace(",", ".")))
    )
      ctx.addIssue({
        code: "custom",
        path: ["measureQuantity"],
        message: "Informe um número inteiro de unidades",
      });
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
      measureQuantity: "",
      measureType: "",
      comparisonGroup: "",
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
        measureQuantity: product.measureQuantity
          ? String(product.measureQuantity)
          : "",
        measureType: product.measureType ?? "",
        comparisonGroup: product.comparisonGroup ?? "",
        status: product.status,
      });
  }, [product, reset]);
  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit({
          ...v,
          measureQuantity: v.measureQuantity
            ? Number(v.measureQuantity.replace(",", "."))
            : null,
          measureType: v.measureType || null,
        }),
      )}
      className="space-y-6"
    >
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
      <fieldset className="qt-success space-y-4">
        <legend className="px-2 font-bold">Comparação por medida</legend>
        <p className="qt-muted">
          Preencha quantidade e unidade juntas para mostrar o preço por kg,
          litro ou unidade. As fotos são enviadas pelos vendedores nas ofertas.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            Quantidade da embalagem
            <Input
              inputMode="decimal"
              placeholder="Ex.: 500"
              {...register("measureQuantity")}
            />
            {errors.measureQuantity && (
              <p className="text-sm text-red-600">
                {errors.measureQuantity.message}
              </p>
            )}
          </label>
          <label>
            Unidade da medida
            <select className="qt-select" {...register("measureType")}>
              <option value="">Não informada</option>
              <option value="G">Gramas (g)</option>
              <option value="KG">Quilos (kg)</option>
              <option value="ML">Mililitros (ml)</option>
              <option value="L">Litros (L)</option>
              <option value="UN">Unidades (un)</option>
            </select>
          </label>
        </div>
        <label className="block">
          Grupo de embalagens equivalentes
          <Input
            placeholder="Ex.: arroz-branco-tipo-1-camil"
            {...register("comparisonGroup")}
          />
        </label>
        <p className="qt-muted">
          Use o mesmo grupo apenas para o mesmo tipo de produto e marca em
          tamanhos diferentes. Deixe vazio quando não houver equivalência.
        </p>
      </fieldset>
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
