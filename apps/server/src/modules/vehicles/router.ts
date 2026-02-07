import { createDocument, getDocument, listDocuments } from "../documents/service";
import {
  createOperation,
  getOperation,
  listOperations,
  removeOperation,
} from "../operations/service";
import { createVehicle, getVehicle, listVehicle, removeVehicle, updateVehicle } from "./service";
import { vehiclesContract } from "@cm3k/contract";
import { implement } from "@orpc/server";

const o = implement(vehiclesContract);

const list = o.vehicles.list.handler(async () => {
  const result = await listVehicle();
  if (result.isErr) {
    throw result.error;
  }
  return result.value;
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
  const updateResult = await updateVehicle(input.params.id, input.body);
  if (updateResult.isErr) {
    throw updateResult.error;
  }
  const result = await getVehicle(input.params.id);
  if (result.isErr) {
    throw result.error;
  }
  return result.value;
});

const remove = o.vehicles.remove.handler(async ({ input }) => {
  const result = await removeVehicle(input.id);
  if (result.isErr) {
    throw result.error;
  }
  return {
    ok: true,
  };
});

const operations = {
  create: o.vehicles.operations.create.handler(async ({ input }) => {
    const id = await createOperation(input.params.vehicleId, input.body);
    if (id.isErr) {
      throw id.error;
    }
    const result = await getOperation(id.value);
    if (result.isErr) {
      throw result.error;
    }
    return result.value;
  }),
  list: o.vehicles.operations.list.handler(async ({ input }) => {
    const result = await listOperations(input.params.vehicleId);
    if (result.isErr) {
      throw result.error;
    }
    return result.value;
  }),
  remove: o.vehicles.operations.remove.handler(async ({ input }) => {
    const result = await removeOperation(input.params.id);
    if (result.isErr) {
      throw result.error;
    }
    return {
      ok: true,
    };
  }),
};

const documents = {
  create: o.vehicles.documents.create.handler(async ({ input }) => {
    const documentData = {
      ...input.body,
      entityId: input.params.vehicleId,
      entityType: "vehicle" as const,
    };
    const id = await createDocument(documentData);
    if (id.isErr) {
      throw id.error;
    }
    const result = await getDocument(id.value);
    if (result.isErr) {
      throw result.error;
    }
    return result.value;
  }),
  list: o.vehicles.documents.list.handler(async ({ input }) => {
    const result = await listDocuments(input.params.vehicleId, "vehicle");
    if (result.isErr) {
      throw result.error;
    }
    return result.value;
  }),
};

export const vehiclesRouter = o.router({
  vehicles: {
    create,
    get,
    list,
    operations,
    documents,
    remove,
    update,
  },
});
