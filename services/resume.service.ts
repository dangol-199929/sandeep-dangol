import type { ResumeResponse } from "./types";

const API_BASE = "/api/resume";

/**
 * Fetches the current resume path from settings.
 */
export async function getResumePath(): Promise<string> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error("Failed to fetch resume path");
  }
  const data: ResumeResponse = await response.json();
  return data.resumePath ?? "/resume/Resume.pdf";
}

/**
 * Uploads a new resume PDF and updates settings.
 */
export async function uploadResume(file: File): Promise<ResumeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_BASE, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to upload resume",
    );
  }

  return response.json();
}
