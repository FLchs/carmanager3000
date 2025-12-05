import {
  vehicleSchema,
  getVehicleSchema,
  listOperationsSchema,
  createOperationSchema,
} from "@cm3k/validation";
import { oc } from "@orpc/contract";
import { z } from "zod/v4";

// Success response schema for mutations
const successSchema = z.object({
  ok: z.literal(true),
});

const list = oc
  .route({
    method: "GET",
    path: "/",
  })
  .output(z.array(vehicleSchema));

const get = oc
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .output(getVehicleSchema);

const create = oc
  .route({
    method: "POST",
    path: "/",
  })
  .input(vehicleSchema.omit({ id: true }))
  .output(successSchema);

const update = oc
  .route({
    method: "PUT",
    path: "/{id}",
  })
  .input(vehicleSchema)
  .output(successSchema);

const remove = oc
  .route({
    method: "DELETE",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .output(successSchema);

const operations = {
  create: oc
    .route({
      method: "POST",
      path: "/{id}",
      inputStructure: "detailed",
    })
    .input(
      z.object({
        body: createOperationSchema.omit({ vehicleId: true }),
        params: z.object({ id: z.coerce.number<number>() }),
      }),
    )
    .output(successSchema),

  list: oc
    .route({
      inputStructure: "detailed",
      method: "GET",
      path: "/{vehicleId}/operations",
    })
    .input(z.object({ params: z.object({ vehicleId: z.coerce.number<number>() }) }))
    .output(listOperationsSchema),
  remove: oc
    .route({
      method: "DELETE",
      path: "/{id}",
    })
    .input(z.object({ id: z.number() }))
    .output(successSchema),
};

export const vehiclesContract = oc.prefix("/vehicles").router({
  vehicles: {
    update,
    list,
    create,
    get,
    remove,
    operations,
  },
});
