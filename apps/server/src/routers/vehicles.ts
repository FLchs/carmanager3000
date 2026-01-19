import {
  createOperation,
  getOperation,
  listOperations,
  removeOperation,
} from "#core/operation/service";
import {
  createVehicle,
  getVehicle,
  listVehicle,
  removeVehicle,
  updateVehicle,
} from "#core/vehicle/service";
import { DbError } from "#lib/serviceErrors";
import { vehiclesContract } from "@cm3k/contract";
import { implement } from "@orpc/server";

const o = implement(vehiclesContract);

const list = o.vehicles.list.handler(async () => {
  return await listVehicle();
});

const get = o.vehicles.get.handler(async ({ input }) => {
  const result = await getVehicle(input.id);

  if (result.isErr) {
    throw result.error;
  }

  return result.value;
});

const create = o.vehicles.create.handler(async ({ input }) => {
  const id = await createVehicle(input);
  if (id.isErr) {
    throw id.error;
  }
  const result = await getVehicle(id.value);
  if (result.isErr) {
    throw result.error;
  }

  return result.value;
});

const update = o.vehicles.update.handler(async ({ input }) => {
  await updateVehicle(input.params.id, input.body);
  const result = await getVehicle(input.params.id);
  if (result.isErr) {
    throw result.error;
  }
  return result.value;
});

const remove = o.vehicles.remove.handler(async ({ input }) => {
  await removeVehicle(input.id);
  return {
    ok: true,
  };
});

const operations = {
  create: o.vehicles.operations.create.handler(async ({ input }) => {
    const operationId = await createOperation(input.params.vehicleId, input.body);
    const operation = await getOperation(operationId);
    if (!operation) {
      throw new DbError("Failed to retrieve created operation");
    }
    return operation;
  }),
  list: o.vehicles.operations.list.handler(async ({ input }) => {
    return await listOperations(input.params.vehicleId);
  }),
  remove: o.vehicles.operations.remove.handler(async ({ input }) => {
    await removeOperation(input.id);
    return {
      ok: true,
    };
  }),
};

export const vehiclesRouter = o.router({
  vehicles: {
    create,
    get,
    list,
    operations,
    remove,
    update,
  },
});
