import {
  createVehicle,
  getVehicle,
  listVehicle,
  removeVehicle,
  updateVehicle,
} from "#core/vehicle/service";
import { vehicleInsertSchema } from "#db/schemas/validation";
import { os } from "@orpc/server";

import { vehicleSchema, vehicleWithLogSchema } from "../db/schemas/validation";

const list = os
  .route({
    method: "GET",
    path: "/",
  })
  .handler(async () => {
    return listVehicle();
  });

const get = os
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .output(vehicleWithLogSchema)
  .handler(async ({ input }) => {
    return await getVehicle(input.id);
  });

const create = os
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

const update = os
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

const remove = os
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

export const vehiclesRouter = os.prefix("/vehicles").router({
  create,
  get,
  list,
  remove,
  update,
});
