// Verifies that every relative Markdown link in the curriculum points to an existing file/folder.
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./_discover');

const mdFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full); else if (e.name.endsWith('.md')) mdFiles.push(full);
  }
})(ROOT);

let broken = 0;
for (const file of mdFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\]\(([^)\s#]+)(#[^)]*)?\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:)/.test(target)) continue;
    const abs = path.resolve(path.dirname(file), decodeURIComponent(target));
    if (!fs.existsSync(abs)) { broken++; console.log(`BROKEN ${path.relative(ROOT, file)} -> ${target}`); }
  }
}
console.log(broken ? `\n${broken} broken link(s)` : `all links OK (${mdFiles.length} markdown files checked)`);
process.exit(broken ? 1 : 0);
