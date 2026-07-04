import { errors } from "#errors";
import {
  createDocumentTypeSchema,
  getDocumentTypeSchema,
  listDocumentTypesSchema,
} from "@cm3k/validation";
import { oc } from "@orpc/contract";

const list = oc
  .route({
    method: "GET",
    path: "/",
  })
  .output(listDocumentTypesSchema);

const create = oc
  .route({
    method: "POST",
    path: "/",
  })
  .input(createDocumentTypeSchema)
  .output(getDocumentTypeSchema);

export const documentTypesContract = oc.errors(errors).prefix("/document-types").router({
  documentTypes: {
    list,
    create,
  },
});
