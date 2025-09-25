import type { Link } from "mdast";
import {
  describe, expect,
  it,
} from "vitest";
import { toString } from "./content";

describe("mdast/content", () => {
  describe("toString", () => {
    describe("link", () => {
      it("returns title if provided", () => {
        // [Example](https://example.org) => Example
        const link: Link = {
          type: "link",
          title: "title",
          url: "https://example.org",
          children: [
            {
              type: "text",
              value: "Example",
            },
          ],
        };
        const result = toString(link);
        expect(result).to.equal("title");
      });

      it("returns text if no title is provided", () => {
        // [](https://example.org "Example") => Example
        const link: Link = {
          type: "link",
          title: undefined,
          url: "https://example.org",
          children: [
            {
              type: "text",
              value: "Example",
            },
          ],
        };
        const result = toString(link);
        expect(result).to.equal("Example");
      });

      it("returns url if no title and no text is provided", () => {
        // [](https://example.org) => https://example.org
        const link: Link = {
          type: "link",
          title: null,
          url: "https://example.org",
          children: [],
        };
        const result = toString(link);
        expect(result).to.equal("https://example.org");
      });
    });
  });
});
