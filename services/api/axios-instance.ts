import axios from "axios";
import { clearSession, getAccessToken } from "@/lib/auth/token-store";
import { ApiError, getApiError } from "./api-error";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
});

export const apiWithBearerToken = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
});

apiWithBearerToken.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (!token) {
    clearSession();
    return Promise.reject(
      new ApiError("Your session has expired. Please log in.", 401),
    );
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

const handleError = (error: unknown) => {
  const apiError = getApiError(error);

  if (apiError.status === 401) {
    // Only invalidate the session if a protected API fails.
    // Invalid login credentials must not trigger a logout redirect.
  }

  return Promise.reject(apiError);
};

api.interceptors.response.use((response) => response, handleError);

apiWithBearerToken.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = getApiError(error);

    if (apiError.status === 401) {
      clearSession();
    }

    return Promise.reject(apiError);
  },
);
