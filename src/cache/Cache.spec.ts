import {
  describe,
  expect,
  it,
} from "vitest";
import { Table } from "../table/Table";
import type { ICache } from "./Cache";
import { MemoryCache } from "./MemoryCache";

describe("Cache", () => {
  const tables = [
    new Table({
      path: "test",
      index: 0,
      headers: [
        {
          isHeader: true, rowIndex: 0, columnIndex: 0, links: [], display: "Header",
        },
      ],
      rows: [
        [
          {
            isHeader: false, rowIndex: 0, columnIndex: 0, links: [], display: "Cell",
          },
        ],
      ],
      alignment: [null],
      caption: "test-table",
    }),
    new Table({
      path: "test",
      index: 1,
      headers: [
        {
          isHeader: true, rowIndex: 0, columnIndex: 0, links: [], display: "Header",
        },
      ],
      rows: [
        [
          {
            isHeader: false, rowIndex: 0, columnIndex: 0, links: [], display: "Cell",
          },
        ],
      ],
      alignment: [null],
    }),
    new Table({
      path: "test2",
      index: 0,
      headers: [
        {
          isHeader: true, rowIndex: 0, columnIndex: 0, links: [], display: "Header",
        },
      ],
      rows: [
        [
          {
            isHeader: false, rowIndex: 0, columnIndex: 0, links: [], display: "Cell",
          },
        ],
      ],
      alignment: [null],
    }),
  ];

  const caches: Record<string, () => ICache> = { [MemoryCache.name]: () => new MemoryCache() };
  for (const [
    name,
    createCache,
  ] of Object.entries(caches)) {
    describe(name, () => {
      describe(MemoryCache.prototype.all.name, () => {
        it("returns all tables in the cache", () => {
          const cache = createCache();
          cache.set(tables);
          const result = cache.all();
          expect(result).to.deep.equal(tables);
        });
      });

      describe(MemoryCache.prototype.clear.name, () => {
        it("clears all tables from the cache", () => {
          const cache = createCache();
          cache.set(tables);
          cache.clear();
          const result1 = cache.getTables("test");
          const result2 = cache.getTables("test2");
          expect(result1).to.deep.equal([]);
          expect(result2).to.deep.equal([]);
        });
      });

      describe(MemoryCache.prototype.getTables.name, () => {
        it("returns the tables that were previously set", () => {
          const cache = createCache();
          cache.set(tables);
          const result = cache.getTables("test");
          expect(result).to.deep.equal([
            tables[0],
            tables[1],
          ]);
        });

        it("returns an empty array if no tables are found", () => {
          const cache = createCache();
          const result = cache.getTables("non-existent-path");
          expect(result).to.deep.equal([]);
        });
      });

      describe(MemoryCache.prototype.getTable.name, () => {
        it("returns a table by identifier", () => {
          const cache = createCache();
          cache.set(tables);
          const result = cache.getTable("test::test-table");
          expect(result).to.deep.equal(tables[0]);
        });

        it("returns a table by index", () => {
          const cache = createCache();
          cache.set(tables);
          const result = cache.getTable("test::1");
          expect(result).to.deep.equal(tables[1]);
        });

        it("returns undefined if the table is not found", () => {
          const cache = createCache();
          const result = cache.getTable("test::non-existent-identifier");
          expect(result).to.equal(undefined);
        });
      });

      describe(MemoryCache.prototype.deleteTable.name, () => {
        it("deletes a table by identifier", () => {
          const cache = createCache();
          cache.set(tables);
          cache.deleteTable("test::test-table");
          const result = cache.getTables("test");
          expect(result).to.deep.equal([tables[1]]);
        });

        it("deletes a table by index", () => {
          const cache = createCache();
          cache.set(tables);
          cache.deleteTable("test::1");
          const result = cache.getTables("test");
          expect(result).to.deep.equal([tables[0]]);
        });
      });

      describe(MemoryCache.prototype.deleteTables.name, () => {
        it("deletes all tables for a given path", () => {
          const cache = createCache();
          cache.set(tables);
          cache.deleteTables("test");
          const result = cache.getTables("test");
          expect(result).to.deep.equal([]);
          const remaining = cache.getTables("test2");
          expect(remaining).to.deep.equal([tables[2]]);
        });
      });
    });
  }
});
