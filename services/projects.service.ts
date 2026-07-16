import type { Project } from "./types";
import projectsFallback from "../data/projects.json";
import { apiUrl, fetchJson, fetchJsonWithFallback } from "./api";

const PROJECTS_PATH = "/api/projects";

/**
 * Fetches all projects.
 */
export async function getProjects(): Promise<Project[]> {
  return fetchJsonWithFallback<Project[]>(apiUrl(PROJECTS_PATH), projectsFallback, {
    fallbackLabel: "projects",
  });
}

/**
 * Creates a new project.
 */
export async function createProject(
  data: Omit<Project, "id">,
): Promise<Project> {
  return fetchJson<Project>(apiUrl(PROJECTS_PATH), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing project.
 */
export async function updateProject(data: Project): Promise<Project> {
  return fetchJson<Project>(apiUrl(PROJECTS_PATH), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a project by id.
 */
export async function deleteProject(id: string): Promise<void> {
  await fetchJson<unknown>(
    `${apiUrl(PROJECTS_PATH)}?id=${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}
