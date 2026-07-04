import { errors } from "#errors";
import { listOperationsSchema } from "@cm3k/validation";
import { oc } from "@orpc/contract";

const list = oc
  .route({
    method: "GET",
    path: "/",
  })
  .output(listOperationsSchema);

export const operationsContract = oc.errors(errors).prefix("/operations").router({
  operations: {
    list,
  },
});
