import { createSchemaFactory } from "drizzle-zod";
import * as z from "zod/v4";

import { maintenanceLogTable } from "./maintenanceLog";
import { vehiclesTable } from "./vehicle";

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  coerce: {
    // date: true,
    // number: true,
  },
});

export const maintenanceLogSelectSchema =
  createSelectSchema(maintenanceLogTable);

export const maintenanceLogInsertSchema =
  createInsertSchema(maintenanceLogTable);

export const mlInsertSchema = z.object({
  date: z.coerce.date<Date>(),
  mileage: z.coerce.number<number>(),
  note: z.string(),
  type: z.string(),
});

export const vehicleSchema = createSelectSchema(vehiclesTable);
export const vehicleWithLogSchema = createSelectSchema(vehiclesTable)
  .extend({
    maintenanceLog: z.array(
      maintenanceLogSelectSchema.omit({
        createdAt: true,
        updatedAt: true,
        vehicleId: true,
      }),
    ),
  })
  .omit({ createdAt: true, updatedAt: true });
export const vehicleInsertSchema = createInsertSchema(vehiclesTable, {
  brand: (schema) => schema.min(1),
  model: (schema) => schema.min(1),
}).omit({ createdAt: true, updatedAt: true });
