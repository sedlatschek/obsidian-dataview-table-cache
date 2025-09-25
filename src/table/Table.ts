import type { Table as MdastTable } from "mdast";
import type { Link } from "obsidian-dataview";

type TableAlignment = MdastTable["align"];

export interface ITable {
  alignment?: TableAlignment;
  caption?: string | undefined;
  path: string;
  headers: TableHeaderCell[];
  identifier: string;
  index: number;
  rows: TableRowCell[][];
}

export type TableHeaderCell = {
  display?: string;
  isHeader: true;
  rowIndex: 0;
  columnIndex: number;
  links: Link[];
};

export type TableRowCell = {
  display?: string;
  isHeader: false;
  rowIndex: number;
  columnIndex: number;
  links: Link[];
};

export type TableCell = TableHeaderCell | TableRowCell;

export type TableOptions = {
  path: string;
  index: number;
  headers: TableHeaderCell[];
  rows: TableRowCell[][];
  alignment?: TableAlignment;
  caption?: string;
};

export class Table implements ITable {
  public readonly path: string;
  public readonly index: number;
  public readonly caption?: string;
  public readonly headers: TableHeaderCell[];
  public readonly alignment?: TableAlignment;
  public readonly rows: TableRowCell[][];

  public get identifier(): string {
    const value = this.caption ?? this.index.toFixed(0);
    return `${this.path}::${value}`;
  }

  public constructor({
    path,
    index,
    caption,
    headers,
    alignment,
    rows,
  }: TableOptions,
  ) {
    this.path = path;
    this.index = index;
    this.headers = headers;
    this.rows = rows;
    this.alignment = alignment;
    this.caption = caption;
  }
}
