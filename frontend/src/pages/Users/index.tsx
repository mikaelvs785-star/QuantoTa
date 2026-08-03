import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { ApiError } from "@/components/ui/ApiError";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useUsers } from "@/hooks/useUsers";

export default function Users() {
  const usersQuery = useUsers();

  if (usersQuery.isLoading) {
    return <div className="mx-auto max-w-7xl">Carregando usuários...</div>;
  }

  if (usersQuery.isError) {
    return <ApiError onRetry={() => void usersQuery.refetch()} />;
  }

  const users = usersQuery.data ?? [];

  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle
        title="Usuários"
        description="Gerencie os usuários do sistema e cadastre novos acessos."
        action={
          <Button asChild>
            <Link to="/usuarios/novo">
              <PlusCircle className="size-4" /> Novo usuário
            </Link>
          </Button>
        }
      />
      {users.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Nenhum usuário encontrado.</p>
          <Button asChild className="mt-4">
            <Link to="/usuarios/novo">Cadastrar usuário</Link>
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t last:border-b">
                  <td className="px-4 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-4 text-slate-500">{user.email}</td>
                  <td className="px-4 py-4">
                    <Badge>{user.active === false ? "Inativo" : "Ativo"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
