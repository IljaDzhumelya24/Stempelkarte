import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const target = new URL('public/stampnow-app/', root);
await mkdir(target, { recursive: true });
await cp(new URL('services/stampnow/public/', root), target, { recursive: true });
await cp(new URL('services/stampnow/assets/', root), new URL('assets/', target), { recursive: true });
console.log(`StampNow application pages prepared: ${fileURLToPath(target)}`);
