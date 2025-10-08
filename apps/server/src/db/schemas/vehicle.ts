import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSchemaFactory, createSelectSchema } from "drizzle-zod";

import { timestamps } from "../helpers/timestamps";

export const vehiclesTable = sqliteTable("vehicle", {
  id: integer().primaryKey({ autoIncrement: true }),
  brand: text().notNull(),
  description: text(),
  engine: text(),
  model: text().notNull(),
  power: integer(),
  trim: text(),
  year: integer(),
  ...timestamps,
});

const { createInsertSchema } = createSchemaFactory({
  coerce: {
    number: true,
  },
});

export const vehicleSchema = createSelectSchema(vehiclesTable);
export const vehicleInsertSchema = createInsertSchema(vehiclesTable, {
  brand: (schema) => schema.min(1),
  model: (schema) => schema.min(1),
});
