import type { Project } from "./types";

const API_BASE = "/api/projects";

/**
 * Fetches all projects.
 */
export async function getProjects(): Promise<Project[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}

/**
 * Creates a new project.
 */
export async function createProject(
  data: Omit<Project, "id">,
): Promise<Project> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to create project",
    );
  }

  return response.json();
}

/**
 * Updates an existing project.
 */
export async function updateProject(data: Project): Promise<Project> {
  const response = await fetch(API_BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to update project",
    );
  }

  return response.json();
}

/**
 * Deletes a project by id.
 */
export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to delete project",
    );
  }
}
