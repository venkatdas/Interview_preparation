/**
 * 03. Four Divisors   (LeetCode 1390 — Medium)
 *
 * PROBLEM
 * Given an array nums, return the sum of the divisors of every number that has
 * EXACTLY four divisors. Numbers with any other divisor count contribute 0.
 *
 * EXAMPLES
 * Input: [21, 4, 7]   Output: 32   (21 -> 1+3+7+21 = 32; 4 has 3 divisors; 7 has 2)
 * Input: [21, 21]     Output: 64
 * Input: [1,2,3,4,5]  Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= nums.length <= 10^4, 1 <= nums[i] <= 10^5. Duplicates count each time.
 *
 * APPROACH 1 — Brute force   O(n sqrt V) time, O(1) space
 * For each number enumerate divisors in pairs (d, x/d) up to sqrt(x); stop early past 4.
 *
 * APPROACH 2 — Optimal (smallest-prime-factor sieve + structure)   O(V + n log V) time, O(V) space
 * d(x) = prod(e_i + 1) = 4 happens only when
 *   x = p^3           (3 + 1 = 4)          divisors 1, p, p^2, p^3
 *   x = p * q, p != q (1+1)(1+1) = 4       divisors 1, p, q, pq  -> sum (1+p)(1+q)
 * With spf we read p = spf[x], then check the rest in O(1).
 *
 * Dry run on [21, 8, 12]:
 *   21: p=3, rest=7, spf[7]=7 is prime and 7 != 3     -> (1+3)(1+7) = 32
 *    8: p=2, rest=4, 4 == p*p (so x = p^3)            -> 1+2+4+8 = 15
 *   12: p=2, rest=6 not prime and not p^2              -> 0
 *   total 47
 *
 * EDGE CASES
 * - 1 and primes contribute 0;  p^2 (3 divisors) contributes 0;  p^4 contributes 0.
 */

function bruteForce(nums) {
  let total = 0;
  for (const x of nums) {
    let cnt = 0, sum = 0;
    for (let d = 1; d * d <= x && cnt <= 4; d++) {
      if (x % d !== 0) continue;
      cnt++; sum += d;
      if (d !== x / d) { cnt++; sum += x / d; }
    }
    if (cnt === 4) total += sum;
  }
  return total;
}

function optimal(nums) {
  const max = Math.max(1, ...nums);
  const spf = new Int32Array(max + 1);
  for (let i = 2; i <= max; i++) {
    if (spf[i] !== 0) continue;
    for (let j = i; j <= max; j += i) if (spf[j] === 0) spf[j] = i;
  }
  let total = 0;
  for (const x of nums) {
    if (x < 6) continue; // smallest four-divisor number is 6
    const p = spf[x];
    const rest = x / p;
    if (rest === p * p) total += 1 + p + p * p + x;           // x = p^3
    else if (rest !== p && spf[rest] === rest) total += (1 + p) * (1 + rest); // x = p*q
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([21, 4, 7]), 32);
  assert.strictEqual(solve([21, 21]), 64);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 0);
  assert.strictEqual(solve([8]), 15);
  assert.strictEqual(solve([6]), 12);
  assert.strictEqual(solve([16, 81]), 0); // p^4
  assert.strictEqual(solve([21, 8, 12]), 47);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(1390);
for (let t = 0; t < 200; t++) {
  const arr = Array.from({ length: 1 + Math.floor(rng() * 50) }, () => 1 + Math.floor(rng() * 100000));
  assert.strictEqual(optimal(arr), bruteForce(arr));
}
console.log('✓ 03_four_divisors passed');

module.exports = { optimal, bruteForce };
