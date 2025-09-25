import {
  describe,
  expect,
  it,
} from "vitest";
import { type Link as DvLink } from "obsidian-dataview";
import type {
  Link as MdastLink,
  WikiLink as MdastWikiLink,
} from "mdast";
import { mdastLinkToDvLink } from "./mapper";
import { getDataviewApi } from "src/dataview/api";

describe("mapper", () => {
  describe(mdastLinkToDvLink.name, () => {
    const dv = getDataviewApi();

    const tests: { name: string; link: MdastLink; wikiLink: MdastWikiLink; expectedDvLink: Partial<DvLink> }[] = [
      {
        name: "file link",
        link: {
          type: "link",
          title: null,
          url: "Omega%203",
          children: [
            {
              type: "text",
              value: "Omega 3",
            },
          ],
        },
        wikiLink: {
          type: "wikiLink",
          value: "Omega 3",
          data: {
            alias: "Omega 3",
            permalink: "omega_3",
            exists: false,
            hName: "a",
            hProperties: {
              className: "internal new",
              href: "#/page/omega_3",
            },
            hChildren: [
              {
                type: "text",
                value: "Omega 3",
              },
            ],
          },
        },
        expectedDvLink: {
          path: "ingredients/Omega 3.md",
          display: "Omega 3",
          embed: false,
          type: "file",
        },
      },
      {
        name: "section link",
        link: {
          type: "link",
          title: null,
          url: "ProFuel%20OMEGA-3%20Forte#Ingredients",
          children: [
            {
              type: "text",
              value: "ProFuel OMEGA-3 Forte > Ingredients",
            },
          ],
        },
        wikiLink: {
          type: "wikiLink",
          value: "ProFuel OMEGA-3 Forte#Ingredients",
          data: {
            alias: "ProFuel OMEGA-3 Forte#Ingredients",
            permalink: "profuel_omega-3_forte#ingredients",
            exists: false,
            hName: "a",
            hProperties: {
              className: "internal new",
              href: "#/page/profuel_omega-3_forte#ingredients",
            },
            hChildren: [
              {
                type: "text",
                value: "ProFuel OMEGA-3 Forte#Ingredients",
              },
            ],
          },
        },
        expectedDvLink: {
          display: "ProFuel OMEGA-3 Forte > Ingredients",
          embed: false,
          path: "consumables/ProFuel OMEGA-3 Forte.md",
          subpath: "Ingredients",
          type: "header",
        },
      },
      {
        name: "block link",
        link: {
          type: "link",
          title: null,
          url: "ProFuel%20OMEGA-3%20Forte#^asdf",
          children: [
            {
              type: "text",
              value: "ProFuel OMEGA-3 Forte > ^asdf",
            },
          ],
        },
        wikiLink: {
          type: "wikiLink",
          value: "ProFuel OMEGA-3 Forte#^asdf",
          data: {
            alias: "ProFuel OMEGA-3 Forte#^asdf",
            permalink: "profuel_omega-3_forte#^asdf",
            exists: false,
            hName: "a",
            hProperties: {
              className: "internal new",
              href: "#/page/profuel_omega-3_forte#^asdf",
            },
            hChildren: [
              {
                type: "text",
                value: "ProFuel OMEGA-3 Forte#^asdf",
              },
            ],
          },
        },
        expectedDvLink: {
          display: "ProFuel OMEGA-3 Forte > ^asdf",
          embed: false,
          path: "consumables/ProFuel OMEGA-3 Forte.md",
          subpath: "asdf",
          type: "block",
        },
      },
    ];

    for (const {
      name,
      link,
      wikiLink,
      expectedDvLink,
    } of tests) {
      it(`maps ${name} to dv link`, () => {
        const dvLink: DvLink = mdastLinkToDvLink(dv, link);
        expect(dvLink).to.containSubset(expectedDvLink);
      });

      it(`maps ${name} wikilink to dv link`, () => {
        const dvLink: DvLink = mdastLinkToDvLink(dv, wikiLink);
        expect(dvLink).to.containSubset(expectedDvLink);
      });
    }

    it("maps file link with extension to dv link without extension", () => {
      const link: MdastLink = {
        type: "link",
        title: null,
        url: "Vitamin%20E.md",
        children: [
          {
            type: "text",
            value: "Vitamin E",
          },
        ],
      };

      const dvLink: DvLink = mdastLinkToDvLink(dv, link);
      expect(dvLink).to.containSubset({
        display: "Vitamin E",
        embed: false,
        path: "ingredients/Vitamin E.md",
        subpath: undefined,
        type: "file",
      });
    });

    it("maps wiki file link with extension to dv link with extension", () => {
      const wikiLink: MdastWikiLink = {
        type: "wikiLink",
        value: "Vitamin E.md",
        data: {
          alias: "Vitamin E.md",
          permalink: "vitamin_e.md",
          exists: false,
          hName: "a",
          hProperties: {
            className: "internal new",
            href: "#/page/vitamin_e.md",
          },
          hChildren: [
            {
              type: "text",
              value: "Vitamin E.md",
            },
          ],
        },
      };
      const dvLink: DvLink = mdastLinkToDvLink(dv, wikiLink);
      expect(dvLink).to.containSubset({
        display: "Vitamin E.md",
        embed: false,
        path: "ingredients/Vitamin E.md",
        subpath: undefined,
        type: "file",
      });
    });

    it("throws error on external link", () => {
      const link: MdastLink = {
        type: "link",
        title: null,
        url: "https://example.org",
        children: [
          {
            type: "text",
            value: "External Link",
          },
        ],
      };
      expect(() => mdastLinkToDvLink(dv, link)).to.throw(/External link can not be mapped into a Dataview link/);
    });
  });
});
