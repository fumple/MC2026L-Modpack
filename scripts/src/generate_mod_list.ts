import { readFile } from "fs/promises";
import type { ModListMod, ModrinthIndex } from "./types";
import { getProject } from "./modrinth_api";

const ModrinthURLPattern =
  "https://cdn.modrinth.com/data/([^/]+)/versions/([^/]+)/([^/]+)";
const GithubURLPattern =
  "https://github.com/([^/]+)/([^/]+)/releases/download/([^/]+)/([^/]+)";

if (process.argv.length < 3) {
  console.error("Not enough arguments given!");
  process.exit(1);
}
const indexPath = process.argv[2]!;
console.error("Loading index from:", indexPath);
const indexContent = await readFile(indexPath);
const index = JSON.parse(indexContent.toString("utf8")) as ModrinthIndex;

const mods: ModListMod[] = [];
let failedCount = 0;

console.error("Loaded index of modpack", index.name);
for (var file of index.files) {
  if (file.downloads.length != 1) {
    console.error("Found mod with unexpected number of download links!");
  }
  const downloadUrl = file.downloads[0]!;
  const modrinthUrlMatch = downloadUrl.match(ModrinthURLPattern);
  const githubUrlMatch = downloadUrl.match(GithubURLPattern);
  if (modrinthUrlMatch != null) {
    const modId = modrinthUrlMatch[1]!;
    const version = modrinthUrlMatch[2]!;
    const fileName = modrinthUrlMatch[3]!;

    try {
      const modDetails = await getProject(modId);
      mods.push({
        source: "modrinth",
        name: modDetails.title,
        env: {
          client: modDetails.client_side,
          server: modDetails.server_side,
        },
        url: `https://modrinth.com/mod/${modDetails.slug}`,
        version,
        fileName,
      });
    } catch (e) {
      failedCount++;
    }
  } else if (githubUrlMatch != null) {
    const owner = githubUrlMatch[1]!;
    const repo = githubUrlMatch[2]!;
    const version = githubUrlMatch[3]!;
    const fileName = githubUrlMatch[4]!;

    mods.push({
      source: "github",
      name: `${owner}/${repo}`,
      url: `https://github.com/${owner}/${repo}`,
      version,
      fileName,
    });
  } else {
    console.error("Encountered mod with unexpected download URL!");
    failedCount++;
  }
}

console.log(JSON.stringify(mods));
