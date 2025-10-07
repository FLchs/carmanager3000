import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  out: "./migrations",
  schema: "./src/db/schemas/*",
  dbCredentials: {
    url: "./cm3k.db",
  },
});
