import { NextResponse } from "next/server";

import { AUTH_CONFIG } from "@/lib/auth/auth-config";

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully.",
    },
    { status: 200 }
  );

  response.cookies.set(
    AUTH_CONFIG.refreshTokenCookieName,
    "",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }
  );

  return response;
}