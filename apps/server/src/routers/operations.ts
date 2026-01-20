import { listOperations } from "#core/operation/service";
import { os } from "@orpc/server";

const list = os
  .route({
    inputStructure: "detailed",
    method: "GET",
    path: "/",
  })
  .handler(async () => {
    const result = await listOperations();
    if (result.isErr) {
      throw result.error;
    }
    return result.value;
  });

export const operationsRouter = os.prefix("/operations").router({
  list,
});
