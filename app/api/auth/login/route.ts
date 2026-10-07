import { NextResponse } from "next/server";

import { AUTH_CONFIG } from "@/lib/auth/auth-config";
import { findMockUserByCredentials, toAuthUser } from "@/lib/auth/mock-users";
import { createAccessToken, createRefreshToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
          code: "INVALID_REQUEST",
        },
        { status: 400 },
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      !("email" in body) ||
      !("cnic" in body) ||
      !("password" in body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, CNIC and password are required.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const { email, cnic, password } = body as {
      email?: unknown;
      cnic?: unknown;
      password?: unknown;
    };

    if (
      typeof email !== "string" ||
      typeof cnic !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !cnic.trim() ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, CNIC and password are required.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const mockUser = findMockUserByCredentials(
      email.trim(),
      cnic.trim(),
      password,
    );

    if (!mockUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email, CNIC, or password.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      );
    }

    const user = toAuthUser(mockUser);

    const accessToken = await createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      permissions: user.permissions,
    });

    const refreshToken = await createRefreshToken({
      sub: user.id,
      jti: crypto.randomUUID(),
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        accessToken,
        user,
      },
      { status: 200 },
    );

    response.cookies.set(AUTH_CONFIG.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_CONFIG.refreshTokenExpiresInSeconds,
    });

    return response;
  } catch (error) {
    console.error("Mock login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
