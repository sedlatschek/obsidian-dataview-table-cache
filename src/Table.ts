import type { Table as MdastTable } from "mdast";

export interface ITable {
  align?: MdastTable["align"];
  caption?: string | undefined;
  path: string;
  headers: string[];
  identifier: string;
  index: number;
  rows: string[][];
}

export type TableOptions = {
  path: string;
  index: number;
  headers: string[];
  rows: string[][];
  align?: MdastTable["align"];
  caption?: string;
};

export class Table implements ITable {
  public readonly path: string;
  public readonly index: number;
  public readonly caption?: string;
  public readonly headers: string[];
  public readonly align?: MdastTable["align"];
  public readonly rows: string[][];

  public get identifier(): string {
    const value = this.caption ?? this.index.toFixed(0);
    return `${this.path}::${value}`;
  }

  public constructor({
    path,
    index,
    caption,
    headers,
    align,
    rows,
  }: TableOptions,
  ) {
    this.path = path;
    this.index = index;
    this.headers = headers;
    this.rows = rows;
    this.align = align;
    this.caption = caption;
  }
}
