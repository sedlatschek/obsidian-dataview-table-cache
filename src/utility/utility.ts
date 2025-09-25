const EXTERNAL_LINK_REGEX = /^(https?:|mailto:|ftp:|obsidian:)/i;

export function isExternalLink(path: string): boolean {
  return EXTERNAL_LINK_REGEX.test(path);
}
