import { type DataArray } from "obsidian-dataview";

import type { ITable } from "../table/Table";

declare module "obsidian-dataview" {
  interface DataviewApi {
    queryTable: (query: string) => ITable | undefined;
    queryTables: (query?: string) => DataArray<ITable>;
  }
}
