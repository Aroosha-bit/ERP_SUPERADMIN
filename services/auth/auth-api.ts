import { api } from "@/services/api/axios-instance";
import { ApiError, getApiError } from "@/services/api/api-error";

import type {
  AuthSession,
  BackendLoginBody,
  BackendResponse,
  LoginPayload,
} from "@/lib/auth/auth-types";

const LOGIN_PATH = "/api/auth/login";

export async function loginUser(payload: LoginPayload): Promise<AuthSession> {
  try {
    const response = await api.post<BackendResponse<BackendLoginBody>>(
      LOGIN_PATH,
      payload,
    );

    const result = response.data;

    if (result.isError) {
      throw new ApiError(
        result.errorMessage || result.message || "Login failed.",
      );
    }

    const body = result.body;

    if (!body || !body.token || !body.expiresOn || !body.userId) {
      throw new ApiError("Invalid login response from server.");
    }

    if (
      !Number.isFinite(Date.parse(body.expiresOn)) ||
      Date.parse(body.expiresOn) <= Date.now()
    ) {
      throw new ApiError("The server returned an expired token.");
    }

    return {
      token: body.token,
      expiresOn: body.expiresOn,
      user: {
        userId: body.userId,
        tenantId: body.tenantId ?? null,
        legalEntityId: body.legalEntityId ?? null,
        userName: body.userName,
        name: body.name,
        email: body.email,
        mustChangePassword: body.mustChangePassword,
        roles: body.roles ?? [],
        permissions: body.permissions ?? [],
      },
    };
  } catch (error) {
    throw getApiError(error);
  }
}
