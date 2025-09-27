import type {
  DataArray,
  SMarkdownPage,
} from "obsidian-dataview";

import type { ITable } from "../table/Table";

type ExtendedSMarkdownPage = {
  file: ExtendedSMarkdownPageFile;
} & SMarkdownPage;

type ExtendedSMarkdownPageFile = {
  tables?: DataArray<ITable>;
} & SMarkdownPage["file"];

export function isSmarkdownPageFile(file: unknown): file is ExtendedSMarkdownPageFile {
  return typeof file === "object" && file !== null && "path" in file && typeof (file as SMarkdownPage["file"]).path === "string";
}

export function isSmarkdownPage(page: unknown): page is ExtendedSMarkdownPage {
  return typeof page === "object" && page !== null && "file" in page && isSmarkdownPageFile((page as SMarkdownPage).file);
}
