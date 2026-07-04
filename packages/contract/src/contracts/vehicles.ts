import { errors } from "#errors";
import {
  getVehicleSchema,
  listOperationsSchema,
  createOperationSchema,
  updateVehicleSchema,
  createVehicleSchema,
  listVehiclesSchema,
  getOperationSchema,
  listDocumentsSchema,
  createDocumentSchema,
  getDocumentSchema,
  deleteInputSchema,
  deleteOutputSchema,
} from "@cm3k/validation";
import { oc } from "@orpc/contract";
import { z } from "zod/v4";

const list = oc
  .route({
    method: "GET",
    path: "/",
  })
  .output(listVehiclesSchema);

const get = oc
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(z.object({ id: z.coerce.number<number>() }))
  .output(getVehicleSchema);

const create = oc
  .route({
    method: "POST",
    path: "/",
  })
  .input(createVehicleSchema)
  .output(getVehicleSchema);

const update = oc
  .route({
    method: "PATCH",
    path: "/{id}",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      body: updateVehicleSchema,
      params: z.object({ id: z.coerce.number<number>() }),
    }),
  )
  .output(getVehicleSchema);

const remove = oc
  .route({
    method: "DELETE",
    path: "/{id}",
    successStatus: 204,
  })
  .input(deleteInputSchema)
  .output(deleteOutputSchema);

const operations = {
  create: oc
    .route({
      method: "POST",
      path: "/{vehicleId}/operations",
      inputStructure: "detailed",
    })
    .input(
      z.object({
        body: createOperationSchema,
        params: z.object({ vehicleId: z.coerce.number<number>() }),
      }),
    )
    .output(getOperationSchema),

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
      path: "/{vehicleId}/{id}",
      inputStructure: "detailed",
      successStatus: 204,
    })
    .input(
      z.object({
        params: z.object({
          vehicleId: z.number().int(),
          id: deleteInputSchema.shape.id,
        }),
      }),
    )
    .output(deleteOutputSchema),
};

const documents = {
  create: oc
    .route({
      method: "POST",
      path: "/{vehicleId}/documents",
      inputStructure: "detailed",
    })
    .input(
      z.object({
        body: createDocumentSchema,
        params: z.object({ vehicleId: z.coerce.number<number>() }),
      }),
    )
    .output(getDocumentSchema),

  list: oc
    .route({
      inputStructure: "detailed",
      method: "GET",
      path: "/{vehicleId}/documents",
    })
    .input(z.object({ params: z.object({ vehicleId: z.coerce.number<number>() }) }))
    .output(listDocumentsSchema),
};

export const vehiclesContract = oc.errors(errors).prefix("/vehicles").router({
  vehicles: {
    update,
    list,
    create,
    get,
    remove,
    operations,
    documents,
  },
});
