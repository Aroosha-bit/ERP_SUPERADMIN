export type ApiMode = "mock" | "backend";

export const API_MODE: ApiMode =
  process.env.NEXT_PUBLIC_API_MODE === "backend" ? "backend" : "mock";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (API_MODE === "mock" ? "http://localhost:3001" : "");

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}${normalizedPath}`
    : normalizedPath;
}
