import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import importLite from "eslint-plugin-import-lite";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export const defaultConfig = (extended: Parameters<typeof defineConfig>) =>
  defineConfig([
    globalIgnores(["dist/"]),
    {
      extends: [
        eslintJs.configs.recommended,
        tseslint.configs.recommended,
        // eslintReact.configs["recommended-typescript"],
        // "react-hooks/recommended",
      ],
      files: ["**/*.{ts,tsx,mts,cts}"],
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
        parserOptions: {
          // Enable project service for better TypeScript integration
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      plugins: {
        import: importLite,
        // "react-hooks": reactHooks,
      },
    },
    eslintPluginUnicorn.configs.recommended,
    // reactRefresh.configs.vite,
    importLite.configs.recommended,
    perfectionist.configs["recommended-natural"],
    {
      rules: {
        // "import/consistent-type-specifier-style": ["error", "top-level"],
        // "import/first": "error",
        // "import/no-duplicates": "error",
        // "import/no-mutable-exports": "error",
        // "import/no-named-default": "error",
        // "react-refresh/only-export-components": ["error"],
        "perfectionist/sort-objects": [
          "error",
          {
            groups: ["unique", "unknown", ["multiline-member", "metadata"]],
            customGroups: [
              {
                groupName: "unique",
                selector: "property",
                elementNamePattern: "^(?:id|name)$",
              },
              {
                groupName: "metadata",
                selector: "property",
                elementNamePattern: "^(?:timestamps)$",
              },
            ],
          },
        ],
        "perfectionist/sort-jsx-props": [
          "error",
          {
            groups: ["selector", "multiline-prop", "unknown", "shorthand-prop"],
            customGroups: [
              {
                groupName: "selector",
                elementNamePattern: "^selector+",
              },
            ],
          },
        ],

        "unicorn/filename-case": ["off"],
        "unicorn/prevent-abbreviations": [
          "off",
          {
            checkFilenames: false,
          },
        ],
      },
    },
    ...(extended ?? []),
  ]);

export const reactConfig = () =>
  defaultConfig([
    {
      extends: [
        eslintReact.configs["recommended-typescript"],
        "react-hooks/recommended",
      ],
      languageOptions: {
        globals: { ...globals.browser },
      },
      plugins: {
        "react-hooks": reactHooks,
      },
    },
    reactRefresh.configs.vite,
    {
      rules: {
        "react-refresh/only-export-components": ["error"],
      },
    },
  ]);
