const BASE_URL = "https://api.modrinth.com/v2/";

export type ModrinthGetProjectResponse = {
  title: string;
  slug: string;
  client_side: "required" | "optional" | "unsupported";
  server_side: "required" | "optional" | "unsupported";
};

export async function getProject(
  id: string,
): Promise<ModrinthGetProjectResponse> {
  const res = await fetch(new URL(`project/${id}`, BASE_URL));
  if (res.status != 200) {
    console.error(`Failed to fetch project ${id}! ${res.status}`);
    throw "Failed to fetch";
  }
  return JSON.parse(await res.text());
}
