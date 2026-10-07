import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { errors } from "jose";

import { AUTH_CONFIG } from "@/lib/auth/auth-config";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth/jwt";
import {
  findMockUserById,
  toAuthUser,
} from "@/lib/auth/mock-users";

function clearRefreshCookie(response: NextResponse) {
  response.cookies.set(AUTH_CONFIG.refreshTokenCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get(
      AUTH_CONFIG.refreshTokenCookieName
    )?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is missing.",
          code: "REFRESH_TOKEN_MISSING",
        },
        { status: 401 }
      );
    }

    let payload: Awaited<ReturnType<typeof verifyRefreshToken>>;

    try {
      payload = await verifyRefreshToken(refreshToken);
    } catch (error) {
      const expired = error instanceof errors.JWTExpired;

      const response = NextResponse.json(
        {
          success: false,
          message: expired
            ? "Refresh token has expired."
            : "Refresh token is invalid.",
          code: expired
            ? "REFRESH_TOKEN_EXPIRED"
            : "REFRESH_TOKEN_INVALID",
        },
        { status: 401 }
      );

      return clearRefreshCookie(response);
    }

    const mockUser = findMockUserById(payload.sub);

    if (!mockUser) {
      const response = NextResponse.json(
        {
          success: false,
          message: "User no longer exists.",
          code: "USER_NOT_FOUND",
        },
        { status: 401 }
      );

      return clearRefreshCookie(response);
    }

    const user = toAuthUser(mockUser);

    const accessToken = await createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      permissions: user.permissions,
    });

    // Mock refresh-token rotation:
    // Every successful refresh issues a new refresh JWT with a new JTI.
    const newRefreshToken = await createRefreshToken({
      sub: user.id,
      jti: crypto.randomUUID(),
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully.",
        accessToken,
        user,
      },
      { status: 200 }
    );

    response.cookies.set(
      AUTH_CONFIG.refreshTokenCookieName,
      newRefreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: AUTH_CONFIG.refreshTokenExpiresInSeconds,
      }
    );

    return response;
  } catch (error) {
    console.error("Mock refresh error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to refresh authentication.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}