import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitSignup() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitSignup(email);
    },
  });
}
