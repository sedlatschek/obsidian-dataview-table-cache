export class InvalidQueryFormatError extends Error {
  public constructor(query: string) {
    super(`Invalid query format: ${query}`);
    this.name = "InvalidQueryFormatError";
  }
}
