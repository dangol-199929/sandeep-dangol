import type { Experience } from "./types";
import experiencesFallback from "../data/experiences.json";
import { apiUrl, fetchJson, fetchJsonWithFallback } from "./api";

const EXPERIENCES_PATH = "/api/experiences";

function normalizeExperience(
  item: Record<string, unknown> | Partial<Experience>,
): Experience {
  return {
    id: String(item.id ?? ""),
    title: String(item.title ?? ""),
    company: String(item.company ?? ""),
    period: String(item.period ?? ""),
    description: String(item.description ?? ""),
    side: item.side === "left" ? "left" : "right",
  };
}

/**
 * Fetches all experience entries.
 */
export async function getExperiences(): Promise<Experience[]> {
  const data = await fetchJsonWithFallback<Experience[]>(
    apiUrl(EXPERIENCES_PATH),
    experiencesFallback.map(normalizeExperience),
    { fallbackLabel: "experiences" },
  );
  return Array.isArray(data) ? data.map(normalizeExperience) : [];
}

/**
 * Creates a new experience entry.
 */
export async function createExperience(
  data: Omit<Experience, "id">,
): Promise<Experience> {
  return fetchJson<Experience>(apiUrl(EXPERIENCES_PATH), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing experience entry.
 */
export async function updateExperience(data: Experience): Promise<Experience> {
  return fetchJson<Experience>(apiUrl(EXPERIENCES_PATH), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes an experience entry by id.
 */
export async function deleteExperience(id: string): Promise<void> {
  await fetchJson<unknown>(
    `${apiUrl(EXPERIENCES_PATH)}?id=${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}
