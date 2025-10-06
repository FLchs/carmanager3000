import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../helpers/timestamps";

export const todosTable = sqliteTable("todo", {
  description: text(),
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  priority: integer().notNull(),
  ...timestamps,
});
