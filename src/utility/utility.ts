const EXTERNAL_LINK_REGEX = /^(https?:|mailto:|ftp:|obsidian:)/i;

export function isExternalLink(path: string): boolean {
  return EXTERNAL_LINK_REGEX.test(path);
}

export function addExtensionIfMissing(path: string, extension: string): string {
  if (path.endsWith(`.${extension}`)) {
    return path;
  }
  return `${path}.${extension}`;
}
