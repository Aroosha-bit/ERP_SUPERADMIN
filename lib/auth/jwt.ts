import { jwtVerify, SignJWT, type JWTPayload } from "jose";

import { AUTH_CONFIG } from "@/lib/auth/auth-config";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "@/lib/auth/auth-types";

function getAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function createAccessToken(
  payload: Omit<AccessTokenPayload, "tokenType">,
) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    tenantId: payload.tenantId,
    permissions: payload.permissions,
    tokenType: "access",
  })
    .setProtectedHeader({
      alg: AUTH_CONFIG.algorithm,
      typ: "JWT",
    })
    .setSubject(payload.sub)
    .setIssuer(AUTH_CONFIG.issuer)
    .setAudience(AUTH_CONFIG.audience)
    .setIssuedAt()
    .setExpirationTime(
      Math.floor(Date.now() / 1000) + AUTH_CONFIG.accessTokenExpiresInSeconds,
    )
    .sign(getAccessSecret());
}

export async function createRefreshToken(
  payload: Omit<RefreshTokenPayload, "tokenType">,
) {
  return new SignJWT({
    jti: payload.jti,
    tokenType: "refresh",
  })
    .setProtectedHeader({
      alg: AUTH_CONFIG.algorithm,
      typ: "JWT",
    })
    .setSubject(payload.sub)
    .setIssuer(AUTH_CONFIG.issuer)
    .setAudience(AUTH_CONFIG.audience)
    .setIssuedAt()
    .setExpirationTime(
      Math.floor(Date.now() / 1000) + AUTH_CONFIG.refreshTokenExpiresInSeconds,
    )
    .sign(getRefreshSecret());
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload & JWTPayload> {
  const { payload } = await jwtVerify(token, getAccessSecret(), {
    issuer: AUTH_CONFIG.issuer,
    audience: AUTH_CONFIG.audience,
    algorithms: [AUTH_CONFIG.algorithm],
  });

  if (
    payload.tokenType !== "access" ||
    !payload.sub ||
    typeof payload.email !== "string" ||
    typeof payload.role !== "string" ||
    !Array.isArray(payload.permissions)
  ) {
    throw new Error("Invalid access token payload.");
  }

  return payload as AccessTokenPayload & JWTPayload;
}

export async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenPayload & JWTPayload> {
  const { payload } = await jwtVerify(token, getRefreshSecret(), {
    issuer: AUTH_CONFIG.issuer,
    audience: AUTH_CONFIG.audience,
    algorithms: [AUTH_CONFIG.algorithm],
  });

  if (
    payload.tokenType !== "refresh" ||
    !payload.sub ||
    typeof payload.jti !== "string"
  ) {
    throw new Error("Invalid refresh token payload.");
  }

  return payload as RefreshTokenPayload & JWTPayload;
}
