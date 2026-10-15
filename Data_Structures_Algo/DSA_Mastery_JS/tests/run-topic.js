// Run one topic: every runnable file in it, then its node:test suites.
// Usage: npm run test:topic 03_Arrays     (or: npm run test:topic 3, or: npm run test:topic arrays)
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { ROOT, topics, resolveTopic } = require('./_discover');

const topic = resolveTopic(process.argv[2]);
if (!topic) {
  console.log('Usage: npm run test:topic <topic>\nAvailable topics:\n  ' + topics().join('\n  '));
  process.exit(1);
}
console.log(`\n=== ${topic}: runnable files ===\n`);
const r1 = spawnSync(process.execPath, [path.join(__dirname, 'run-all-files.js'), topic], { cwd: ROOT, stdio: 'inherit' });
console.log(`\n=== ${topic}: node:test suites ===\n`);
const r2 = spawnSync(process.execPath, ['--test', `${topic}/**/*.test.js`], { cwd: ROOT, stdio: 'inherit' });
process.exit(r1.status || r2.status || 0);
