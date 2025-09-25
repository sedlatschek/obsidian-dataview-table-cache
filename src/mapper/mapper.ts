import type {
  DataviewApi,
  Link as DvLink,
} from "obsidian-dataview";
import type {
  Link as MdastLink,
  WikiLink as MdastWikiLink,
} from "mdast";
import { toString } from "src/mdast/content";
import { ExternalLinkMappingError } from "src/errors/ExternalLinkMappingError";
import { isExternalLink } from "src/utility/utility";

const MARKDOWN_EXTENSION_REGEX = /\.md?$/i;

export function mdastLinkToDvLink(dv: DataviewApi, mdastLink: MdastLink | MdastWikiLink): DvLink {
  if (mdastLink.type === "wikiLink") {
    const {
      value,
      data: { alias },
    } = mdastLink;
    const display = alias || value.replace(MARKDOWN_EXTENSION_REGEX, "");
    return createDvLink(dv, value, display);
  }

  const { url } = mdastLink;
  const display = toString(mdastLink);
  return createDvLink(dv, url, display);
}

function createDvLink(dv: DataviewApi, path: string, display: string): DvLink {
  if (isExternalLink(path)) {
    throw new ExternalLinkMappingError(path);
  }

  const hashIndex = path.indexOf("#");
  const pathFile = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const query = hashIndex === -1 ? undefined : path.slice(hashIndex + 1);

  const normalizedPath = resolvePath(dv, pathFile);
  const normalizedDisplay = display.replace("#", " > ");

  // https://help.obsidian.md/links#Link+to+a+block+in+a+note
  if (query?.startsWith("^")) {
    const blockId = query.slice(1);
    return dv.blockLink(normalizedPath, blockId, false, normalizedDisplay);
  }

  // https://help.obsidian.md/links#Link+to+a+heading+in+a+note
  if (query && query.length > 0) {
    return dv.sectionLink(normalizedPath, query, false, normalizedDisplay);
  }

  // https://help.obsidian.md/links#Link+to+a+file
  return dv.fileLink(normalizedPath, false, normalizedDisplay);
}

function resolvePath(dv: DataviewApi, path: string): string {
  const page = dv.page(decodeURIComponent(path).replace(MARKDOWN_EXTENSION_REGEX, ""));
  return page ? dv.io.normalize(page.file.path) : path;
}
