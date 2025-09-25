export class ExternalLinkMappingError extends Error {
  public constructor(path: string) {
    super(`External link can not be mapped into a Dataview link: ${path}`);
    this.name = "ExternalLinkMappingError";
  }
}
