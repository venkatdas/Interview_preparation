/**
 * Tools for checking complexity claims EMPIRICALLY by counting steps (never by timing).
 *
 * 1. doublingRatio(steps, n)        - steps(2n) / steps(n): ~1 for O(1)/O(log n), ~2 for O(n), ~4 for O(n^2), ~2^d for O(n^d)
 * 2. estimateExponent(steps, n1, n2)- slope on a log-log plot: log(steps2/steps1) / log(n2/n1)
 * 3. masterTheorem(a, b, d, k)      - solve T(n) = a T(n/b) + Theta(n^d log^k n)
 * 4. evalRecurrence(spec, n)        - exact value of a divide-and-conquer recurrence (memoized), to test 3
 * 5. growthTable(ns)                - concrete step counts for the common growth classes
 * 6. isBoundedBy(f, g, c, n0, ns)   - checks the formal definition f(n) <= c*g(n) for all sampled n >= n0
 * 7. mulberry32(seed)               - seeded PRNG for reproducible random tests
 *
 * WHY count steps instead of measuring time? Time is noisy (JIT warm-up, GC, other processes).
 * A step counter is deterministic, so asserts never flake.
 */

function doublingRatio(steps, n) {
  return steps(2 * n) / steps(n);
}

function estimateExponent(steps, n1, n2) {
  return Math.log(steps(n2) / steps(n1)) / Math.log(n2 / n1);
}

// T(n) = a T(n/b) + Theta(n^d (log n)^k), a >= 1, b > 1, d >= 0, k >= 0
function masterTheorem(a, b, d, k = 0) {
  if (a < 1 || b <= 1 || d < 0 || k < 0) throw new RangeError('need a >= 1, b > 1, d >= 0, k >= 0');
  const crit = Math.log(a) / Math.log(b); // log_b a: how fast the number of leaves grows
  const eps = 1e-9;
  const fmt = x => Number(x.toFixed(3)).toString();
  const pow = x => (Math.abs(x) < eps ? '' : Math.abs(x - 1) < eps ? 'n' : `n^${fmt(x)}`);
  const logs = p => (p === 0 ? '' : p === 1 ? ' log n' : ` log^${p} n`);
  if (d < crit - eps) return { case: 1, critical: crit, bound: crit < eps ? 'Theta(1)' : `Theta(${pow(crit)})`, why: 'leaves dominate' };
  if (Math.abs(d - crit) <= eps) {
    const base = pow(d);
    const tail = logs(k + 1).trim();
    return { case: 2, critical: crit, bound: `Theta(${[base, tail].filter(Boolean).join(' ')})`, why: 'every level does the same work' };
  }
  const base = pow(d);
  return { case: 3, critical: crit, bound: `Theta(${base}${logs(k)})`, why: 'the root (top-level work) dominates' };
}

// spec: { a, b, f: n => work at this node, base: value for n <= 1 }
// Uses floor(n / b) for the subproblem size. Memoized: only O(log n) distinct sizes appear.
function evalRecurrence({ a, b, f, base = 1 }, n, memo = new Map()) {
  if (n <= 1) return base;
  if (memo.has(n)) return memo.get(n);
  const v = a * evalRecurrence({ a, b, f, base }, Math.floor(n / b), memo) + f(n);
  memo.set(n, v);
  return v;
}

function factorialApprox(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function growthTable(ns = [10, 100, 1000, 1e6]) {
  return ns.map(n => ({
    n,
    log2n: Math.log2(n),
    sqrtn: Math.sqrt(n),
    n_: n,
    nlogn: n * Math.log2(n),
    n2: n * n,
    n3: n ** 3,
    two_n: 2 ** n,           // Infinity for n >= 1024: it overflows a double
    n_fact: factorialApprox(Math.min(n, 171)), // Infinity beyond 170!
  }));
}

function isBoundedBy(f, g, c, n0, ns) {
  return ns.filter(n => n >= n0).every(n => f(n) <= c * g(n));
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  const near = (x, y, tol) => assert.ok(Math.abs(x - y) <= tol, `${x} not within ${tol} of ${y}`);

  near(doublingRatio(n => 5, 1000), 1, 1e-12);
  near(doublingRatio(n => 3 * n + 7, 1e6), 2, 0.01);
  near(doublingRatio(n => n * n, 1000), 4, 1e-12);
  near(estimateExponent(n => n ** 1.5, 1e3, 1e6), 1.5, 1e-9);
  near(estimateExponent(n => n * Math.log2(n), 1e5, 1e6), 1, 0.15); // n log n looks like "slightly more than 1"

  assert.strictEqual(masterTheorem(2, 2, 1).bound, 'Theta(n log n)');     // merge sort
  assert.strictEqual(masterTheorem(1, 2, 0).bound, 'Theta(log n)');       // binary search
  assert.strictEqual(masterTheorem(2, 2, 0).bound, 'Theta(n)');           // tree traversal
  assert.strictEqual(masterTheorem(3, 2, 1).bound, 'Theta(n^1.585)');     // Karatsuba
  assert.strictEqual(masterTheorem(2, 2, 2).bound, 'Theta(n^2)');         // root dominates
  assert.strictEqual(masterTheorem(8, 2, 2).bound, 'Theta(n^3)');         // naive matrix multiply
  assert.strictEqual(masterTheorem(7, 2, 2).case, 1);                     // Strassen
  assert.strictEqual(masterTheorem(2, 2, 1, 1).bound, 'Theta(n log^2 n)');
  assert.strictEqual(masterTheorem(1, 2, 1).bound, 'Theta(n)');

  // recurrence values agree with the closed forms for powers of two
  for (let k = 0; k <= 20; k++) {
    const n = 2 ** k;
    assert.strictEqual(evalRecurrence({ a: 2, b: 2, f: m => m }, n), n * k + n);   // n log n + n
    assert.strictEqual(evalRecurrence({ a: 1, b: 2, f: () => 1 }, n), k + 1);     // log n + 1
  }

  const table = growthTable([10, 1000]);
  assert.strictEqual(table[0].n2, 100);
  assert.strictEqual(table[1].two_n, 2 ** 1000);
  near(table[1].log2n, 9.966, 0.001);

  // formal definition: 3n^2 + 10n + 5 is O(n^2) with c = 4, n0 = 11
  const f = n => 3 * n * n + 10 * n + 5;
  const ns = Array.from({ length: 1000 }, (_, i) => i + 1);
  assert.ok(isBoundedBy(f, n => n * n, 4, 11, ns));
  assert.ok(!isBoundedBy(f, n => n * n, 4, 1, ns), 'n0 matters: fails for small n');
  assert.ok(!isBoundedBy(f, n => n, 1000, 1, ns), 'not O(n) for any c (fails eventually)');

  const r = mulberry32(1), r2 = mulberry32(1);
  assert.strictEqual(r(), r2());

  if (process.argv.includes('--table')) console.table(growthTable());
  console.log('✓ growth.js self-test passed');
}

module.exports = { doublingRatio, estimateExponent, masterTheorem, evalRecurrence, growthTable, isBoundedBy, mulberry32 };
