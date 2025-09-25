export class NonSMarkdownPageError extends Error {
  public constructor() {
    super("Provided page is not a SMarkdownPage");
    this.name = "NonSMarkdownPageError";
  }
}
