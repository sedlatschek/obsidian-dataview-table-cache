import type { ITable } from "../table/Table.js";

export interface ICache {
  all(): ITable[];
  clear(): void;
  deleteTable(identifier: string): void;
  deleteTables(path: string): void;
  getTable(identifier: string): ITable | undefined;
  getTables(path: string): ITable[];
  set(tables: ITable | ITable[]): void;
}
