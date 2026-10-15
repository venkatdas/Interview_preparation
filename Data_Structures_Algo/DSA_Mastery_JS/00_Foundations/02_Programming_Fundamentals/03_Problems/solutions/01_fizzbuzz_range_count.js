/**
 * 01. Count FizzBuzz in a Range   (Original — Easy)
 *
 * PROBLEM
 * Given two integers lo and hi (both inclusive) and two positive divisors a and b,
 * return an object { fizz, buzz, fizzbuzz, plain } counting the numbers x in [lo, hi]:
 *   - fizzbuzz: x divisible by both a and b
 *   - fizz:     x divisible by a only
 *   - buzz:     x divisible by b only
 *   - plain:    x divisible by neither
 * The four counts must add up to the number of integers in the range.
 *
 * EXAMPLES
 * Input: lo = 1, hi = 15, a = 3, b = 5
 * Output: { fizz: 4, buzz: 2, fizzbuzz: 1, plain: 8 }
 *   fizz = 3,6,9,12  buzz = 5,10  fizzbuzz = 15  plain = the other 8
 * Input: lo = 10, hi = 10, a = 3, b = 5   Output: { fizz: 0, buzz: 1, fizzbuzz: 0, plain: 0 }
 * Input: lo = 5,  hi = 4,  a = 3, b = 5   Output: all zeros (empty range)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are both ends inclusive? (yes)
 * - Can lo be greater than hi? (yes -> empty range, all zeros)
 * - Can the range contain 0 or negatives? (yes; 0 is divisible by everything)
 * - Can hi - lo be huge, like 1e15? (yes -> the loop is too slow, need a formula)
 * - Can a and b share factors, like 4 and 6? (yes -> "both" means divisible by lcm(a, b), not a*b)
 *
 * APPROACH 1 — Brute force   O(hi - lo) time, O(1) space
 * Loop x from lo to hi INCLUSIVE (x <= hi, the classic off-by-one spot) and classify
 * each number with two % checks.
 *
 * APPROACH 2 — Optimal (counting formula + inclusion–exclusion)   O(log min(a,b)) time, O(1) space
 * multiples(k) in [lo, hi] = floor(hi / k) - floor((lo - 1) / k)
 *   (Math.floor, not truncation, so it also works for negative numbers.)
 * both     = multiples(lcm(a, b))
 * fizz     = multiples(a) - both
 * buzz     = multiples(b) - both
 * plain    = (hi - lo + 1) - fizz - buzz - both
 *
 * Dry run lo = 1, hi = 15, a = 3, b = 5:
 *   multiples(3)  = floor(15/3)  - floor(0/3)  = 5
 *   multiples(5)  = floor(15/5)  - floor(0/5)  = 3
 *   lcm = 15, both = floor(15/15) - 0 = 1
 *   fizz = 5 - 1 = 4, buzz = 3 - 1 = 2, plain = 15 - 4 - 2 - 1 = 8
 *
 * EDGE CASES
 * - lo > hi                 -> all zeros (guard before computing hi - lo + 1)
 * - range containing 0      -> 0 counts as fizzbuzz
 * - negative lo             -> Math.trunc would be wrong; Math.floor is required
 * - a = 4, b = 6            -> both = multiples of 12, NOT 24
 * - a === b                 -> everything divisible is fizzbuzz
 *
 * COMMON MISTAKES
 * - Writing x < hi (drops the last number) or starting at lo + 1.
 * - Using a * b instead of lcm(a, b).
 * - Using hi / k - lo / k (off by one when lo itself is a multiple).
 */

function bruteForce(lo, hi, a, b) {
  const res = { fizz: 0, buzz: 0, fizzbuzz: 0, plain: 0 };
  for (let x = lo; x <= hi; x++) {
    const da = x % a === 0, db = x % b === 0;
    if (da && db) res.fizzbuzz++;
    else if (da) res.fizz++;
    else if (db) res.buzz++;
    else res.plain++;
  }
  return res;
}

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));

function optimal(lo, hi, a, b) {
  if (hi < lo) return { fizz: 0, buzz: 0, fizzbuzz: 0, plain: 0 };
  const multiples = k => Math.floor(hi / k) - Math.floor((lo - 1) / k);
  const lcm = (a / gcd(a, b)) * b; // divide first to keep numbers small
  const both = multiples(lcm);
  const fizz = multiples(a) - both;
  const buzz = multiples(b) - both;
  const plain = hi - lo + 1 - fizz - buzz - both;
  return { fizz, buzz, fizzbuzz: both, plain };
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(1, 15, 3, 5), { fizz: 4, buzz: 2, fizzbuzz: 1, plain: 8 });
  assert.deepStrictEqual(solve(10, 10, 3, 5), { fizz: 0, buzz: 1, fizzbuzz: 0, plain: 0 });
  assert.deepStrictEqual(solve(5, 4, 3, 5), { fizz: 0, buzz: 0, fizzbuzz: 0, plain: 0 });
  assert.deepStrictEqual(solve(0, 0, 3, 5), { fizz: 0, buzz: 0, fizzbuzz: 1, plain: 0 });
  assert.deepStrictEqual(solve(1, 12, 4, 6), { fizz: 2, buzz: 1, fizzbuzz: 1, plain: 8 });
}
// huge range only the formula can handle
assert.strictEqual(optimal(1, 1e15, 3, 5).fizzbuzz, Math.floor(1e15 / 15));

// randomized brute vs optimal (seeded)
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(1);
for (let t = 0; t < 500; t++) {
  const lo = Math.floor(rand() * 200) - 100, hi = lo + Math.floor(rand() * 120) - 10;
  const a = 1 + Math.floor(rand() * 9), b = 1 + Math.floor(rand() * 9);
  assert.deepStrictEqual(optimal(lo, hi, a, b), bruteForce(lo, hi, a, b), `${lo},${hi},${a},${b}`);
}
console.log('✓ 01_fizzbuzz_range_count passed');

module.exports = { optimal, bruteForce };
