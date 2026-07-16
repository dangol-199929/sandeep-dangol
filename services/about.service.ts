import type { About } from "./types";
import aboutFallback from "../data/about.json";
import { apiUrl, fetchJson, fetchJsonWithFallback } from "./api";

const ABOUT_PATH = "/api/about";

function ensureBioArray(bio: unknown): string[] {
  if (Array.isArray(bio)) {
    return bio.every((x) => typeof x === "string") ? bio : [String(bio)];
  }
  if (typeof bio === "string") return [bio];
  return [];
}

/**
 * Normalize API response to About shape (ensure bio is string[]).
 */
function normalizeAbout(data: unknown): About {
  const o = data as Record<string, unknown>;
  return {
    name: typeof o?.name === "string" ? o.name : "",
    email: typeof o?.email === "string" ? o.email : "",
    education: typeof o?.education === "string" ? o.education : "",
    availability: typeof o?.availability === "string" ? o.availability : "",
    bio: ensureBioArray(o?.bio),
    image: typeof o?.image === "string" ? o.image : "",
  };
}

/**
 * Fetches about content from GET /api/about.
 */
export async function getAbout(): Promise<About> {
  const data = await fetchJsonWithFallback<unknown>(
    apiUrl(ABOUT_PATH),
    aboutFallback,
    { fallbackLabel: "about" },
  );
  return normalizeAbout(data);
}

/**
 * Updates about content via PUT /api/about. Partial body allowed.
 */
export async function updateAbout(partial: Partial<About>): Promise<About> {
  const payload =
    partial.bio !== undefined
      ? { ...partial, bio: ensureBioArray(partial.bio) }
      : partial;
  const data = await fetchJson<unknown>(apiUrl(ABOUT_PATH), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeAbout(data);
}
