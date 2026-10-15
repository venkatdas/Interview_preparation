/**
 * 05. Implement Rand10() Using Rand7()   (LeetCode 470 — Medium)
 *
 * PROBLEM
 * You are given rand7(), which returns a uniform integer in 1..7. Using only
 * rand7 (no Math.random), write rand10() returning a uniform integer in 1..10.
 * Follow-ups: what is the expected number of rand7 calls? Can you lower it?
 *
 * EXAMPLES
 * rand10() -> 3   (any of 1..10, each with probability 1/10)
 * Over 100,000 calls, every value appears about 10,000 times.
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is rand7 truly uniform and independent per call? (assume yes)
 * - Is "expected" call count fine, or do we need a hard worst-case bound? (expected; worst case is unbounded)
 *
 * APPROACH 1 — Brute force (combine rand2 and rand5)   expected ~2.57 rand7 calls
 * rand5: roll rand7 until <= 5   (expected 7/5 = 1.4 calls)
 * rand2: roll rand7 until <= 6, take parity   (expected 7/6 ~ 1.17 calls)
 * answer = rand5 + 5 * (rand2 - 1)  -> 10 equally likely values.
 * Correct, but wasteful.
 *
 * APPROACH 2 — Optimal (rejection sampling on a 7x7 grid)   expected 2.45 rand7 calls, O(1) space
 * Two rolls give a cell index (r1-1)*7 + r2 uniform over 1..49. The first 40
 * cells are 4 full copies of 1..10, so keep cell c <= 40 and return 1 + (c-1) % 10.
 * Reject 41..49 and roll again.
 * Rounds ~ Geometric(p = 40/49), expected rounds = 49/40, calls = 2 * 49/40 = 2.45.
 * [Advanced] Re-use the rejected value (uniform 1..9) as a new "rand9" and combine with
 * another rand7 -> ~2.19 expected calls (see rand10Reuse below).
 *
 * Dry run (rolls 6, 7 then 3, 2):
 *   c = (6-1)*7 + 7 = 42 > 40 -> reject
 *   c = (3-1)*7 + 2 = 16 <= 40 -> return 1 + 15 % 10 = 6
 *
 * EDGE CASES
 * - (r1 - 1) * 7 + r2, NOT r1 * r2: products are not uniform (12 appears 4 ways, 49 once)
 * - rand7() + rand7() is not uniform either (sums peak in the middle)
 * - never use Math.random inside rand10 — only rand7
 */
const { mulberry32, makeRand7, looksUniform } = require('../../02_Implementations/randomization');

function bruteForce(rand7) {
  let a;
  do a = rand7(); while (a > 5); // uniform 1..5
  let b;
  do b = rand7(); while (b > 6); // uniform 1..6, parity is a fair coin
  return a + 5 * (b % 2); // 1..5 or 6..10
}

function optimal(rand7) {
  for (;;) {
    const c = (rand7() - 1) * 7 + rand7(); // uniform 1..49
    if (c <= 40) return 1 + ((c - 1) % 10);
  }
}

function rand10Reuse(rand7) {
  for (;;) {
    let a = (rand7() - 1) * 7 + rand7(); // 1..49
    if (a <= 40) return 1 + ((a - 1) % 10);
    a -= 40; // 1..9 uniform
    let b = (a - 1) * 7 + rand7(); // 1..63
    if (b <= 60) return 1 + ((b - 1) % 10);
    b -= 60; // 1..3 uniform
    const c = (b - 1) * 7 + rand7(); // 1..21
    if (c <= 20) return 1 + ((c - 1) % 10);
  }
}

// ---------- tests ----------
const assert = require('assert');
const rng = mulberry32(470);
const N = 50000;
const expectedCalls = { bruteForce: 7 / 5 + 7 / 6, optimal: 2.45, rand10Reuse: 2.1955 };
for (const [name, fn] of [['bruteForce', bruteForce], ['optimal', optimal], ['rand10Reuse', rand10Reuse]]) {
  let calls = 0;
  const base = makeRand7(rng);
  const rand7 = () => { calls++; return base(); };
  const counts = new Array(10).fill(0);
  for (let t = 0; t < N; t++) {
    const v = fn(rand7);
    assert.ok(Number.isInteger(v) && v >= 1 && v <= 10);
    counts[v - 1]++;
  }
  assert.ok(looksUniform(counts), `${name} not uniform: ${counts}`);
  assert.ok(Math.abs(calls / N - expectedCalls[name]) < 0.1, `${name} avg calls ${calls / N}`);
}

// a scripted rand7 replays the dry run exactly
const script = [6, 7, 3, 2];
let k = 0;
assert.strictEqual(optimal(() => script[k++]), 6);
assert.strictEqual(k, 4);

// the WRONG idea r1 * r2 is visibly non-uniform over 1..49
const prodCounts = new Map();
for (let r1 = 1; r1 <= 7; r1++) for (let r2 = 1; r2 <= 7; r2++) prodCounts.set(r1 * r2, (prodCounts.get(r1 * r2) || 0) + 1);
assert.strictEqual(prodCounts.get(12), 4); // 2*6, 6*2, 3*4, 4*3
assert.strictEqual(prodCounts.get(49), 1); // only 7*7
assert.strictEqual(prodCounts.has(11), false); // 11 is prime > 7: impossible
console.log('✓ 05_rand10_using_rand7 passed');

module.exports = { optimal, bruteForce, rand10Reuse };
