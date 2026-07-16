/**
 * API base URL from environment. Used by all services that call the backend.
 * Set NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:8080) for an external API;
 * leave unset or empty for same-origin (default).
 */
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/**
 * Returns the API base URL (origin). Empty string when same-origin.
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Returns the full URL for an API path. Path should start with / (e.g. /api/experiences).
 * When NEXT_PUBLIC_API_URL is set, prepends it; otherwise returns the path for same-origin.
 */
export function apiUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return path.startsWith("/")
    ? `${API_BASE_URL}${path}`
    : `${API_BASE_URL}/${path}`;
}

/** Standard API error response shape */
export interface ApiErrorBody {
  error: string;
}

const DEFAULT_TIMEOUT_MS = 30_000;

export interface FetchJsonOptions extends RequestInit {
  /** Request timeout in ms. Default 30000. */
  timeoutMs?: number;
  /** AbortSignal to cancel the request. */
  signal?: AbortSignal;
}

/**
 * Fetch JSON with robust error parsing. Backend errors use { error: string }.
 * Supports timeout and AbortSignal.
 */
export async function fetchJson<T>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal: externalSignal,
    ...init
  } = options;

  const controller = new AbortController();
  const timeoutId = timeoutMs
    ? setTimeout(() => controller.abort(), timeoutMs)
    : undefined;
  const signal = externalSignal ?? controller.signal;

  try {
    const response = await fetch(url, { ...init, signal });

    const text = await response.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      throw new Error(
        response.ok
          ? "Invalid JSON response"
          : response.statusText || "Request failed",
      );
    }

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as ApiErrorBody).error === "string"
          ? (data as ApiErrorBody).error
          : response.statusText || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data as T;
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "AbortError") throw new Error("Request timed out");
      throw err;
    }
    throw new Error("Request failed");
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export interface FetchJsonWithFallbackOptions extends FetchJsonOptions {
  /**
   * Human-readable label included in console warnings when fallback data is used.
   */
  fallbackLabel?: string;
}

/**
 * Fetch JSON from the API and fall back to local data when the request fails.
 * This is intended for read-only content so the public site can still render
 * when the API server is unavailable.
 */
export async function fetchJsonWithFallback<T>(
  url: string,
  fallbackData: T,
  options: FetchJsonWithFallbackOptions = {},
): Promise<T> {
  const { fallbackLabel, ...fetchOptions } = options;

  try {
    return await fetchJson<T>(url, fetchOptions);
  } catch (error) {
    const label = fallbackLabel ?? url;
    const message =
      error instanceof Error ? error.message : "Unknown request failure";
    console.warn(
      `[services] Falling back to local data for ${label}: ${message}`,
    );
    return fallbackData;
  }
}

/**
 * Resolve an asset path for display. Use for upload/resume paths that may be
 * relative (e.g. /uploads/foo.png) or absolute (e.g. https://api.example.com/uploads/foo.png).
 * - If pathOrUrl starts with http:// or https://, returns as-is.
 * - If pathOrUrl starts with /, prefixes with apiBaseUrl when set (for cross-origin API).
 */
export function resolveApiAssetUrl(
  pathOrUrl: string,
  apiBaseUrl: string,
): string {
  if (!pathOrUrl) return pathOrUrl;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  if (pathOrUrl.startsWith("/") && apiBaseUrl) {
    return `${apiBaseUrl.replace(/\/$/, "")}${pathOrUrl}`;
  }
  return pathOrUrl;
}
