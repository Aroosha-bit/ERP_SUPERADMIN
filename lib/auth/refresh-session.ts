import { randomUUID } from "crypto";

type RefreshSession = {
  jti: string;
  userId: string;
  expiresAt: number;
  revoked: boolean;
};

const globalForAuth = globalThis as typeof globalThis & {
  __mockRefreshSessions?: Map<string, RefreshSession>;
};

const sessions =
  globalForAuth.__mockRefreshSessions ?? new Map<string, RefreshSession>();

if (process.env.NODE_ENV !== "production") {
  globalForAuth.__mockRefreshSessions = sessions;
}

export function createRefreshSession(userId: string, expiresInSeconds: number) {
  const jti = randomUUID();

  const session: RefreshSession = {
    jti,
    userId,
    expiresAt: Date.now() + expiresInSeconds * 1000,
    revoked: false,
  };

  sessions.set(jti, session);

  return session;
}

export function getRefreshSession(jti: string) {
  return sessions.get(jti);
}

export function isRefreshSessionValid(jti: string, userId: string) {
  const session = sessions.get(jti);

  if (!session) {
    return false;
  }

  if (session.revoked) {
    return false;
  }

  if (session.userId !== userId) {
    return false;
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(jti);
    return false;
  }

  return true;
}

export function revokeRefreshSession(jti: string) {
  const session = sessions.get(jti);

  if (!session) {
    return;
  }

  session.revoked = true;
}

export function rotateRefreshSession(
  oldJti: string,
  userId: string,
  expiresInSeconds: number,
) {
  revokeRefreshSession(oldJti);

  return createRefreshSession(userId, expiresInSeconds);
}
