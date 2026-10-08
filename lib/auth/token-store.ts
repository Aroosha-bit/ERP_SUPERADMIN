"use client";

type TokenListener = (token: string | null) => void;

let accessToken: string | null = null;

const listeners = new Set<TokenListener>();

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;

  listeners.forEach((listener) => {
    listener(token);
  });
}

export function clearAccessToken() {
  setAccessToken(null);
}

export function subscribeToAccessToken(listener: TokenListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
