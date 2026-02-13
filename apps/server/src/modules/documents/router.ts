import { removeDocument } from "./service";
import { documentsContract } from "@cm3k/contract";
import { implement } from "@orpc/server";

const o = implement(documentsContract);

const remove = o.documents.remove.handler(async ({ input }) => {
  console.log(input);
  const result = await removeDocument(input.id);
  if (result.isErr) {
    throw result.error;
  }
});

export const documentsRouter = o.router({
  documents: {
    remove,
  },
});
