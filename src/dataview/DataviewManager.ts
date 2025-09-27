import type { App } from "obsidian";
import {
  type DataviewApi,
  type FullIndex,
  getAPI,
  type PageMetadata,
} from "obsidian-dataview";

import { getContainer } from "../container";
import { DataviewNotFoundError } from "../errors/DataviewNotFoundError";
import { PatchingError } from "../errors/PatchingError";
import {
  queryTable, queryTables,
} from "./query";

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
    dv.queryTable = queryTable.bind(dv);
    dv.queryTables = queryTables.bind(dv);
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
