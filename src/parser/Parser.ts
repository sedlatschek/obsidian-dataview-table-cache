import type { ParsedTable } from "./ParsedTable";

export interface IParser {
  getTablesFromMarkdown: (markdown: string) => Promise<ParsedTable[]>;
}
