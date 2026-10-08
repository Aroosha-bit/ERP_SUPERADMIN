export type AuthUser = {
  id: string;
  name: string;
  email: string;
  cnic: string;
  role: string;
  tenantId: string | null;
  permissions: string[];
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  tenantId: string | null;
  permissions: string[];
  tokenType: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  jti: string;
  tokenType: "refresh";
};

export type LoginResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  user: AuthUser;
};

export type RefreshResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  user: AuthUser;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
};
