import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Product, ProductInput } from "@/types/product";

const schema = z.object({
  name: z.string().min(2, "Informe o nome do produto"),

  category: z.string().min(1, "Selecione uma categoria"),

  unit: z.string().min(1, "Selecione uma unidade de medida"),

  description: z.string().optional(),

  barcode: z.string().optional(),

  imageUrl: z
    .string()
    .url("Informe uma URL válida")
    .or(z.literal("")),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type ProductFormValues = z.infer<typeof schema>;

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100 dark:bg-slate-900 dark:focus:ring-brand-500/20";

type Props = {
  product?: Product;
  submitting?: boolean;
  onSubmit: (input: ProductInput) => void;
};

export function ProductForm({
  product,
  submitting,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      category: "",
      unit: "",
      description: "",
      barcode: "",
      imageUrl: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category,
        unit: product.unit ?? "",
        description: product.description ?? "",
        barcode: product.barcode ?? "",
        imageUrl: product.imageUrl ?? "",
        status: product.status,
      });
    }
  }, [product, reset]);

  function submit(values: ProductFormValues) {
    onSubmit({
      ...values,
      imageUrl: values.imageUrl || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-5"
      noValidate
    >
      {/* NOME + CATEGORIA */}
      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="text-sm font-bold">
            Nome <span className="text-red-500">*</span>
          </span>

          <Input
            className="mt-2"
            placeholder="Ex.: Arroz Tipo 1"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />

          {errors.name && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.name.message}
            </span>
          )}
        </label>

        <label>
          <span className="text-sm font-bold">
            Categoria <span className="text-red-500">*</span>
          </span>

          <select
            className={fieldClass}
            aria-invalid={Boolean(errors.category)}
            {...register("category")}
          >
            <option value="">Selecione</option>
            <option value="Mercearia">Mercearia</option>
            <option value="Hortifruti">Hortifruti</option>
            <option value="Laticínios">Laticínios</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Carnes">Carnes</option>
            <option value="Padaria">Padaria</option>
            <option value="Higiene">Higiene</option>
          </select>

          {errors.category && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.category.message}
            </span>
          )}
        </label>
      </div>

      {/* UNIDADE + CÓDIGO DE BARRAS + IMAGEM */}
      <div className="grid gap-5 md:grid-cols-3">
        <label>
          <span className="text-sm font-bold">
            Unidade de medida{" "}
            <span className="text-red-500">*</span>
          </span>

          <select
            className={fieldClass}
            aria-invalid={Boolean(errors.unit)}
            {...register("unit")}
          >
            <option value="">Selecione</option>
            <option value="UN">Unidade (UN)</option>
            <option value="KG">Quilograma (KG)</option>
            <option value="G">Grama (G)</option>
            <option value="L">Litro (L)</option>
            <option value="ML">Mililitro (ML)</option>
            <option value="MG">Miligrama (MG)</option>
            <option value="CX">Caixa (CX)</option>
            <option value="PCT">Pacote (PCT)</option>
            <option value="FD">Fardo (FD)</option>
            <option value="DZ">Dúzia (DZ)</option>
          </select>

          {errors.unit && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.unit.message}
            </span>
          )}
        </label>

        <label>
          <span className="text-sm font-bold">
            Código de barras{" "}
            <span className="font-normal text-slate-500">
              (opcional)
            </span>
          </span>

          <Input
            className="mt-2"
            placeholder="789..."
            {...register("barcode")}
          />
        </label>

        <label>
          <span className="text-sm font-bold">
            Imagem (URL){" "}
            <span className="font-normal text-slate-500">
              (opcional)
            </span>
          </span>

          <Input
            className="mt-2"
            placeholder="https://..."
            aria-invalid={Boolean(errors.imageUrl)}
            {...register("imageUrl")}
          />

          {errors.imageUrl && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.imageUrl.message}
            </span>
          )}
        </label>
      </div>

      {/* DESCRIÇÃO */}
      <label className="block">
        <span className="text-sm font-bold">
          Descrição{" "}
          <span className="font-normal text-slate-500">
            (opcional)
          </span>
        </span>

        <textarea
          className={`${fieldClass} h-28 py-3`}
          placeholder="Detalhes sobre o produto"
          {...register("description")}
        />
      </label>

      {/* STATUS */}
      <label className="block max-w-xs">
        <span className="text-sm font-bold">
          Status <span className="text-red-500">*</span>
        </span>

        <select
          className={fieldClass}
          {...register("status")}
        >
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>
      </label>

      {/* BOTÃO */}
      <div className="flex justify-end border-t pt-5">
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
        >
          <Save className="size-4" />

          {submitting
            ? "Salvando..."
            : "Salvar produto"}
        </Button>
      </div>
    </form>
  );
}