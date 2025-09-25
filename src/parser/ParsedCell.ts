import { type Link } from "obsidian-dataview";

export interface ParsedCell {
  display?: string;
  links: Link[];
}
