import type { Experience } from "./types";
import { apiUrl } from "./api";

const EXPERIENCES_PATH = "/api/experiences";

/**
 * Fetches all experience entries.
 */
export async function getExperiences(): Promise<Experience[]> {
  const response = await fetch(apiUrl(EXPERIENCES_PATH));
  if (!response.ok) {
    throw new Error("Failed to fetch experiences");
  }
  return response.json();
}

/**
 * Creates a new experience entry.
 */
export async function createExperience(
  data: Omit<Experience, "id">,
): Promise<Experience> {
  const response = await fetch(apiUrl(EXPERIENCES_PATH), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to create experience",
    );
  }

  return response.json();
}

/**
 * Updates an existing experience entry.
 */
export async function updateExperience(data: Experience): Promise<Experience> {
  const response = await fetch(apiUrl(EXPERIENCES_PATH), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to update experience",
    );
  }

  return response.json();
}

/**
 * Deletes an experience entry by id.
 */
export async function deleteExperience(id: string): Promise<void> {
  const response = await fetch(
    `${apiUrl(EXPERIENCES_PATH)}?id=${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to delete experience",
    );
  }
}
