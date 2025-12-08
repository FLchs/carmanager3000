import * as z from "zod/v4";

export const operationSchema = z.object({
  id: z.number().int(),
  date: z.coerce.date().nullable(),
  mileage: z.number().int().nullable(),
  note: z.string().nullable(),
  type: z.string(),
  vehicleId: z.number().int(),
});
// CRUD operation schemas following verbDomain pattern
export const createOperationSchema = operationSchema.omit({
  id: true,
});

export const getOperationSchema = operationSchema.omit({
  vehicleId: true,
});

export const updateOperationSchema = operationSchema.partial().omit({ id: true });

export const listOperationsSchema = z.array(getOperationSchema);
