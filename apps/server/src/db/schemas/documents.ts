import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../helpers/timestamps";
import { documentsTypes } from "./documentsTypes";

export const documents = sqliteTable("documents", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  date: integer({ mode: "timestamp" }),
  mileage: integer(),
  uri: text(),
  note: text(),
  typeId: integer("type_id").references(() => documentsTypes.id),
  entityId: integer("documentable_id").notNull(),
  entityType: text({ enum: ["vehicle", "operation"] }),
  deleted: integer({ mode: "boolean" }).default(false),
  ...timestamps,
});
