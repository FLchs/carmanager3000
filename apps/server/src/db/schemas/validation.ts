import { createSchemaFactory } from "drizzle-zod";
import * as z from "zod/v4";

import { maintenanceLogTable } from "./maintenanceLog";
import { vehiclesTable } from "./vehicle";

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  coerce: {
    number: true,
  },
});

export const maintenanceLogSelectSchema =
  createSelectSchema(maintenanceLogTable);

export const maintenanceLogInsertSchema = createInsertSchema(
  maintenanceLogTable,
  {},
);

export const vehicleSchema = createSelectSchema(vehiclesTable);
export const vehicleWithLogSchema = createSelectSchema(vehiclesTable).extend({
  maintenanceLog: z.array(maintenanceLogSelectSchema),
});
export const vehicleInsertSchema = createInsertSchema(vehiclesTable, {
  brand: (schema) => schema.min(1),
  model: (schema) => schema.min(1),
});
