import type { ParsedTable } from "../parser/ParsedTable";
import {
  type ITable,
  Table,
  type TableHeaderCell,
  type TableRowCell,
} from "../table/Table";

export function parsedTableToTable(path: string, parsedTable: ParsedTable): ITable {
  const {
    caption,
    index,
    alignment,
  } = parsedTable;

  const headers: TableHeaderCell[] = parsedTable.headers.map(({
    display, links,
  }, columnIndex) => ({
    display,
    links,
    isHeader: true,
    rowIndex: 0,
    columnIndex,
  }));

  const rows: TableRowCell[][] = parsedTable.rows.map((row, rowIndex) =>
    row.map(({
      display,
      links,
    }, columnIndex) => ({
      display,
      links,
      isHeader: false,
      rowIndex,
      columnIndex,
    })),
  );

  return new Table({
    path,
    index: index,
    ...(caption !== undefined && { caption }),
    headers,
    alignment,
    rows,
  });
}
