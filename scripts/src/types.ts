export type ModrinthIndex = {
  name: string;
  versionId: string;
  game: "minecraft";
  formatVersion: number;
  dependencies: { [key: string]: string };
  files: ModrinthIndexFile[];
};

export type ModrinthIndexFile = {
  downloads: string[];
  env: {
    client: "required" | "optional" | "unsupported";
    server: "required" | "optional" | "unsupported";
  };
  fileSize: number;
  hashes: {
    sha1: string;
    sha256: string;
  };
};

export type ModListMod = {
  source: "modrinth" | "github";
  name: string;
  env?: ModrinthIndexFile["env"];
  url: string;

  version: string;
  fileName: string;
};
