import { assertEquals } from 'jsr:@std/assert@1';
import { submitLead, type SubmitLeadDependencies } from '../submit-lead/index.ts';

const valid = {
  name: 'کاربر تست', phone: '09120000000', service_type: 'web_design',
  brief: 'توضیح معتبر برای یک درخواست واقعی', consent: 'true',
  'cf-turnstile-response': 'token',
};

function dependencies(overrides: Partial<SubmitLeadDependencies> = {}): SubmitLeadDependencies {
  return {
    env: name => name === 'TURNSTILE_SECRET_KEY' ? 'secret' : 'salt',
    verifyTurnstile: async () => true,
    fingerprint: async () => 'hash',
    consumeLimit: async () => true,
    insertLead: async () => {},
    ...overrides,
  };
}

function request(body: Record<string, unknown>) {
  return new Request('http://localhost/functions/v1/submit-lead', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://127.0.0.1:4173' }, body: JSON.stringify(body) });
}

Deno.test('submit-lead rejects invalid schema before external calls', async () => {
  assertEquals((await submitLead(request({ ...valid, name: '' }), dependencies())).status, 422);
});

Deno.test('submit-lead rejects an invalid Turnstile token', async () => {
  assertEquals((await submitLead(request(valid), dependencies({ verifyTurnstile: async () => false }))).status, 400);
});

Deno.test('submit-lead enforces the server-side rate limit', async () => {
  assertEquals((await submitLead(request(valid), dependencies({ consumeLimit: async () => false }))).status, 429);
});

Deno.test('submit-lead inserts only after validation and security checks', async () => {
  let inserted = false;
  const response = await submitLead(request(valid), dependencies({ insertLead: async () => { inserted = true; } }));
  assertEquals(response.status, 201);
  assertEquals(inserted, true);
});
