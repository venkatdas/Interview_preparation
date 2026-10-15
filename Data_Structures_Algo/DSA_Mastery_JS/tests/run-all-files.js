// Plain runner without node:test: runs every curriculum .js file, prints a pass/fail summary.
// Usage: node tests/run-all-files.js [topic-folder-prefix]
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { ROOT, curriculumFiles } = require('./_discover');

const prefix = process.argv[2] || '';
const files = curriculumFiles().filter(f => path.relative(ROOT, f).startsWith(prefix));
const failed = [];
const start = Date.now();
for (const file of files) {
  const r = spawnSync(process.execPath, [file], { cwd: path.dirname(file), encoding: 'utf8', timeout: 60_000 });
  const ok = r.status === 0 && /✓/.test(r.stdout);
  if (!ok) failed.push({ file: path.relative(ROOT, file), out: (r.stderr || r.stdout || '').trim().split('\n').slice(-8).join('\n') });
  process.stdout.write(ok ? '.' : 'F');
}
console.log(`\n\n${files.length - failed.length}/${files.length} files passed in ${((Date.now() - start) / 1000).toFixed(1)}s`);
for (const f of failed) console.log(`\nFAIL ${f.file}\n${f.out}`);
process.exit(failed.length ? 1 : 0);
