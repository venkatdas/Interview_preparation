/**
 * 07. Memoize with a Closure   (Original — Medium)
 *
 * PROBLEM
 * Count the number of ways to climb a staircase of n steps when each move climbs
 * 1, 2 or 3 steps. Write it as a plain recursive function first, then write a
 * general memoize(fn) helper that returns a cached version of any function whose
 * arguments are numbers. The cache must live inside a closure (no global variables),
 * and the memoized function must call ITSELF through the cache so inner calls are
 * cached too. Also report how many times the underlying function body ran.
 *
 * EXAMPLES
 * Input: n = 0   Output: 1   (do nothing: one way)
 * Input: n = 3   Output: 4   (1+1+1, 1+2, 2+1, 3)
 * Input: n = 4   Output: 7
 * Input: n = 40  Output: 23837527729   (instant with memo, very slow without)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 70 -> the answer exceeds 2^53 around n = 74, so stay below or use BigInt.
 * - Negative n? (0 ways)
 * - Should two separate memoize() calls share a cache? (no, each closure gets its own)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(3^n) time, O(n) stack
 * ways(n) = ways(n-1) + ways(n-2) + ways(n-3), ways(0) = 1, ways(<0) = 0.
 * The same subproblems are recomputed again and again (ways(n-3) is reached from
 * three different parents).
 *
 * APPROACH 2 — Optimal (memoize via closure)   O(n) time, O(n) space
 * memoize(fn) creates `const cache = new Map()` and returns a wrapper that checks the
 * cache first. The cache variable is captured by the wrapper (a closure), so it survives
 * between calls but nobody else can touch it. Crucially, the recursive calls must go
 * through the WRAPPER: we define `const ways = memoize(n => ... ways(n - 1) ...)`.
 * Each n is computed once -> n + 1 body executions.
 *
 * Dry run n = 3 (body runs counted):
 *   ways(3) miss -> ways(2) miss -> ways(1) miss -> ways(0) miss = 1, ways(-1) = 0, ways(-2) = 0
 *   ways(1) = 1 cached; ways(2) = ways(1)+ways(0)+ways(-1) = 1+1+0 = 2 (hits)
 *   ways(3) = 2 + 1 + 1 = 4
 *
 * EDGE CASES
 * - n = 0 -> 1, n < 0 -> 0
 * - two memoized functions must not share a cache
 * - the cache key: for one numeric arg, the number itself is a fine Map key
 *
 * COMMON MISTAKES
 * - memo = memoize(slowWays) where slowWays calls slowWays: only the OUTER call is cached.
 * - A module-level cache shared across unrelated tests.
 * - Using an object as cache with numeric keys (fine) but then multi-arg keys like [a, b] (becomes "a,b" by accident).
 */

function memoize(fn, keyFn = (...args) => (args.length === 1 ? args[0] : args.join('|'))) {
  const cache = new Map();          // lives in this closure only
  return function memoized(...args) {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}

function makeBrute() {
  let bodyRuns = 0;
  function ways(n) {
    bodyRuns++;
    if (n < 0) return 0;
    if (n === 0) return 1;
    return ways(n - 1) + ways(n - 2) + ways(n - 3);
  }
  return { ways, runs: () => bodyRuns };
}

function makeOptimal() {
  let bodyRuns = 0;
  const ways = memoize(n => {
    bodyRuns++;
    if (n < 0) return 0;
    if (n === 0) return 1;
    return ways(n - 1) + ways(n - 2) + ways(n - 3); // calls go through the cache
  });
  return { ways, runs: () => bodyRuns };
}

function bruteForce(n) { return makeBrute().ways(n); }
function optimal(n) { return makeOptimal().ways(n); }

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(0), 1);
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(3), 4);
  assert.strictEqual(solve(4), 7);
  assert.strictEqual(solve(-2), 0);
}
assert.strictEqual(optimal(40), 23837527729);

// body-run counts: exponential vs linear
const b = makeBrute(); b.ways(20);
const o = makeOptimal(); o.ways(20);
assert.ok(b.runs() > 100000, 'brute force repeats work');
assert.ok(o.runs() <= 20 + 3, 'memo computes each n once (plus the negative bases)');

// separate closures do not share caches
const o1 = makeOptimal(), o2 = makeOptimal();
o1.ways(10); o2.ways(10);
assert.strictEqual(o1.runs(), o2.runs());

// the "outer-only" memo bug
let slowRuns = 0;
function slow(n) { slowRuns++; return n <= 0 ? (n === 0 ? 1 : 0) : slow(n - 1) + slow(n - 2) + slow(n - 3); }
const outerOnly = memoize(slow);
outerOnly(15);
assert.ok(slowRuns > 1000, 'only the outer call was cached');

for (let n = 0; n <= 18; n++) assert.strictEqual(optimal(n), bruteForce(n));
console.log('✓ 07_memoize_closure passed');

module.exports = { optimal, bruteForce, memoize };
