// Prototype design check: `node ds/check.mjs` from the repo root.
// Fails if a page, stylesheet or script uses a raw color, font size, radius or weight instead of a token
// from ds/tokens.css. ds/tokens.css is generated from golevarun/pm-app (app/tokens.css): edit it there,
// then run `npm run sync:prototype` in pm-app. The iPhone Mail mock (cd-ios-*) and case-study/ are exempt.
import fs from 'node:fs';

const files = fs.readdirSync('.').filter((f) => /\.(html|css|js)$/.test(f) && !f.startsWith('cd-ios'));
const RULES = [
  ['raw color', /#[0-9a-fA-F]{6}\b|\brgba?\(\s*\d/g],
  ['font size', /font-size:\s*\d[\d.]*px/g],
  ['radius', /border-radius:\s*\d[\d.]*px/g],
  ['font weight', /font-weight:\s*\d{3}/g],
  ['font shorthand', /\bfont:\s*\d{3}\s/g],
];
const problems = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  // In pages, only check styles and scripts (not text content or links).
  const parts = f.endsWith('.html')
    ? [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>|style="([^"]*)"|<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => ({ i: m.index, s: m[1] ?? m[2] ?? m[3] ?? '' }))
    : [{ i: 0, s: text }];
  for (const { i, s } of parts) {
    const body = s.replace(/url\((["'])data:.*?\1\)/g, (x) => ' '.repeat(x.length));
    for (const [name, re] of RULES) for (const m of body.matchAll(re))
      problems.push(`${f}:${text.slice(0, i + m.index).split('\n').length}  ${name}: ${m[0]}`);
  }
}
if (problems.length) {
  console.error(`Design check failed: ${problems.length} value(s) bypass ds/tokens.css`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log(`[design] OK: ${files.length} files use ds/tokens.css only`);
