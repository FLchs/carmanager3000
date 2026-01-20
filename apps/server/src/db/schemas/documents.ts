import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../helpers/timestamps";

export const documents = sqliteTable("documents", {
  id: integer().primaryKey({ autoIncrement: true }),
  date: integer({ mode: "timestamp" }),
  mileage: integer(),
  uri: text(),
  note: text(),
  type: text({ enum: ["cover"] }).notNull(),
  entityId: integer("documentable_id").notNull(),
  entityType: text({ enum: ["vehicle", "operation"] }),
  deleted: integer({ mode: "boolean" }).default(false),
  ...timestamps,
});
