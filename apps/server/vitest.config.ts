import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/db/schemas/*"],
      include: ["src/**/*.ts"],
    },
  },
});
