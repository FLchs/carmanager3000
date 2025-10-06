import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../helpers/timestamps";

export const todosTable = sqliteTable("todo", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  priority: integer().notNull(),
  ...timestamps,
});
