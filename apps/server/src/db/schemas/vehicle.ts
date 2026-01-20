import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../helpers/timestamps";

export const vehicles = sqliteTable("vehicle", {
  id: integer().primaryKey({ autoIncrement: true }),
  brand: text().notNull(),
  description: text(),
  deleted: integer({ mode: "boolean" }).default(false),
  engine: text(),
  model: text().notNull(),
  power: integer(),
  trim: text(),
  year: integer(),
  ...timestamps,
});
