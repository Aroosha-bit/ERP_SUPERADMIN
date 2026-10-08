export const AUTH_CONFIG = {
  accessTokenExpiresInSeconds: 15 * 60, // 15 minutes
  refreshTokenExpiresInSeconds: 7 * 24 * 60 * 60, // 7 days

  accessTokenCookieName: "erp_access_token",
  refreshTokenCookieName: "erp_refresh_token",

  issuer: "erp-superadmin-mock",
  audience: "erp-superadmin-frontend",

  algorithm: "HS256" as const,
} as const;

export const MOCK_PERMISSIONS = [
  "dashboard.view",
  "tenant.view",
  "tenant.create",
  "tenant.update",
  "tenant.delete",
  "platform.settings.view",
  "audit.logs.view",
] as const;
