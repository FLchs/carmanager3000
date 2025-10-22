import { relations } from "drizzle-orm";

import { maintenanceLogTable } from "./maintenanceLog";
import { vehiclesTable } from "./vehicle";

export const vehicleRelations = relations(vehiclesTable, ({ many }) => ({
  maintenanceLog: many(maintenanceLogTable),
}));

export const maintenanceLogsRelations = relations(
  maintenanceLogTable,
  ({ one }) => ({
    vehicle: one(vehiclesTable, {
      fields: [maintenanceLogTable.vehicleId],
      references: [vehiclesTable.id],
    }),
  }),
);
