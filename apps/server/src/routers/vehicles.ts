import { createOperation, listOperations } from "#core/operation/service";
import { operationInsertSchema } from "#core/operation/validation";
import {
  createVehicle,
  getVehicle,
  listVehicle,
  removeVehicle,
  updateVehicle,
} from "#core/vehicle/service";
import { vehicleInsertSchema, vehicleSchema } from "#core/vehicle/validation";
import o from "#lib/orpc";
import { z } from "zod/v4";

const list = o
  .route({
    method: "GET",
    path: "/",
  })
  .handler(async () => {
    return listVehicle();
  });

const get = o
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  // .output(vehicleWithLogSchema)
  .handler(async ({ input }) => {
    return await getVehicle(input.id);
  });

const create = o
  .route({
    method: "POST",
    path: "/",
  })
  .input(vehicleInsertSchema.omit({ id: true }))
  .handler(async ({ input }) => {
    await createVehicle(input);
    return {
      ok: true,
    };
  });

const update = o
  .route({
    method: "PUT",
    path: "/{id}",
  })
  .input(vehicleInsertSchema)
  .handler(async ({ input }) => {
    await updateVehicle(input);
    return {
      ok: true,
    };
  });

const remove = o
  .route({
    method: "DELETE",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    await removeVehicle(input.id);
    return {
      ok: true,
    };
  });

const operations = {
  create: o
    .route({
      inputStructure: "detailed",
      method: "POST",
      path: "/{id}",
    })
    .input(operationInsertSchema)
    .handler(async ({ input }) => {
      await createOperation(input);
      return {
        ok: true,
      };
    }),
  list: o
    .route({
      inputStructure: "detailed",
      method: "GET",
      path: "/{vehicleId}/operations",
    })
    .input(
      z.object({ params: z.object({ vehicleId: z.coerce.number<number>() }) }),
    )
    .handler(async ({ input }) => {
      return await listOperations(input.params.vehicleId);
    }),
};

export const vehiclesRouter = o.prefix("/vehicles").router({
  create,
  get,
  list,
  operations,
  remove,
  update,
});
