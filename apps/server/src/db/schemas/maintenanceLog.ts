import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../helpers/timestamps";
import { vehiclesTable } from "./vehicle";

export const maintenanceLogTable = sqliteTable("maintenanceLog", {
  id: integer().primaryKey({ autoIncrement: true }),
  date: integer({ mode: "timestamp" }),
  mileage: integer(),
  note: text(),
  type: text(),
  vehicleId: integer("owner_id")
    .notNull()
    .references(() => vehiclesTable.id),
  ...timestamps,
});
