
export type AuthUser = {
  userId: string;
  tenantId: string | null;
  legalEntityId: string | null;
  userName: string;
  name: string;
  email: string;
  mustChangePassword: boolean;
  roles: string[];
  permissions: string[];
};

export type AuthSession = {
  token: string;
  expiresOn: string;
  user: AuthUser;
};

export type LoginPayload = {
  userName: string;
  password: string;
};

export type BackendLoginBody = {
  token: string;
  expiresOn: string;
  userId: string;
  tenantId: string | null;
  legalEntityId: string | null;
  userName: string;
  name: string;
  email: string;
  mustChangePassword: boolean;
  roles: string[];
  permissions: string[];
};

export type BackendResponse<T> = {
  statusCode: number;
  message: string;
  body: T;
  isError: boolean;
  errorMessage: string;
};
