import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const documentsTypes = sqliteTable("documents_types", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull(),
});
