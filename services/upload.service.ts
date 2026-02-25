import { apiUrl, fetchJson, getApiBaseUrl, resolveApiAssetUrl } from "./api";

const UPLOAD_PATH = "/api/upload";

const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export interface UploadResponse {
  path: string;
  success: true;
}

/**
 * Validates that the file is an allowed image type before upload.
 */
export function isAllowedImageType(file: File): boolean {
  return ALLOWED_IMAGE_MIMES.includes(
    file.type as (typeof ALLOWED_IMAGE_MIMES)[number],
  );
}

/**
 * Uploads an image via POST /api/upload (multipart/form-data, field: file).
 * Returns the path from the response (relative or absolute); use resolveApiAssetUrl for display if needed.
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
  if (!isAllowedImageType(file)) {
    throw new Error("Only image files are allowed (JPEG, PNG, WebP, GIF)");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(apiUrl(UPLOAD_PATH), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof (body as { error?: string }).error === "string"
        ? (body as { error: string }).error
        : "Upload failed";
    throw new Error(message);
  }

  const data = (await response.json()) as UploadResponse;
  if (typeof data?.path !== "string") {
    throw new Error("Invalid upload response");
  }
  return data;
}

/**
 * Resolve upload path for display (handles relative and absolute URLs).
 */
export function resolveUploadUrl(path: string): string {
  return resolveApiAssetUrl(path, getApiBaseUrl());
}
