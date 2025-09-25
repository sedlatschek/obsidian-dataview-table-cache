import type {
  Node,
  Paragraph,
  Parent,
  Table,
} from "mdast";

function isNode(value: unknown): value is Node {
  return typeof value === "object" && value !== null && "type" in value;
}

export function isParent(node: Node | null | undefined): node is Parent {
  return isNode(node) && Array.isArray((node as Parent).children);
}

export function isParagraph(node: Node | null | undefined): node is Paragraph {
  return isNode(node) && node.type === "paragraph";
}

export function isTable(node: Node | null | undefined): node is Table {
  return isNode(node) && node.type === "table";
}
