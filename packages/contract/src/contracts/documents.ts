import { errors } from "#errors";
import { oc } from "@orpc/contract";
import { z } from "zod/v4";

const remove = oc
  .route({
    method: "DELETE",
    path: "/{id}",
  })
  .input(z.object({ id: z.coerce.number<number>() }));

export const documentsContract = oc.errors(errors).prefix("/documents").router({
  documents: {
    remove,
  },
});
