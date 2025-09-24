import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/db/schemas/*",
  dialect: "sqlite",
  dbCredentials: {
    url: "./cm3k.db",
  },
});
