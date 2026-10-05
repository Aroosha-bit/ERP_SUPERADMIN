export interface ApiError {
  status?: number;
  message: string;
}

const DEFAULT_API_ERROR_MESSAGE =
  "Something went wrong. Please try again.";

export function getApiErrorMessage(status?: number): string {
  switch (status) {
    case 400:
      return "The request could not be processed. Please check your information.";

    case 401:
      return "Your session has expired. Please sign in again.";

    case 403:
      return "You do not have permission to perform this action.";

    case 404:
      return "The requested resource could not be found.";

    case 409:
      return "This request conflicts with existing data.";

    case 422:
      return "Some of the provided information is invalid.";

    case 500:
      return "A server error occurred. Please try again later.";

    case 502:
    case 503:
    case 504:
      return "The service is temporarily unavailable. Please try again later.";

    default:
      return DEFAULT_API_ERROR_MESSAGE;
  }
}

export function createApiError(status?: number): ApiError {
  return {
    status,
    message: getApiErrorMessage(status),
  };
}