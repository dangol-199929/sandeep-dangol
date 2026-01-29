import type { Experience } from "./types";

const API_BASE = "/api/experiences";

/**
 * Fetches all experience entries.
 */
export async function getExperiences(): Promise<Experience[]> {
  const response = await fetch(API_BASE);
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
  const response = await fetch(API_BASE, {
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
  const response = await fetch(API_BASE, {
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
  const response = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to delete experience",
    );
  }
}
