import * as z from "zod/v4";

export const operationInsertSchema = z.object({
  date: z.coerce.date<Date>(),
  mileage: z.coerce.number<number>(),
  note: z.string(),
  type: z.string(),
  vehicleId: z.coerce.number<number>(),
});
