import "obsidian";

import type { FullIndex } from "data-index";

declare module "obsidian" {
  interface App {
    plugins: {
      getPlugin(name: "dataview"): {
        index: FullIndex | undefined;
      } | undefined;
    };
  }

  interface MetadataCache {
    on(name: "dataview:index-ready" | "dataview:metadata-change", callback: (type: unknown, file: TFile, oldPath?: string) => unknown, ctx?: unknown): EventRef;
  }
}
