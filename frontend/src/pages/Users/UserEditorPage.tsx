import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { UserForm } from "@/components/users/UserForm";
import { useCreateUser } from "@/hooks/useCreateUser";
import type { UserInput } from "@/types/user";

export function UserEditorPage() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  async function submit(input: UserInput) {
    try {
      await createUser.mutateAsync(input);
      toast.success("Usuário criado.");
      navigate("/admin/usuarios");
    } catch {
      toast.error("Erro ao criar usuário.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle
        title="Novo usuário"
        description="Cadastre um novo usuário para acessar o sistema."
        action={
          <Button variant="outline" asChild>
            <Link to="/admin/usuarios">Cancelar</Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="p-5 sm:p-7">
          <UserForm submitting={createUser.isPending} onSubmit={submit} />
        </CardContent>
      </Card>
    </div>
  );
}

