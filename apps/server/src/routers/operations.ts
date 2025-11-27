import { listOperations } from "#core/operation/service";
import o from "#lib/orpc";

const list = o
  .route({
    inputStructure: "detailed",
    method: "GET",
    path: "/",
  })
  .handler(async () => {
    return await listOperations();
  });

export const operationsRouter = o.prefix("/operations").router({
  list,
});
