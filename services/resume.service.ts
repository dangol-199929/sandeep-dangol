import type { ResumeResponse } from "./types";
import { apiUrl, fetchJson, getApiBaseUrl, resolveApiAssetUrl } from "./api";

const RESUME_PATH = "/api/resume";

/**
 * Fetches the current resume path from GET /api/resume.
 * Returns a URL suitable for use in href (resolves relative path when API is cross-origin).
 */
export async function getResumePath(): Promise<string> {
  const data = await fetchJson<ResumeResponse>(apiUrl(RESUME_PATH));
  const path = data.resumePath ?? "/resume/Resume.pdf";
  return resolveApiAssetUrl(path, getApiBaseUrl());
}

/**
 * Returns the raw resume path from the API (relative or absolute). Use when you need to store or display the path as returned.
 */
export async function getResumePathRaw(): Promise<string> {
  const data = await fetchJson<ResumeResponse>(apiUrl(RESUME_PATH));
  return data.resumePath ?? "/resume/Resume.pdf";
}

/**
 * Uploads a new resume PDF via POST /api/resume. Response resumePath may be relative or absolute.
 */
export async function uploadResume(file: File): Promise<ResumeResponse> {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(apiUrl(RESUME_PATH), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof (body as { error?: string }).error === "string"
        ? (body as { error: string }).error
        : "Failed to upload resume";
    throw new Error(message);
  }

  return response.json() as Promise<ResumeResponse>;
}
