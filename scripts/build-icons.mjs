// Rasterizes public/logo.svg into the PNG icons referenced by the manifest and JSON-LD.
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync('public/logo.svg', 'utf8');
const out = { 'public/logo.png': 512, 'public/icon-512.png': 512, 'public/icon-192.png': 192, 'public/apple-touch-icon.png': 180 };
for (const [file, size] of Object.entries(out)) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  writeFileSync(file, png);
}
// favicon.ico: a 32px PNG wrapped in an ICO container (PNG-in-ICO is supported by all modern browsers).
const png32 = new Resvg(svg, { fitTo: { mode: 'width', value: 32 } }).render().asPng();
const header = Buffer.alloc(6 + 16);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(png32.length, 14); header.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([header, png32]));
console.log('[icons] wrote', Object.keys(out).join(', '), 'favicon.ico');
