// Runs EVERY implementation and solution file in the curriculum as its own process
// and asserts it exits 0 and prints a ✓ line. Usage: npm test (runs with every other *.test.js)
const { describe, it } = require('node:test');
const assert = require('node:assert');
const { execFile } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const { ROOT, curriculumFiles } = require('./_discover');

const files = curriculumFiles();
const only = process.env.TOPIC ? files.filter(f => path.relative(ROOT, f).startsWith(process.env.TOPIC)) : files;

describe(`curriculum files (${only.length})`, { concurrency: Math.max(2, os.cpus().length - 1) }, () => {
  for (const file of only) {
    it(path.relative(ROOT, file), () => new Promise((resolve, reject) => {
      execFile(process.execPath, [file], { cwd: path.dirname(file), timeout: 60_000 }, (err, stdout, stderr) => {
        if (err) return reject(new Error(`exit ${err.code}\n${stderr || stdout}`));
        assert.ok(/✓/.test(stdout), `expected a ✓ line in output of ${file}\n${stdout}`);
        resolve();
      });
    }));
  }
});
