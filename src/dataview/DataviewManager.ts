import type { App } from "obsidian";
import {
  type DataArray,
  type DataviewApi,
  type FullIndex,
  getAPI,
  type PageMetadata,
} from "obsidian-dataview";

import { getContainer } from "../container";
import { DataviewNotFoundError } from "../errors/DataviewNotFoundError";
import { InvalidQueryFormatError } from "../errors/InvalidQueryFormatError";
import { PatchingError } from "../errors/PatchingError";
import type { ITable } from "../table/Table";
import { addExtensionIfMissing as appendExtensionIfMissing } from "../utility/utility";
import { isSmarkdownPage } from "./ExtendedSMarkdownPage";

export class DataviewManager {
  public getDataviewApi(app?: App): DataviewApi {
    const dv = getAPI(app);
    if (!dv) {
      throw new DataviewNotFoundError();
    }
    return dv;
  }

  public patchDataviewApi(app: App): void {
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

  public patchPageMetadata(app: App): void {
    const dvPlugin = app.plugins.getPlugin("dataview");
    if (!dvPlugin) {
      throw new DataviewNotFoundError();
    }

    const index = dvPlugin.index as FullIndex | undefined;
    if (!index) {
      throw new PatchingError("Dataview index is not ready");
    }

    const first = index.pages.values().next().value;
    if (!first) {
      throw new PatchingError("Dataview index has no pages");
    }

    const PageMetadataConstructor = first.constructor;
    if (!PageMetadataConstructor?.prototype) {
      throw new PatchingError("Dataview PageMetadata constructor not found");
    }

    const originalSerialize = PageMetadataConstructor.prototype.serialize as PageMetadata["serialize"];
    if (typeof originalSerialize !== "function") {
      throw new PatchingError("Dataview PageMetadata.serialize is not a function");
    }

    if (originalSerialize.name === "patchedSerialize") {
      return;
    }

    PageMetadataConstructor.prototype.serialize = function patchedSerialize(this: PageMetadata, ...args: unknown[]) {
      const result = originalSerialize.apply(this, args);
      result.file.tables = getContainer().cacheManager.getCache(app).getTables(this.path);
      return result;
    };
  };
}
