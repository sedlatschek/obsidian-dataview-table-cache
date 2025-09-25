import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "src": resolve("./src"),
      "obsidian": resolve(__dirname, "./stubs/obsidian.ts"),
      "obsidian-dataview": resolve(__dirname, "./stubs/obsidian-dataview.ts"),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    globals: true,
    server: { deps: { inline: ["obsidian"] } },
  },
});
