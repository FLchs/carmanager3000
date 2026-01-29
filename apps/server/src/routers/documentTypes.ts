import { listDocumentTypes } from "#core/documentTypes/service";
import { documentTypesContract } from "@cm3k/contract";
import { implement } from "@orpc/server";

const o = implement(documentTypesContract);

const list = o.documentTypes.list.handler(async () => {
  const result = await listDocumentTypes();
  if (result.isErr) {
    throw result.error;
  }
  return result.value;
});

export const documentTypesRouter = o.router({
  documentTypes: {
    list,
  },
});
