import * as z from "zod/v4";

export const vehicleOutSchema = z.object({
  id: z.coerce.number(),
  brand: z.string(),
  description: z.string().nullable(),
  engine: z.string().nullable(),
  model: z.string(),
  power: z.coerce.number().nullable(),
  trim: z.string().nullable(),
  year: z.coerce.number().nullable(),
});

export const vehicleInSchema = z.object({
  brand: z.string(),
  description: z.string(),
  engine: z.string(),
  model: z.string(),
  power: z.coerce.number(),
  trim: z.string(),
  year: z.coerce.number(),
});

export const createVehicleSchema = vehicleInSchema;

export const updateVehicleSchema = vehicleInSchema.partial();

export const getVehicleSchema = vehicleOutSchema;

export const listVehiclesSchema = z.array(vehicleOutSchema);
