import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export function useCreateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: userService.cadastrarUsuario,
    onSuccess: () => void client.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}
