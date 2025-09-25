import type {
  Paragraph,
  PhrasingContent,
  TableCell,
} from "mdast";

export function toString(phrasingContent: PhrasingContent | TableCell | Paragraph): string {
  switch (phrasingContent.type) {
    case "break":
      return "\n";
    case "delete":
    case "emphasis":
    case "paragraph":
    case "strong":
    case "tableCell":
      return phrasingContent.children.map(toString).join("");
    case "footnoteReference":
      return phrasingContent.label ?? "XXX";
    case "image":
      return phrasingContent.title ?? "XXX";
    case "imageReference":
      return phrasingContent.label ?? "XXX";
    case "link":
      if (phrasingContent.children.length > 0) {
        return phrasingContent.children.map(toString).join("");
      }
      return phrasingContent.title ?? phrasingContent.url;
    case "linkReference":
      return phrasingContent.label ?? "XXX";
    case "html":
    case "inlineCode":
    case "text":
    case "wikiLink":
      return phrasingContent.value;
  }
}
