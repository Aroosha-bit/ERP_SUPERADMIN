import axios from "axios";

type BackendError = {
  message?: string;
  errorMessage?: string;
  isError?: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<BackendError>(error)) {
    const data = error.response?.data;

    const message =
      data?.errorMessage ||
      data?.message ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : !error.response
          ? "Network error. Please check your connection or API configuration."
          : "Something went wrong. Please try again.");

    return new ApiError(message, error.response?.status);
  }

  return new ApiError(
    error instanceof Error ? error.message : "Something went wrong.",
  );
}
