import type { Table } from "mdast";
import type { ParsedCell } from "./ParsedCell";

export interface ParsedTable {
  index: number;
  caption?: string;
  headers: ParsedCell[];
  alignment?: Table["align"];
  rows: ParsedCell[][];
}
