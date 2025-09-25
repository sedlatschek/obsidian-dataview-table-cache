import {
  describe,
  expect,
  it,
} from "vitest";
import { Table } from "./Table";

describe(Table.name, () => {
  describe("identifier", () => {
    it("uses index if no caption is available", () => {
      const table = new Table({
        path: "test.md",
        index: 12,
        headers: [],
        rows: [],
      });
      expect(table.identifier).to.equal("test.md::12");
    });

    it("uses caption if caption is available", () => {
      const table = new Table({
        path: "test.md",
        index: 12,
        headers: [],
        rows: [],
        caption: "myTable",
      });
      expect(table.identifier).to.equal("test.md::myTable");
    });
  });
});
