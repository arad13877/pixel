import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
const root = resolve('dist');
const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const path = resolve(dir, name);
    if ((await stat(path)).isDirectory()) await walk(path); else files.push(path);
  }
}
await walk(root);
for (const required of ['index.html', 'articles/index.html', 'portfolio/index.html', 'sitemap.xml']) {
  if (!files.includes(resolve(root, required))) throw new Error(`Missing ${required}`);
}
for (const path of files) {
  const name = relative(root, path);
  if (/(^|[/\\])\.env|\.(zip|pem|key|map)$/.test(name)) throw new Error(`Unsafe artifact path ${name}`);
  if (!/\.(html|js|css|json|xml|txt|svg)$/.test(name)) continue;
  const text = await readFile(path, 'utf8');
  if (/puyeoagdmzldjrbypcal|sb_secret_|sbp_[\w-]{8,}|-----BEGIN .*PRIVATE KEY-----/.test(text)) throw new Error(`Credential or staging project in ${name}`);
  for (const url of text.matchAll(/https:\/\/[a-z0-9]+\.supabase\.co/g)) {
    if (url[0] !== 'https://xyhrscvywupxfinwxdup.supabase.co') throw new Error(`Foreign project in ${name}`);
  }
  for (const jwt of text.matchAll(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g)) {
    if (JSON.parse(Buffer.from(jwt[0].split('.')[1], 'base64url').toString()).role === 'service_role') throw new Error(`Privileged key in ${name}`);
  }
}
console.log(`PASS: ${files.length} public files; Production only; no credentials.`);
