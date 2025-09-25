import type {
  Paragraph,
  PhrasingContent,
  TableCell,
} from "mdast";

export function toString(phrasingContent: PhrasingContent | TableCell | Paragraph): string {
  switch (phrasingContent.type) {
    case "break":
      return "\n";
    // TODO: case "highlight":
    case "delete":
    case "emphasis":
    case "paragraph":
    case "strong":
    case "tableCell":
      return phrasingContent.children.map(toString).join("");
    case "footnoteReference":
      return `[${phrasingContent.label ?? phrasingContent.identifier}]`;
    case "image":
      return `[${phrasingContent.title ?? phrasingContent.alt ?? phrasingContent.url}]`;
    case "imageReference":
      return phrasingContent.label ?? phrasingContent.alt ?? phrasingContent.identifier;
    case "link":
      if (phrasingContent.title) {
        return phrasingContent.title;
      }
      if (phrasingContent.children.length > 0) {
        return phrasingContent.children.map(toString).join("");
      }
      return phrasingContent.url;
    case "linkReference":
      return phrasingContent.label ?? phrasingContent.identifier;
    case "html":
    case "inlineCode":
    case "text":
      return phrasingContent.value;
    case "wikiLink":
      return phrasingContent.data.alias.replace("#", " > ");
  }
}
