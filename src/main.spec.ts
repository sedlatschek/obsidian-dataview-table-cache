import { App } from "obsidian";
import { describe, expect, it } from "vitest";

describe("main", () => {
  it("works with obsidian app", () => {
    const app = new App();
    expect(app).to.not.be.undefined;
  });
});
