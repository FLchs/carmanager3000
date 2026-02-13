import { errors } from "#errors";
import { oc } from "@orpc/contract";
import { deleteInputSchema, deleteOutputSchema } from "@cm3k/validation";

const remove = oc
  .route({
    method: "DELETE",
    path: "/{id}",
    successStatus: 204,
  })
  .input(deleteInputSchema)
  .output(deleteOutputSchema);

export const documentsContract = oc.errors(errors).prefix("/documents").router({
  documents: {
    remove,
  },
});
