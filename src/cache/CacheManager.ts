import type { App } from "obsidian";
import type { DataviewApi } from "obsidian-dataview";

import { getContainer } from "../container";
import { isSmarkdownPage } from "../dataview/ExtendedSMarkdownPage";
import { NonSMarkdownPageError } from "../errors/NonSMarkdownPageError";
import { parsedTableToTable } from "../mapper/table";
import type { ICache } from "./Cache";

export class CacheManager<T extends ICache> {
  private caches: Map<string, T>;

  public constructor(private readonly cache: new () => T) {
    this.caches = new Map<string, T>();
  }

  public async cachePath(path: string, app?: App): Promise<void> {
    const dv = getContainer().dataviewManager.getDataviewApi(app);

    const cache = this.getCache(dv.app);
    cache.deleteTables(path);

    const page = dv.page(path);
    await this.cachePage(dv, cache, page);
  }

  public async rebuildCache(app?: App): Promise<void> {
    const dv = getContainer().dataviewManager.getDataviewApi(app);
    const cache = this.getCache(dv.app);
    cache.clear();
    await Promise.all(dv.pages().map(async (page) => {
      return this.cachePage(dv, cache, page);
    }));
  };

  public getCache(app: App): ICache {
    const vaultName = app.vault.getName();

    const existingCache = this.caches.get(vaultName);
    if (existingCache) {
      return existingCache;
    }

    const newCache = new this.cache();
    this.caches.set(vaultName, newCache);
    return newCache;
  }

  private async cachePage(dv: DataviewApi, cache: ICache, page: unknown): Promise<void> {
    if (!isSmarkdownPage(page)) {
      throw new NonSMarkdownPageError();
    }
    const markdown = await dv.io.load(page.file.path) ?? "";
    const parcedTables = await getContainer().parser.getTablesFromMarkdown(markdown);
    const tables = parcedTables.map((table) => parsedTableToTable(page.file.path, table));
    cache.set(tables);
  }
}
