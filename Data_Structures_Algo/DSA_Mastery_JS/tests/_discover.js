// Shared helper: find curriculum .js files and topic folders.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'tests']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
}

/** Every runnable curriculum .js file (implementations + solutions), excluding tests/ folders. */
function curriculumFiles(startDir = ROOT) {
  return walk(startDir).sort();
}

/** Every *.test.js file under topic-level tests/ folders. */
function topicTestFiles(startDir = ROOT) {
  const out = [];
  (function rec(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'tests' && dir !== ROOT) {
          for (const f of fs.readdirSync(full)) if (f.endsWith('.test.js')) out.push(path.join(full, f));
        } else rec(full);
      }
    }
  })(startDir);
  return out.sort();
}

/** Top-level numbered topic folders, e.g. 03_Arrays. */
function topics() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && /^\d\d_/.test(e.name))
    .map(e => e.name)
    .sort();
}

function resolveTopic(arg) {
  if (!arg) return null;
  const all = topics();
  const exact = all.find(t => t === arg);
  if (exact) return exact;
  const byNumber = all.find(t => t.startsWith(arg.padStart(2, '0') + '_'));
  if (byNumber) return byNumber;
  const fuzzy = all.filter(t => t.toLowerCase().includes(arg.toLowerCase()));
  return fuzzy.length === 1 ? fuzzy[0] : null;
}

module.exports = { ROOT, curriculumFiles, topicTestFiles, topics, resolveTopic };
