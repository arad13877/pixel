import type { Session } from '@supabase/supabase-js';

export const CRM_SESSION_MS = 24 * 60 * 60 * 1000;
const storagePrefix = 'pixel-crm-login-start:';

function sessionId(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { session_id?: unknown };
    return typeof decoded.session_id === 'string' ? decoded.session_id : null;
  } catch { return null; }
}

export function markLogin(token: string, startedAt = Date.now()) {
  const id = sessionId(token);
  if (id) localStorage.setItem(`${storagePrefix}${id}`, String(startedAt));
}

export function getLoginStart(session: Session, allowEmailSetup = false): number | null {
  const id = sessionId(session.access_token);
  if (!id) return null;
  const key = `${storagePrefix}${id}`;
  const stored = Number(localStorage.getItem(key));
  if (Number.isFinite(stored) && stored > 0) return stored;
  if (!allowEmailSetup) return null;
  const signedIn = Date.parse(session.user.last_sign_in_at || '');
  if (!Number.isFinite(signedIn)) return null;
  localStorage.setItem(key, String(signedIn));
  return signedIn;
}

export function remainingLoginTime(session: Session, now = Date.now(), allowEmailSetup = false) {
  const started = getLoginStart(session, allowEmailSetup);
  if (started === null || started > now + 60_000) return 0;
  return Math.max(0, CRM_SESSION_MS - (now - started));
}

export function clearLogin(session: Session | null) {
  const id = session && sessionId(session.access_token);
  if (id) localStorage.removeItem(`${storagePrefix}${id}`);
}
