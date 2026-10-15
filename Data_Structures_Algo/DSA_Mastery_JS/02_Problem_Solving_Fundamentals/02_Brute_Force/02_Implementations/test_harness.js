/**
 * Random testing harness: brute force as a TEST ORACLE.
 *
 * compareWithOracle(fast, brute, gen, options)
 *   - runs `runs` random SMALL inputs from gen(rnd) through both functions
 *   - on the first disagreement, SHRINKS the input to a minimal failing one
 *     (options.valid restricts shrinking to legal inputs, e.g. non-empty arrays)
 *   - returns { ok: true, runs } or { ok: false, seed, iteration, input, minimal, fastOut, bruteOut }
 *
 * WHY seeded: the same seed reproduces the same inputs, so a failure can be replayed.
 * WHY small inputs: the brute force stays fast and edge cases (empty, duplicates,
 * negatives, zeros) show up constantly.
 * WHY shrink: a 2-element counterexample explains the bug; a 9-element one hides it.
 */

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const randInt = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1)); // inclusive

function randomIntArray(rnd, minLen = 0, maxLen = 8, lo = -5, hi = 5) {
  return Array.from({ length: randInt(rnd, minLen, maxLen) }, () => randInt(rnd, lo, hi));
}

function randomString(rnd, minLen = 0, maxLen = 8, alphabet = 'abc') {
  return Array.from({ length: randInt(rnd, minLen, maxLen) }, () => alphabet[randInt(rnd, 0, alphabet.length - 1)]).join('');
}

// Deep comparison for outputs (arrays, objects, primitives, NaN-safe).
function sameOutput(x, y) {
  try { require('assert').deepStrictEqual(x, y); return true; } catch { return false; }
}

// Greedy shrinking for arrays of numbers: repeatedly try smaller variants that still fail.
// `valid` keeps shrinking inside the input domain (e.g. "non-empty arrays only").
function shrinkArray(input, fails, valid = () => true) {
  const tryCand = cand => valid(cand) && fails(cand);
  let cur = [...input];
  let improved = true;
  while (improved) {
    improved = false;
    // 1. remove one element
    for (let i = 0; i < cur.length && !improved; i++) {
      const cand = cur.slice(0, i).concat(cur.slice(i + 1));
      if (tryCand(cand)) { cur = cand; improved = true; }
    }
    // 2. move one value toward 0
    for (let i = 0; i < cur.length && !improved; i++) {
      const v = cur[i];
      if (typeof v !== 'number' || v === 0) continue;
      for (const w of [0, Math.trunc(v / 2) + 0, v - Math.sign(v)]) { // + 0 avoids -0
        if (w === v) continue;
        const cand = [...cur]; cand[i] = w;
        if (tryCand(cand)) { cur = cand; improved = true; break; }
      }
    }
  }
  return cur;
}

function compareWithOracle(fast, brute, gen, { runs = 1000, seed = 1, args = x => [x], compare = sameOutput, shrink = shrinkArray, valid = () => true } = {}) {
  const rnd = mulberry32(seed);
  const fails = input => {
    let f, b;
    try { f = fast(...args(input)); } catch (e) { f = 'threw ' + e.message; }
    b = brute(...args(input));
    return !compare(f, b);
  };
  for (let iteration = 0; iteration < runs; iteration++) {
    const input = gen(rnd);
    if (fails(input)) {
      const minimal = Array.isArray(input) && shrink ? shrink(input, fails, valid) : input;
      let fastOut;
      try { fastOut = fast(...args(minimal)); } catch (e) { fastOut = 'threw ' + e.message; }
      return { ok: false, seed, iteration, input, minimal, fastOut, bruteOut: brute(...args(minimal)) };
    }
  }
  return { ok: true, runs };
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // deterministic
  const r1 = mulberry32(7), r2 = mulberry32(7);
  assert.deepStrictEqual(randomIntArray(r1), randomIntArray(r2));
  const r3 = mulberry32(8);
  for (let t = 0; t < 200; t++) {
    const a = randomIntArray(r3, 2, 4, -1, 1);
    assert.ok(a.length >= 2 && a.length <= 4 && a.every(x => x >= -1 && x <= 1));
    assert.ok(/^[ab]{0,3}$/.test(randomString(r3, 0, 3, 'ab')));
  }

  // a correct fast function passes
  const bruteMax = a => { let best = -Infinity; for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; best = Math.max(best, s); } } return best; };
  const kadane = a => { let best = -Infinity, cur = 0; for (const x of a) { cur = Math.max(x, cur + x); best = Math.max(best, cur); } return best; };
  assert.deepStrictEqual(compareWithOracle(kadane, bruteMax, rnd => randomIntArray(rnd), { runs: 2000 }), { ok: true, runs: 2000 });

  // a buggy one is caught and shrunk to a tiny counterexample
  const buggy = a => { let best = 0, cur = 0; for (const x of a) { cur = Math.max(0, cur + x); best = Math.max(best, cur); } return best; };
  const res = compareWithOracle(buggy, bruteMax, rnd => randomIntArray(rnd, 1, 8), { runs: 2000, seed: 3, valid: a => a.length >= 1 });
  assert.strictEqual(res.ok, false);
  assert.deepStrictEqual(res.minimal, [-1]);
  assert.strictEqual(res.fastOut, 0);
  assert.strictEqual(res.bruteOut, -1);

  // exceptions in the fast function count as failures
  const throwsOnEmpty = a => { if (!a.length) throw new Error('empty'); return a.length; };
  const res2 = compareWithOracle(throwsOnEmpty, a => a.length, rnd => randomIntArray(rnd, 0, 3), { runs: 500 });
  assert.strictEqual(res2.ok, false);
  assert.deepStrictEqual(res2.minimal, []);

  console.log('✓ test_harness.js self-test passed');
}

module.exports = { mulberry32, randInt, randomIntArray, randomString, sameOutput, shrinkArray, compareWithOracle };
