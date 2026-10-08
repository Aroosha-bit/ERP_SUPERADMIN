import { NextResponse } from "next/server";
import { errors } from "jose";

import { verifyAccessToken } from "@/lib/auth/jwt";

export type AuthenticatedRequestResult =
  | {
      success: true;
      payload: Awaited<ReturnType<typeof verifyAccessToken>>;
    }
  | {
      success: false;
      response: NextResponse;
    };

export async function requireAuth(
  request: Request,
): Promise<AuthenticatedRequestResult> {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication token is required.",
          code: "TOKEN_MISSING",
        },
        { status: 401 },
      ),
    };
  }

  const [scheme, token, ...extraParts] = authorization.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token || extraParts.length > 0) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Authorization header is invalid.",
          code: "TOKEN_MALFORMED",
        },
        { status: 401 },
      ),
    };
  }

  try {
    const payload = await verifyAccessToken(token);

    return {
      success: true,
      payload,
    };
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            message: "Access token has expired.",
            code: "TOKEN_EXPIRED",
          },
          { status: 401 },
        ),
      };
    }

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Access token is invalid.",
          code: "TOKEN_INVALID",
        },
        { status: 401 },
      ),
    };
  }
}
