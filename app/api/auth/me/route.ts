import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth/require-auth";
import {
  findMockUserById,
  toAuthUser,
} from "@/lib/auth/mock-users";

export async function GET(request: Request) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  const user = findMockUserById(auth.payload.sub);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authenticated user was not found.",
        code: "USER_NOT_FOUND",
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: toAuthUser(user),
    },
    { status: 200 }
  );
}