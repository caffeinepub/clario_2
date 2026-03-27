import { useMutation } from "@tanstack/react-query";
import type { Submission } from "../backend.d";
import { useActor } from "./useActor";

export function useSubmitForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (submission: Submission) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitForm(submission);
    },
  });
}
