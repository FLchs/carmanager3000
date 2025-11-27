import * as z from "zod/v4";

export const operationSchema = z.object({
  id: z.coerce.number<number>(),
  date: z.coerce.date<Date>(),
  mileage: z.coerce.number<number>(),
  note: z.string(),
  type: z.string(),
  vehicleId: z.coerce.number<number>(),
});

export const operationInsertSchema = operationSchema.omit({ id: true });
