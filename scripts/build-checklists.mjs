// Generates public/downloads/<slug>-checklist.{md,pdf} from the `checklist`
// frontmatter of each readiness page. Runs before `astro build`.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import PDFDocument from 'pdfkit';

const SRC = 'src/content/readiness';
const OUT = 'public/downloads';
mkdirSync(OUT, { recursive: true });

// Minimal YAML subset parser for the fields we need (title, shortTitle, framework, officialSource, checklist).
function parseFrontmatter(text) {
  const fm = text.split(/^---\s*$/m)[1];
  const get = (key) => fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1];
  const url = fm.match(/^officialSource:\s*\n(?:.*\n)*?\s+url:\s*"?(\S+?)"?\s*$/m)?.[1];
  const label = fm.match(/^officialSource:\s*\n(?:.*\n)*?\s+label:\s*"?(.*?)"?\s*$/m)?.[1];
  const block = fm.slice(fm.indexOf('\nchecklist:') + 1);
  const end = block.search(/\n[a-zA-Z]+:/);
  const cl = (end === -1 ? block : block.slice(0, end)).split('\n').slice(1);
  const sections = [];
  for (const line of cl) {
    const s = line.match(/^\s*-\s*section:\s*"?(.*?)"?\s*$/);
    const i = line.match(/^\s+-\s+"?(.*?)"?\s*$/);
    if (s) sections.push({ section: s[1], items: [] });
    else if (i && sections.length) sections[sections.length - 1].items.push(i[1].replace(/\\"/g, '"'));
  }
  return { shortTitle: get('shortTitle'), framework: get('framework'), updated: get('updated'), source: { url, label }, sections };
}

for (const file of readdirSync(SRC).filter((f) => f.endsWith('.md'))) {
  const slug = file.replace(/\.md$/, '');
  const d = parseFrontmatter(readFileSync(join(SRC, file), 'utf8'));
  if (!d.sections.length) throw new Error(`No checklist parsed for ${slug}`);
  const total = d.sections.reduce((n, s) => n + s.items.length, 0);
  const pageUrl = `https://mlsecopshub.com/readiness/${slug}`;

  // Markdown
  const md = [
    `# ${d.shortTitle} security checklist`,
    '',
    `Framework: ${d.framework}  `,
    `Official source: ${d.source.url}  `,
    `Maintained by MLSecOpsHub: ${pageUrl}  `,
    `Last updated: ${d.updated}. ${total} items. Obligations are paraphrased; this is engineering guidance, not legal advice.`,
    '',
    ...d.sections.flatMap((s) => [`## ${s.section}`, '', ...s.items.map((i) => `- [ ] ${i}`), '']),
    '---',
    `Have this run against your pipeline: https://mlsecopshub.com/services · Book a 30-minute assessment call.`,
    '',
  ].join('\n');
  writeFileSync(join(OUT, `${slug}-checklist.md`), md);

  // PDF
  const doc = new PDFDocument({ size: 'A4', margins: { top: 56, bottom: 56, left: 56, right: 56 }, info: { Title: `${d.shortTitle} security checklist`, Author: 'MLSecOpsHub', Subject: d.framework, Keywords: `MLSecOps, ${d.shortTitle}, checklist` } });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((res) => doc.on('end', res));
  doc.rect(0, 0, doc.page.width, 6).fill('#7CFFB2');
  doc.fillColor('#0B1220').font('Courier-Bold').fontSize(10).text('// MLSECOPSHUB · READINESS CHECKLIST', 56, 40);
  doc.moveDown(0.6).font('Helvetica-Bold').fontSize(20).text(`${d.shortTitle} security checklist`);
  doc.moveDown(0.4).font('Helvetica').fontSize(10).fillColor('#4A5A72')
    .text(`Framework: ${d.framework}`)
    .text(`Official source: ${d.source.url}`, { link: d.source.url })
    .text(`Online version and control mapping: ${pageUrl}`, { link: pageUrl })
    .text(`Last updated ${d.updated}. ${total} items. Obligations are paraphrased; engineering guidance, not legal advice.`);
  for (const s of d.sections) {
    doc.moveDown(0.9).fillColor('#0B1220').font('Helvetica-Bold').fontSize(13).text(s.section);
    doc.moveDown(0.2).font('Helvetica').fontSize(10.5);
    for (const item of s.items) {
      const y = doc.y;
      doc.rect(56, y + 2, 9, 9).lineWidth(0.8).stroke('#4A5A72');
      doc.fillColor('#0B1220').text(item, 72, y, { width: doc.page.width - 72 - 56 });
      doc.moveDown(0.25);
    }
  }
  doc.moveDown(1.2).font('Courier').fontSize(9).fillColor('#4A5A72')
    .text('Have this run against your pipeline: https://mlsecopshub.com/services', { link: 'https://mlsecopshub.com/services' })
    .text('Book a 30-minute assessment call: https://mlsecopshub.com/contact', { link: 'https://mlsecopshub.com/contact' });
  doc.end();
  await done;
  writeFileSync(join(OUT, `${slug}-checklist.pdf`), Buffer.concat(chunks));
  console.log(`[checklists] ${slug}: ${total} items → md + pdf`);
}
