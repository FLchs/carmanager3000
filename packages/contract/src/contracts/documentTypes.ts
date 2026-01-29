import { errors } from "#errors";
import { listDocumentTypesSchema } from "@cm3k/validation";
import { oc } from "@orpc/contract";

const list = oc
  .route({
    method: "GET",
    path: "/",
  })
  .output(listDocumentTypesSchema);

export const documentTypesContract = oc.errors(errors).prefix("/document-types").router({
  documentTypes: {
    list,
  },
});
