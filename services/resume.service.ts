import type { ResumeResponse } from "./types";
import settingsFallback from "../data/settings.json";
import {
  apiUrl,
  fetchJson,
  fetchJsonWithFallback,
  fetchJsonWithFallbackResult,
  getApiBaseUrl,
  resolveApiAssetUrl,
} from "./api";

const RESUME_PATH = "/api/resume";
export const DEFAULT_RESUME_PATH = "/resume/Resume.pdf";

/**
 * Fetches the current resume path from GET /api/resume.
 * Returns a URL suitable for use in href (resolves relative path when API is cross-origin).
 */
export async function getResumePath(): Promise<string> {
  const { data, usedFallback } = await fetchJsonWithFallbackResult<ResumeResponse>(
    apiUrl(RESUME_PATH),
    settingsFallback,
    { fallbackLabel: "resume settings" },
  );
  const path = data.resumePath ?? DEFAULT_RESUME_PATH;
  if (usedFallback) {
    return path;
  }
  return resolveApiAssetUrl(path, getApiBaseUrl());
}

/**
 * Returns the raw resume path from the API (relative or absolute). Use when you need to store or display the path as returned.
 */
export async function getResumePathRaw(): Promise<string> {
  const data = await fetchJsonWithFallback<ResumeResponse>(
    apiUrl(RESUME_PATH),
    settingsFallback,
    { fallbackLabel: "resume settings" },
  );
  return data.resumePath ?? DEFAULT_RESUME_PATH;
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
