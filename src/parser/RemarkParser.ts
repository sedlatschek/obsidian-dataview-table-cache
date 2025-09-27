import type {
  Node,
  Parent,
  TableCell,
} from "mdast";
import type { App } from "obsidian";
import { type DataviewApi } from "obsidian-dataview";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkWikiLink from "remark-wiki-link";
import { unified } from "unified";

import { getContainer } from "../container.js";
import { mdastLinkToDvLink } from "../mapper/links.js";
import { toString } from "../mdast/content.js";
import {
  isParagraph,
  isParent,
  isTable,
} from "../mdast/types.js";
import { isExternalLink } from "../utility/utility.js";
import type { ParsedCell } from "./ParsedCell.js";
import type { ParsedTable } from "./ParsedTable.js";
import type { IParser } from "./Parser.js";

export class RemarkParser implements IParser {
  private readonly processor = unified().use(remarkParse).use(remarkGfm).use(remarkWikiLink);

  public async getTablesFromMarkdown(markdown: string, app?: App): Promise<ParsedTable[]> {
    const dv = getContainer().dataviewManager.getDataviewApi(app);
    const tree = this.processor.parse(markdown);

    const tables: ParsedTable[] = [];
    let i = 0;

    this.walk(tree, (node: Node, parent: Parent | null, index: number | null) => {
      if (!(isTable(node))) {
        return;
      }

      const [
        head,
        ...body
      ] = node.children;

      const headers = head ? head.children.map((child) => this.getParcedCell(dv, child)) : [];
      const rows = body.map((row) => row.children.map((child) => this.getParcedCell(dv, child)));

      const parsedTable: ParsedTable = {
        index: i++,
        caption: this.getCaption(parent, index),
        headers,
        alignment: node.align,
        rows,
      };
      tables.push(parsedTable);
    });

    return tables;
  }

  private getParcedCell(dv: DataviewApi, tableCell: TableCell): ParsedCell {
    const display = toString(tableCell);
    const links = tableCell.children
      .filter((node) => node.type === "link" || node.type === "wikiLink")
      .filter((node) => !("url" in node) || !isExternalLink(node.url))
      .map((link) => mdastLinkToDvLink(dv, link));
    return {
      ...(display.length > 0 && { display }),
      links,
    };
  }

  private getCaption(parent: Parent | null, index: number | null): string | undefined {
    let caption: string | undefined;
    if (parent && typeof index === "number") {
      const next = parent.children[index + 1];
      if (isParagraph(next)) {
        const paragraphText = toString(next);
        if (paragraphText.startsWith("^")) {
          caption = paragraphText.slice(1).trim();
        }
      }
    }
    return caption;
  }

  private walk(
    node: Node,
    callback: (node: Node, parent: null | Parent, index: null | number) => void,
    parent: null | Parent = null,
    index: null | number = null,
  ): void {
    callback(node, parent, index);
    if (isParent(node)) {
      node.children.forEach((child, i) => {
        this.walk(child, callback, node, i);
      });
    }
  }
}
