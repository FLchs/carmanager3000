import { listOperations } from "./service";
import { operationsContract } from "@cm3k/contract";
import { implement } from "@orpc/server";

const o = implement(operationsContract);

const list = o.operations.list.handler(async () => {
  const result = await listOperations();
  if (result.isErr) {
    throw result.error;
  }
  return result.value;
});

export const operationsRouter = o.router({
  operations: {
    list,
  },
});
