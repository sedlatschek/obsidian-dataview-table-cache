import {
  describe,
  expect,
  it,
} from "vitest";
import type { Link } from "obsidian-dataview";
import type { ParsedTable } from "./ParsedTable";
import type { IParser } from "./Parser";
import { RemarkParser } from "./RemarkParser";

describe("Parser", () => {
  const parsers: Record<string, IParser> = { [RemarkParser.name]: new RemarkParser() };
  for (const [
    name,
    parser,
  ] of Object.entries(parsers)) {
    describe(name, () => {
      it("parses alignment", async () => {
        const markdown = `
| Ingredient    | Amount | Unit |
| :------------ | ------ | ---: |
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable> = {
          alignment: [
            "left",
            null,
            "right",
          ],
        };
        expect(tables).to.containSubset([expectation]);
      });

      it("parses caption", async () => {
        const markdown = `
| Ingredient    | Amount | Unit |
| ------------- | ------ | ---- |

^test-table
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable> = { caption: "test-table" };
        expect(tables).to.containSubset([expectation]);
      });

      it("assigns index", async () => {
        const markdown = `
# Multiple Tables

## First Section

| Ingredient    | Amount | Unit |
| ------------- | ------ | ---- |

^first-table

## Second Section

| Ingredient    | Amount | Unit |
| ------------- | ------ | ---- |

^second-table

## Third Section

| Ingredient    | Amount | Unit |
| ------------- | ------ | ---- |

^third-table
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable>[] = [
          {
            index: 0,
            caption: "first-table",
          },
          {
            index: 1,
            caption: "second-table",
          },
          {
            index: 2,
            caption: "third-table",
          },
        ];
        expect(tables).to.containSubset(expectation);
      });

      it("parses headers ", async () => {
        const markdown = `
| Ingredient    | Amount | Unit |
| :------------ | ------ | ---: |
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable> = {
          headers: [
            {
              display: "Ingredient",
              links: [],
            },
            {
              display: "Amount",
              links: [],
            },
            {
              display: "Unit",
              links: [],
            },
          ],
        };
        expect(tables).to.containSubset([expectation]);
      });

      it("parses empty headers", async () => {
        const markdown = `
|               |        |      |
| :------------ | ------ | ---: |
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable> = {
          headers: [
            { links: [] },
            { links: [] },
            { links: [] },
          ],
        };
        expect(tables).to.containSubset([expectation]);
      });

      it("parses rows", async () => {
        const markdown = `
| Ingredient    | Amount | Unit |
| :------------ | ------ | ---: |
| Milk          | 1      | l    |
| Sugar         | 300    | g    |
| Flour         | 400    | g    |
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable> = {
          rows: [
            [
              {
                display: "Milk",
                links: [],
              },
              {
                display: "1",
                links: [],
              },
              {
                display: "l",
                links: [],
              },
            ],
            [
              {
                display: "Sugar",
                links: [],
              },
              {
                display: "300",
                links: [],
              },
              {
                display: "g",
                links: [],
              },
            ],
            [
              {
                display: "Flour",
                links: [],
              },
              {
                display: "400",
                links: [],
              },
              {
                display: "g",
                links: [],
              },
            ],
          ],
        };
        expect(tables).to.containSubset([expectation]);
      });

      it("parses empty rows", async () => {
        const markdown = `
| Ingredient    | Amount | Unit |
| :------------ | ------ | ---: |
|               |        |      |
| Sugar         |        | g    |
|               | 400    |      |
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable> = {
          rows: [
            [
              { links: [] },
              { links: [] },
              { links: [] },
            ],
            [
              {
                display: "Sugar",
                links: [],
              },
              { links: [] },
              {
                display: "g",
                links: [],
              },
            ],
            [
              { links: [] },
              {
                display: "400",
                links: [],
              },
              { links: [] },
            ],
          ],
        };
        expect(tables).to.containSubset([expectation]);
      });

      it("parses caption", async () => {
        const markdown = `
| Ingredient    | Amount | Unit |
| ------------- | ------ | ---- |

^test-table
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Partial<ParsedTable> = { caption: "test-table" };
        expect(tables).to.containSubset([expectation]);
      });

      it("parses links", async () => {
        const markdown = `
| Link                                                                           | WikiLink                              |
| ------------------------------------------------------------------------------ | ------------------------------------- |
| [Omega 3](Omega%203)                                                           | [[Omega 3]]                           |
| [Vitamin E](Vitamin%20E.md)                                                    | [[Vitamin E.md]]                      |
| [ProFuel OMEGA-3 Forte \\> Ingredients](ProFuel%20OMEGA-3%20Forte#Ingredients) | [[ProFuel OMEGA-3 Forte#Ingredients]] |
| [ProFuel OMEGA-3 Forte > \\^asdf](ProFuel%20OMEGA-3%20Forte#^asdf)             | [[ProFuel OMEGA-3 Forte#^asdf]]       |
| [External Link](https://example.org)                                           | external                              |
`;
        const tables = await parser.getTablesFromMarkdown(markdown);
        const expectation: Omit<ParsedTable, "rows"> & { rows: { display?: string; links: Partial<Link> }[][] } = {
          index: 0,
          headers: [
            {
              display: "Link",
              links: [],
            },
            {
              display: "WikiLink",
              links: [],
            },
          ],
          alignment: [
            null,
            null,
          ],
          rows: [
            [
              {
                display: "Omega 3",
                links: [
                  {
                    display: "Omega 3",
                    embed: false,
                    path: "ingredients/Omega 3.md",
                    subpath: undefined,
                    type: "file",
                  },
                ],
              },
              {
                display: "Omega 3",
                links: [
                  {
                    display: "Omega 3",
                    embed: false,
                    path: "ingredients/Omega 3.md",
                    subpath: undefined,
                    type: "file",
                  },
                ],
              },
            ],
            [
              {
                display: "Vitamin E",
                links: [
                  {
                    display: "Vitamin E",
                    embed: false,
                    path: "ingredients/Vitamin E.md",
                    subpath: undefined,
                    type: "file",
                  },
                ],
              },
              {
                display: "Vitamin E.md",
                links: [
                  {
                    embed: false,
                    display: "Vitamin E.md",
                    path: "ingredients/Vitamin E.md",
                    subpath: undefined,
                    type: "file",
                  },
                ],
              },
            ],
            [
              {
                display: "ProFuel OMEGA-3 Forte > Ingredients",
                links: [
                  {
                    path: "consumables/ProFuel OMEGA-3 Forte.md",
                    display: "ProFuel OMEGA-3 Forte > Ingredients",
                    subpath: "Ingredients",
                    embed: false,
                    type: "header",
                  },
                ],
              },
              {
                display: "ProFuel OMEGA-3 Forte#Ingredients",
                links: [
                  {
                    display: "ProFuel OMEGA-3 Forte > Ingredients",
                    path: "consumables/ProFuel OMEGA-3 Forte.md",
                    subpath: "Ingredients",
                    embed: false,
                    type: "header",
                  },
                ],
              },
            ],
            [
              {
                display: "ProFuel OMEGA-3 Forte > ^asdf",
                links: [
                  {
                    display: "ProFuel OMEGA-3 Forte > ^asdf",
                    embed: false,
                    path: "consumables/ProFuel OMEGA-3 Forte.md",
                    subpath: "asdf",
                    type: "block",
                  },
                ],
              },
              {
                display: "ProFuel OMEGA-3 Forte#^asdf",
                links: [
                  {
                    display: "ProFuel OMEGA-3 Forte > ^asdf",
                    embed: false,
                    path: "consumables/ProFuel OMEGA-3 Forte.md",
                    subpath: "asdf",
                    type: "block",
                  },
                ],
              },
            ],
            [
              {
                display: "External Link",
                links: [],
              },
              {
                display: "external",
                links: [],
              },
            ],
          ],
        };
        expect(tables).to.containSubset([expectation]);
      });
    });

    it("ignores other node types", async () => {
      const markdown = `
# Header

## Subheader

Some introductory text.

| Ingredient    | Amount | Unit |
| :------------ | ------ | ---: |
| Milk          | 1      | l    |

> A blockquote that should be ignored.

- A list item that should be ignored.

<a href="https://example.org">An HTML link that should be ignored.</a>

<table>
  <thead>
    <tr>
      <th>Ingredient</th>
      <th>Amount</th>
      <th>Unit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Milk</td>
      <td>1</td>
      <td>l</td>
    </tr>
    <tr>
      <td>Sugar</td>
      <td>300</td>
      <td>g</td>
    </tr>
  </tbody>
</table>

\`\`\`javascript
alert("This is a code block that should be ignored.");
\`\`\`
`;
      const tables = await parser.getTablesFromMarkdown(markdown);
      const expectation: Partial<ParsedTable> = {
        index: 0,
        headers: [
          {
            display: "Ingredient",
            links: [],
          },
          {
            display: "Amount",
            links: [],
          },
          {
            display: "Unit",
            links: [],
          },
        ],
        alignment: [
          "left",
          null,
          "right",
        ],
        rows: [
          [
            {
              display: "Milk",
              links: [],
            },
            {
              display: "1",
              links: [],
            },
            {
              display: "l",
              links: [],
            },
          ],
        ],
      };
      expect(tables).to.containSubset([expectation]);
    });
  }
});
