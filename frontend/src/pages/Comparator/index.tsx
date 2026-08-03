import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function ComparadorPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle title="Comparador" description="Compare produtos e mercados em um único painel." />
      <Card className="mt-5">
        <CardContent className="p-8 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Tela de comparação em construção.</p>
          <p className="mt-2">A lógica de comparação pode ser conectada aqui com os produtos e preços cadastrados.</p>
        </CardContent>
      </Card>
    </div>
  );
}
