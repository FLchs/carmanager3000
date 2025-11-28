import { reactConfig } from "@cm3k/eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["src/routeTree.gen.ts"]),
  ...reactConfig(),
]);
