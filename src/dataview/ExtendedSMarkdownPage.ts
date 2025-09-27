import type { SMarkdownPage } from "obsidian-dataview";

export function isSmarkdownPageFile(file: unknown): file is SMarkdownPage["file"] {
  return typeof file === "object" && file !== null && "path" in file && typeof (file as SMarkdownPage["file"]).path === "string";
}

export function isSmarkdownPage(page: unknown): page is SMarkdownPage {
  return typeof page === "object" && page !== null && "file" in page && isSmarkdownPageFile((page as SMarkdownPage).file);
}
