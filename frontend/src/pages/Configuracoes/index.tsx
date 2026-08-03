import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function ConfiguracoesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle title="Configurações" description="Ajuste preferências e opções do sistema." />
      <Card className="mt-5">
        <CardContent className="p-8 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Configurações do usuário em desenvolvimento.</p>
          <p className="mt-2">Esse espaço pode receber perfil, preferências e integrações futuras.</p>
        </CardContent>
      </Card>
    </div>
  );
}
