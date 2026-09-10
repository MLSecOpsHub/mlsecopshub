import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

let fonts: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[]> | undefined;
async function loadFonts() {
  fonts ??= Promise.all([
    ['Inter', 'inter-latin-400-normal.woff', 400],
    ['Inter', 'inter-latin-700-normal.woff', 700],
    ['JetBrains Mono', 'jetbrains-mono-latin-400-normal.woff', 400],
    ['JetBrains Mono', 'jetbrains-mono-latin-700-normal.woff', 700],
  ].map(async ([name, file, weight]) => ({
    name: name as string,
    data: (await readFile(resolve(process.cwd(), 'src/assets/fonts', file as string))).buffer as ArrayBuffer,
    weight: weight as 400 | 700,
    style: 'normal' as const,
  })));
  return fonts;
}

export interface OgInput { title: string; kicker: string; subtitle?: string }

/** 1200×630 PNG in the site's dark terminal-editorial style. */
export async function renderOg({ title, kicker, subtitle }: OgInput): Promise<Buffer> {
  const h = (type: string, props: Record<string, unknown>, ...children: unknown[]) => ({ type, props: { ...props, children: children.length === 1 ? children[0] : children } });
  const size = title.length > 70 ? 44 : title.length > 45 ? 54 : 64;
  const tree = h('div', { style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', background: '#0B1220', color: '#F3F6FB', padding: '64px', fontFamily: 'Inter', position: 'relative' } },
    h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: '#7CFFB2', display: 'flex' } }),
    h('div', { style: { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: '24px', color: '#7CFFB2', letterSpacing: '2px' } }, `// ${kicker.toUpperCase()}`),
    h('div', { style: { display: 'flex', marginTop: '28px', fontSize: `${size}px`, fontWeight: 700, lineHeight: 1.12, letterSpacing: '-1.5px', maxWidth: '1040px' } }, title),
    subtitle ? h('div', { style: { display: 'flex', marginTop: '24px', fontSize: '28px', color: '#9FB0C8', lineHeight: 1.35, maxWidth: '1000px' } }, subtitle) : h('div', { style: { display: 'flex' } }),
    h('div', { style: { display: 'flex', position: 'absolute', left: '64px', right: '64px', bottom: '56px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #22304A', paddingTop: '24px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
        h('div', { style: { display: 'flex', width: '36px', height: '36px', border: '3px solid #7CFFB2', borderRadius: '6px' } }),
        h('div', { style: { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: '28px', fontWeight: 700 } }, 'MLSecOps', h('span', { style: { color: '#7CFFB2' } }, 'Hub')),
      ),
      h('div', { style: { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: '22px', color: '#9FB0C8' } }, 'mlsecopshub.com · MLSecOps and AI security'),
    ),
  );
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng() as Buffer;
}
