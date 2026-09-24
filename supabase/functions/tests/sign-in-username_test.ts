import { assertEquals } from 'jsr:@std/assert@1';
import { signInWithUsername, type Dependencies } from '../sign-in-username/index.ts';

function dependencies(overrides: Partial<Dependencies> = {}): Dependencies {
  return {
    fingerprint: async value => value,
    consumeLimit: async () => true,
    findAccount: async () => ({ id: 'user-1', email: 'private@example.com' }),
    signIn: async () => ({ userId: 'user-1', session: { access_token: 'access', refresh_token: 'refresh' } }),
    isActiveMember: async () => true,
    ...overrides,
  };
}

function request(username = 'pixel_user', password = 'correct-password', origin = 'http://127.0.0.1:4173') {
  return new Request('http://localhost/functions/v1/sign-in-username', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

Deno.test('username login returns tokens without email only for an active member', async () => {
  const response = await signInWithUsername(request(), dependencies());
  assertEquals(response.status, 200);
  assertEquals(await response.json(), { access_token: 'access', refresh_token: 'refresh' });
  assertEquals(response.headers.get('cache-control'), 'no-store');
});

Deno.test('unknown username and wrong password have identical responses', async () => {
  const unknown = await signInWithUsername(request(), dependencies({ findAccount: async () => null, signIn: async () => null }));
  const wrong = await signInWithUsername(request(), dependencies({ signIn: async () => null }));
  assertEquals(unknown.status, 401);
  assertEquals(await unknown.text(), await wrong.text());
});

Deno.test('inactive member cannot sign in', async () => {
  assertEquals((await signInWithUsername(request(), dependencies({ isActiveMember: async () => false }))).status, 401);
});

Deno.test('login enforces rate limits', async () => {
  assertEquals((await signInWithUsername(request(), dependencies({ consumeLimit: async () => false }))).status, 429);
});

Deno.test('login rejects bad username and origin before account lookup', async () => {
  assertEquals((await signInWithUsername(request('bad-name', 'password'), dependencies())).status, 401);
  assertEquals((await signInWithUsername(request('pixel_user', 'password', 'https://untrusted.example'), dependencies())).status, 403);
});
