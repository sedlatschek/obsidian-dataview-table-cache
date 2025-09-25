export class DataviewNotFoundError extends Error {
  public constructor() {
    super("Dataview plugin not found. Please install and enable the Dataview plugin.");
    this.name = "DataviewNotFoundError";
  }
}
