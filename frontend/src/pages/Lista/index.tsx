import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function ListaPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle title="Lista de Compras" description="Organize sua compra com foco em economia." />
      <Card className="mt-5">
        <CardContent className="p-8 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Lista de compras pronta para ser enriquecida.</p>
          <p className="mt-2">Aqui você pode conectar a gestão de itens da compra com os produtos e ofertas do sistema.</p>
        </CardContent>
      </Card>
    </div>
  );
}
