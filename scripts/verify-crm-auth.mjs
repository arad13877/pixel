import test from 'node:test';
import assert from 'node:assert/strict';
import { CRM_SESSION_MS, clearLogin, markLogin, remainingLoginTime } from '../src/crm/auth-session.ts';

const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: key => values.delete(key),
};

function session(id, lastSignIn = '2026-01-01T00:00:00.000Z') {
  const token = `header.${Buffer.from(JSON.stringify({ session_id: id })).toString('base64url')}.signature`;
  return { access_token: token, user: { last_sign_in_at: lastSignIn } };
}

test('fixed 24-hour deadline is not renewed by token refresh', () => {
  const first = session('session-a');
  const refreshed = session('session-a');
  markLogin(first.access_token, 1_000_000);
  assert.equal(remainingLoginTime(refreshed, 1_000_000 + CRM_SESSION_MS - 1), 1);
  assert.equal(remainingLoginTime(refreshed, 1_000_000 + CRM_SESSION_MS), 0);
});

test('a new session has its own deadline and a signed-out marker is cleared', () => {
  const old = session('session-b');
  const next = session('session-c');
  markLogin(old.access_token, 2_000_000);
  markLogin(next.access_token, 3_000_000);
  clearLogin(old);
  assert.equal(remainingLoginTime(old, 3_000_000), 0);
  assert.equal(remainingLoginTime(next, 3_000_000), CRM_SESSION_MS);
});

test('email-link sessions are limited to initial account setup', () => {
  const setup = session('session-d');
  const signedIn = Date.parse(setup.user.last_sign_in_at);
  assert.equal(remainingLoginTime(setup, signedIn), 0);
  assert.equal(remainingLoginTime(setup, signedIn, true), CRM_SESSION_MS);
});
