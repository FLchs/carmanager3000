import { documentTypesContract } from "@cm3k/contract";
import { implement } from "@orpc/server";

import { createDocumentType, listDocumentTypes } from "./service";

const o = implement(documentTypesContract);

const list = o.documentTypes.list.handler(async () => {
  const result = await listDocumentTypes();
  if (result.isErr) {
    throw result.error;
  }
  return result.value;
});

const create = o.documentTypes.create.handler(async ({ input }) => {
  const documentType = await createDocumentType(input);
  if (documentType.isErr) {
    throw documentType.error;
  }
  return documentType.value;
});

export const documentTypesRouter = o.router({
  documentTypes: {
    list,
    create,
  },
});
