// Run a single curriculum file by (partial) name. Usage: npm run run two_sum
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { ROOT, curriculumFiles } = require('./_discover');
const q = (process.argv[2] || '').toLowerCase();
const hits = curriculumFiles().filter(f => path.relative(ROOT, f).toLowerCase().includes(q));
if (!q || hits.length === 0) { console.log('No file matched. Try: npm run run two_sum'); process.exit(1); }
if (hits.length > 1) { console.log('Several files matched, be more specific:\n  ' + hits.map(h => path.relative(ROOT, h)).join('\n  ')); process.exit(1); }
console.log(`> node ${path.relative(ROOT, hits[0])}\n`);
process.exit(spawnSync(process.execPath, [hits[0]], { cwd: path.dirname(hits[0]), stdio: 'inherit' }).status);
