import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateUser } from "@/hooks/useCreateUser";
import { UserForm } from "@/components/users/UserForm";
import { Input } from "@/components/ui/Input";
import type { User, UserInput } from "@/types/user";
import { PlusCircle } from "lucide-react";
import { ApiError } from "@/components/ui/ApiError";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useUsers } from "@/hooks/useUsers";

export default function Users() {
  const usersQuery = useUsers();
  const client = useQueryClient();
  const [selected, setSelected] = useState<User>();
  const deletion = useMutation({
    mutationFn: (id: string) => userService.excluirUsuario(id),
    onSuccess: async () => {
      setSelected(undefined);
      await Promise.all(["usuarios", "users", "vendedores", "mercados", "precos", "permissoes"].map(key => client.invalidateQueries({ queryKey: [key] })));
      await usersQuery.refetch();
      toast.success("Usuário excluído permanentemente.");
    },
    onError: () => toast.error("Não foi possível excluir. Contas de administrador são protegidas."),
  });
  const createUser = useCreateUser();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const open = params.get("novo") === "1";
  function toggle(value: boolean) {
    const next = new URLSearchParams(params);
    if (value) next.set("novo", "1");
    else next.delete("novo");
    setParams(next, { replace: true });
  }
  async function submit(input: UserInput) {
    try {
      await createUser.mutateAsync(input);
      toggle(false);
      toast.success("Conta criada.");
    } catch {
      toast.error("Não foi possível criar a conta. Confira os dados.");
    }
  }

  if (usersQuery.isLoading) {
    return <div className="mx-auto max-w-6xl">Carregando usuários...</div>;
  }

  if (usersQuery.isError) {
    return <ApiError onRetry={() => void usersQuery.refetch()} />;
  }

  const users = (usersQuery.data ?? []).filter((u) =>
    `${u.name} ${u.email}`
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    VENDEDOR: "Vendedor",
    USER: "Consumidor",
  };

  return (
    <div className="mx-auto max-w-6xl">
      <ConfirmDialog open={Boolean(selected)} title="Excluir usuário permanentemente?"
        message={`A conta de ${selected?.name ?? "este usuário"} (${selected?.email ?? ""}) e suas listas serão apagadas. Seus mercados ficarão inativos e sem vendedor; preços e imagens serão preservados. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir permanentemente" loading={deletion.isPending}
        onClose={() => { if (!deletion.isPending) setSelected(undefined); }}
        onConfirm={() => { if (selected) deletion.mutate(selected.id); }} />
      <SectionTitle
        title="Usuários"
        description="Consulte as contas e cadastre consumidores, vendedores ou administradores."
        action={
          <Button onClick={() => toggle(!open)}>
            <PlusCircle className="size-4" /> Novo usuário
          </Button>
        }
      />
      {open && (
        <section className="qt-panel mb-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Nova conta</h2>
            <Button
              variant="outline"
              disabled={createUser.isPending}
              onClick={() => toggle(false)}
            >
              Cancelar
            </Button>
          </div>
          <div className="max-w-2xl">
            <UserForm
              submitting={createUser.isPending}
              onSubmit={(input) => void submit(input)}
            />
          </div>
        </section>
      )}
      <label className="mb-6 block">
        <span className="mb-2 block text-sm font-semibold">
          Buscar nome ou e-mail
        </span>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>
      {users.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Nenhum usuário encontrado.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {users.map((user) => (
              <article className="qt-panel" key={user.id}>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="qt-muted mt-2 break-all">{user.email}</p>
                <p className="mt-4 text-sm">
                  {roleLabels[user.role ?? "USER"] ?? user.role} ·{" "}
                  {user.active === false ? "Inativo" : "Ativo"}
                </p>
                {user.role !== "ADMIN" && <Button variant="outline" size="sm" className="mt-4 text-red-600" onClick={() => setSelected(user)}>Excluir permanentemente</Button>}
              </article>
            ))}
          </div>
          <Card className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Perfil</th>
                  <th className="px-4 py-3">Status</th><th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t last:border-b">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 text-slate-500">{user.email}</td>
                    <td className="px-4 py-4">
                      {roleLabels[user.role ?? "USER"] ?? user.role}
                    </td>
                    <td className="px-4 py-4">
                      <Badge>
                        {user.active === false ? "Inativo" : "Ativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">{user.role === "ADMIN" ? <span className="text-xs text-slate-500">Conta protegida</span> : <Button variant="outline" size="sm" className="text-red-600" onClick={() => setSelected(user)}>Excluir permanentemente</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}
