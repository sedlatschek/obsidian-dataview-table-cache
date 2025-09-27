import type {
  DataArray, DataviewApi,
} from "obsidian-dataview";
import { getContainer } from "src/container";
import { InvalidQueryFormatError } from "src/errors/InvalidQueryFormatError";
import type { ITable } from "src/table/Table";

import { addExtensionIfMissing as appendExtensionIfMissing } from "../utility/utility";
import { isSmarkdownPage } from "./ExtendedSMarkdownPage";

export function queryTable(this: DataviewApi, query: string): ITable | undefined {
  const parts = query.split("::").map((part) => part.trim());
  if (parts.length !== 2) {
    throw new InvalidQueryFormatError(query);
  }
  const cache = getContainer().cacheManager.getCache(this.app);
  const identifier = `${appendExtensionIfMissing(parts[0], "md")}::${parts[1]}`;
  return cache.getTable(identifier);
}

export function queryTables(this: DataviewApi, query?: string): DataArray<ITable> {
  const cache = getContainer().cacheManager.getCache(this.app);

  if (!query) {
    const tables = cache.all();
    return this.array(tables);
  }

  let tables: ITable[] = [];
  const pages = this.pages(query);
  for (const page of pages) {
    if (!isSmarkdownPage(page)) {
      console.warn("Skipping non-SMarkdownPage", page);
      continue;
    }
    tables = cache.getTables(page.file.path);
  }
  return this.array(tables);
};
