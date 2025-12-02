import * as z from "zod/v4";

export const operationSchema = z.object({
  id: z.coerce.number<number>(),
  note: z.string().nullable(),
  mileage: z.coerce.number<number>().nullable(),
  type: z.string().nullable(),
  date: z.coerce.date<Date>().nullable(),
  vehicleId: z.number(),
});

// CRUD operation schemas following verbDomain pattern
export const createOperationSchema = operationSchema.omit({
  id: true,
});

export const getOperationSchema = operationSchema.omit({
  vehicleId: true,
});

export const listOperationsSchema = z.array(getOperationSchema);
