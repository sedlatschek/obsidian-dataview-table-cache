import type { App } from "obsidian";
import {
  getAPI,
  type DataviewApi,
} from "obsidian-dataview";
import { DataviewNotFoundError } from "src/errors/DataviewNotFoundError";

export function getDataviewApi(app?: App): DataviewApi {
  const dv = getAPI(app);
  if (!dv) {
    throw new DataviewNotFoundError();
  }
  return dv;
}
