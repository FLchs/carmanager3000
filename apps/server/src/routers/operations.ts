import { listOperations } from "#core/operation/service";
import { os } from "@orpc/server";

const list = os
  .route({
    inputStructure: "detailed",
    method: "GET",
    path: "/",
  })
  .handler(async () => {
    return await listOperations();
  });

export const operationsRouter = os.prefix("/operations").router({
  list,
});
