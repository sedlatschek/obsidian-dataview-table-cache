import type {
  DataviewApi, Link,
} from "obsidian-dataview";
import { vi } from "vitest";

vi.mock("obsidian-dataview", async () => {
  const actual = await vi.importActual<typeof import("obsidian-dataview")>("obsidian-dataview");
  const dv = {
    ...actual,
    getAPI,
  };
  return dv;
});

const getAPI: typeof import("obsidian-dataview").getAPI = () => ({
  io: { normalize: (path: string) => path },
  fileLink,
  sectionLink,
  blockLink,
  page,
} as DataviewApi);

const fileLink: typeof DataviewApi.prototype.fileLink = (path, embed, display): Link => ({
  display,
  embed,
  path,
  subpath: undefined,
  type: "file",
} as Link);

const sectionLink: typeof DataviewApi.prototype.sectionLink = (path, section, embed, display): Link => ({
  display,
  embed,
  path,
  subpath: section,
  type: "header",
} as Link);

const blockLink: typeof DataviewApi.prototype.blockLink = (path, block, embed, display): Link => ({
  display,
  embed,
  path,
  subpath: block,
  type: "block",
} as Link);

const page: typeof DataviewApi.prototype.page = (path: string): { file: { path: string } } => {
  if (path === "Omega 3") {
    return { file: { path: "ingredients/Omega 3.md" } };
  }
  if (path === "Vitamin E") {
    return { file: { path: "ingredients/Vitamin E.md" } };
  }
  if (path === "ProFuel OMEGA-3 Forte") {
    return { file: { path: "consumables/ProFuel OMEGA-3 Forte.md" } };
  }
  throw new Error(`Page not found: ${path}`);
};
