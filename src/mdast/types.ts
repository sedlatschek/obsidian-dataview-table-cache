import type {
  Break,
  Code,
  Delete,
  Emphasis,
  FootnoteReference,
  Html,
  Image,
  ImageReference,
  InlineCode,
  Link,
  LinkReference,
  Node,
  Paragraph,
  Parent,
  Strong,
  Table,
  Text,
} from "mdast";

function isNode(value: unknown): value is Node {
  return typeof value === "object" && value !== null && "type" in value;
}

export function isBreak(node: Node | null | undefined): node is Break {
  return isNode(node) && node.type === "break";
}

export function isCode(node: Node | null | undefined): node is Code {
  return isNode(node) && [
    "code",
    "inlineCode",
  ].includes(node.type);
}

export function isDelete(node: Node | null | undefined): node is Delete {
  return isNode(node) && node.type === "delete";
}

export function isEmphasis(node: Node | null | undefined): node is Emphasis {
  return isNode(node) && node.type === "emphasis";
}

export function isFootnoteReference(node: Node | null | undefined): node is FootnoteReference {
  return isNode(node) && node.type === "footnoteReference";
}

export function isHtml(node: Node | null | undefined): node is Html {
  return isNode(node) && node.type === "html";
}

export function isImage(node: Node | null | undefined): node is Image {
  return isNode(node) && node.type === "image";
}

export function isImageReference(node: Node | null | undefined): node is ImageReference {
  return isNode(node) && node.type === "imageReference";
}

export function isInlineCode(node: Node | null | undefined): node is InlineCode {
  return isNode(node) && node.type === "inlineCode";
}

export function isLink(node: Node | null | undefined): node is Link {
  return isNode(node) && node.type === "link";
}

export function isLinkReference(node: Node | null | undefined): node is LinkReference {
  return isNode(node) && node.type === "linkReference";
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

export function isStrong(node: Node | null | undefined): node is Strong {
  return isNode(node) && node.type === "strong";
}

export function isText(node: Node | null | undefined): node is Text {
  return isNode(node) && node.type === "text";
}
