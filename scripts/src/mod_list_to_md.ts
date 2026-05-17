import { readFile } from "fs/promises";
import type { ModListMod } from "./types";

if (process.argv.length < 3) {
  console.error("Not enough arguments given!");
  process.exit(1);
}
const modListPath = process.argv[2]!;
console.error("Loading index from:", modListPath);
const modListContent = await readFile(modListPath);
const modList = JSON.parse(modListContent.toString("utf8")) as ModListMod[];

modList.sort((a, b) => a.name.localeCompare(b.name));

console.log(
  modList
    .map((mod) => `- [${mod.name.replaceAll("-", "\\-")}](${mod.url})`)
    .join("\n"),
);
