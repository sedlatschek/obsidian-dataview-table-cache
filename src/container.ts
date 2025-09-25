import type { ICache } from "./cache/Cache";
import { CacheManager } from "./cache/CacheManager";
import { MemoryCache } from "./cache/MemoryCache";
import { DataviewManager } from "./dataview/DataviewManager";
import type { IParser } from "./parser/Parser";
import { RemarkParser } from "./parser/RemarkParser";

class Container {
  public readonly cacheManager: CacheManager<ICache>;
  public readonly dataviewManager: DataviewManager;
  public readonly parser: IParser;

  public constructor() {
    this.cacheManager = new CacheManager(MemoryCache);
    this.dataviewManager = new DataviewManager();
    this.parser = new RemarkParser();
  }
}

let container: Container | undefined = undefined;

export function getContainer(): Container {
  if (!container) {
    container = new Container();
  }
  return container;
}
