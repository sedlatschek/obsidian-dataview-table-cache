import "obsidian";

declare module "obsidian" {
  interface MetadataCache {
    on(name: "dataview:index-ready" | "dataview:metadata-change", callback: (type: unknown, file: TFile, oldPath?: string) => unknown, ctx?: unknown): EventRef;
  }
}
