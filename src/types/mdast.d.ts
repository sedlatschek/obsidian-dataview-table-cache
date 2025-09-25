import type { Literal } from "mdast";

declare module "mdast" {
  interface WikiLink extends Literal {
    type: "wikiLink";
    value: string;
    data: {
      alias: string;
      [key: string]: unknown;
    };
  }

  interface PhrasingContentMap {
    wikiLink: WikiLink;
  }
}
