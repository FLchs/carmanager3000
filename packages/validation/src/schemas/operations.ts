import * as z from "zod/v4";

export const operationInSchema = z.object({
  date: z.coerce.date<Date>().nullable(),
  mileage: z.number().int(),
  note: z.string(),
  type: z.string(),
});

export const operationOutSchema = z.object({
  id: z.number().int(),
  date: z.date().nullable(),
  mileage: z.number().int().nullable(),
  note: z.string().nullable(),
  type: z.string(),
});

export const createOperationSchema = operationInSchema;

export const updateOperationSchema = operationInSchema.partial();

export const getOperationSchema = operationOutSchema;

export const listOperationsSchema = z.array(operationOutSchema);
