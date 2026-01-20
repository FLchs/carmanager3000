import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../helpers/timestamps";
import { vehicles } from "./vehicle";

export const operations = sqliteTable("operations", {
  id: integer().primaryKey({ autoIncrement: true }),
  date: integer({ mode: "timestamp" }),
  mileage: integer(),
  note: text(),
  type: text().notNull(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  deleted: integer({ mode: "boolean" }).default(false),
  ...timestamps,
});
