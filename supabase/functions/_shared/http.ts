export const jsonHeaders = { 'content-type': 'application/json; charset=utf-8' };

const localOrigins = ['http://127.0.0.1:4173', 'http://localhost:4173', 'http://127.0.0.1:4174', 'http://localhost:4174'];

export function allowedOrigins() {
  const configured = Deno.env.get('ALLOWED_ORIGINS');
  return configured ? configured.split(',').map(value => value.trim()).filter(Boolean) : localOrigins;
}

export function isAllowedOrigin(origin: string) {
  return Boolean(origin) && allowedOrigins().includes(origin);
}

export function isAllowedRedirect(value: string) {
  try {
    const url = new URL(value);
    return isAllowedOrigin(url.origin) && url.pathname === '/auth/callback' && !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  if (!isAllowedOrigin(origin)) return { vary: 'Origin' };
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
    'vary': 'Origin',
  };
}

export function respond(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...corsHeaders(request) } });
}

export function handleOptions(request: Request) {
  const origin = request.headers.get('origin') || '';
  if (!isAllowedOrigin(origin)) return new Response(null, { status: 403, headers: { vary: 'Origin' } });
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}
