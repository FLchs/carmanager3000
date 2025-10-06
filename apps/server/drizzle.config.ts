import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: "./cm3k.db",
  },
  dialect: "sqlite",
  out: "./migrations",
  schema: "./src/db/schemas/*",
});
