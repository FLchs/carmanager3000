import * as z from "zod/v4";

import { listOperationsSchema } from "./operations";

// TODO: make optional instead of nullable to accept partial input
export const vehicleSchema = z.object({
  id: z.coerce.number(),
  brand: z.string(),
  description: z.string().optional(),
  engine: z.string().optional(),
  model: z.string(),
  power: z.coerce.number().optional(),
  trim: z.string().optional(),
  year: z.coerce.number().optional(),
});

export const createVehicleSchema = vehicleSchema.omit({
  id: true,
});

export const updateVehicleSchema = vehicleSchema.partial().omit({ id: true });

export const getVehicleSchema = vehicleSchema.extend({
  operations: listOperationsSchema,
});

export const listVehiclesSchema = z.array(vehicleSchema);
