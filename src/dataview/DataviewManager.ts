import type { App } from "obsidian";
import {
  getAPI,
  type DataArray,
  type DataviewApi,
} from "obsidian-dataview";

import { getContainer } from "../container";
import { DataviewNotFoundError } from "src/errors/DataviewNotFoundError";
import { isSmarkdownPage } from "./ExtendedSMarkdownPage";
import type { ITable } from "../table/Table";
import { addExtensionIfMissing as appendExtensionIfMissing } from "../utility/utility";
import { InvalidQueryFormatError } from "../errors/InvalidQueryFormatError";

export class DataviewManager {
  public getDataviewApi(app?: App): DataviewApi {
    const dv = getAPI(app);
    if (!dv) {
      throw new DataviewNotFoundError();
    }
    return dv;
  }

  public patchDataviewApi(app?: App): void {
    const dv = this.getDataviewApi(app);

    dv.queryTable = (query: string): ITable | undefined => {
      const parts = query.split("::").map((part) => part.trim());
      if (parts.length !== 2) {
        throw new InvalidQueryFormatError(query);
      }
      const cache = getContainer().cacheManager.getCache(dv.app);
      const identifier = `${appendExtensionIfMissing(parts[0], "md")}::${parts[1]}`;
      return cache.getTable(identifier);
    };

    dv.queryTables = (query?: string): DataArray<ITable> => {
      const cache = getContainer().cacheManager.getCache(dv.app);

      if (!query) {
        const tables = cache.all();
        return dv.array(tables);
      }

      let tables: ITable[] = [];
      const pages = dv.pages(query);
      for (const page of pages) {
        if (!isSmarkdownPage(page)) {
          console.warn("Skipping non-SMarkdownPage", page);
          continue;
        }
        tables = cache.getTables(page.file.path);
      }
      return dv.array(tables);
    };
  }
}
