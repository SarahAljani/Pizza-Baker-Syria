import { useCallback, useState } from "react";
import { SESSION_KEY } from "./authConfig";

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionToken() {
  return readSession()?.token || null;
}

export function useDashboardAuth() {
  const [isAuthed, setIsAuthed] = useState(() => !!readSession());
  const [lockedUntil, setLockedUntil] = useState(0);

  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 429) {
        const until = Date.now() + 60_000;
        setLockedUntil(until);
        return { ok: false, reason: "locked" };
      }

      if (res.status === 500) {
        return { ok: false, reason: "not_configured" };
      }

      if (!res.ok) {
        return { ok: false, reason: "invalid" };
      }

      const { token, expiresAt } = await res.json();
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, expiresAt }));
      setIsAuthed(true);
      return { ok: true };
    } catch {
      return { ok: false, reason: "network" };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthed(false);
  }, []);

  return { isAuthed, login, logout, lockedUntil };
}
