import type { ITable } from "../table/Table.js";
import type { ICache } from "./Cache.ts";

export class MemoryCache implements ICache {
  private readonly cache: Map<string, ITable>;

  public constructor() {
    this.cache = new Map();
  }

  public all(): ITable[] {
    return Array.from(this.cache.values());
  }

  public clear(): void {
    this.cache.clear();
  }

  public deleteTable(identifier: string): void {
    this.cache.delete(identifier);
  }

  public deleteTables(path: string): void {
    const tables = this.getTables(path);
    for (const table of tables) {
      this.deleteTable(table.identifier);
    }
  }

  public getTable(identifier: string): ITable | undefined {
    return this.cache.get(identifier);
  }

  public getTables(path: string): ITable[] {
    return Array.from(this.cache.values()).filter((table) => table.path === path);
  }

  public set(tables: ITable | ITable[]): void {
    if (Array.isArray(tables)) {
      for (const table of tables) {
        this.cache.set(table.identifier, table);
      }
    }
    else {
      this.cache.set(tables.identifier, tables);
    }
  }
}
