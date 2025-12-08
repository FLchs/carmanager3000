import * as z from "zod/v4";

export const operationSchema = z.object({
  id: z.coerce.number<number>(),
  note: z.string().optional(),
  mileage: z.coerce.number<number>().optional(),
  type: z.string().optional(),
  date: z.coerce.date<Date>().optional(),
  vehicleId: z.number(),
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
