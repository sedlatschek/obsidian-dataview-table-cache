export class PatchingError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "PatchingError";
  }
}
