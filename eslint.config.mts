import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  tseslint.configs.recommended,
  stylistic.configs.customize({
    arrowParens: true,
    commaDangle: "always-multiline",
    indent: 2,
    quotes: "double",
    semi: true,
  }),
  {
    rules: {
      "@stylistic/array-bracket-newline": [
        "error",
        { multiline: true },
      ],
      "@stylistic/array-element-newline": [
        "error",
        { minItems: 2 },
      ],
      "@stylistic/eol-last": [
        "error",
        "always",
      ],
      "@stylistic/object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 2,
          },
          ObjectPattern: {
            multiline: true,
            minProperties: 2,
          },
          ImportDeclaration: {
            multiline: true,
            minProperties: 2,
          },
          ExportDeclaration: {
            multiline: true,
            minProperties: 2,
          },
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "obsidian-dataview-table-cache",
      "dist",
    ],
  },
]);
