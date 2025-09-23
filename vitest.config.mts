import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      src: resolve("./src"),
      obsidian: resolve("./tests/obsidian-stub.ts"),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    globals: true,
    server: { deps: { inline: ["obsidian"] } },
  },
});
