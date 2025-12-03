import * as z from "zod/v4";
import { listOperationsSchema } from "./operations";

export const vehicleSchema = z.object({
  id: z.coerce.number(),
  brand: z.string(),
  description: z.string().nullable(),
  engine: z.string().nullable(),
  model: z.string(),
  power: z.coerce.number().nullable(),
  trim: z.string().nullable(),
  year: z.coerce.number().nullable(),
});

export const createVehicleSchema = vehicleSchema.omit({
  id: true,
});

export const updateVehicleSchema = vehicleSchema.omit({});

export const getVehicleSchema = vehicleSchema.extend({
  operations: listOperationsSchema,
});

export const listVehiclesSchema = z.array(vehicleSchema);
