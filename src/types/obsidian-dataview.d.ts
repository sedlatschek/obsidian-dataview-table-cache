import type { DataArray } from "obsidian-dataview";
import type { ITable } from "src/table/Table";

import type {
  queryTable, queryTables,
} from "../dataview/query";

declare module "obsidian-dataview" {
  interface DataviewApi {
    queryTable: typeof queryTable;
    queryTables: typeof queryTables;
  }

  interface SMarkdownPage {
    tables?: DataArray<ITable>;
  }
}
