/**
 * 03. Next Larger Digit Arrangement   (Original — Medium)
 *
 * PROBLEM
 * Given a string of decimal digits (may contain repeated digits and leading zeros),
 * return the smallest arrangement of the SAME digits that is strictly larger (compared
 * as numbers of the same length, i.e. lexicographically). If none exists, return null.
 *
 * EXAMPLES
 * Input: "1243"   Output: "1324"
 * Input: "4321"   Output: null     (already the largest)
 * Input: "1122"   Output: "1212"
 * Input: "0091"   Output: "0109"
 * Input: "7"      Output: null
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 1e5 for the optimal; brute force only for length <= 8 (8! = 40320).
 * - Keep leading zeros? (yes, same length string)
 *
 * APPROACH 1 — Brute force (all permutations)   O(n · n!) time
 * Generate all distinct permutations of the digits (sorted order, duplicates skipped),
 * and return the first one that is greater than the input. Since they come out in
 * increasing order, the first greater one is the smallest greater one.
 *
 * APPROACH 2 — Optimal (next permutation)   O(n) time, O(n) space for the char array
 * 1. From the right, find the first index i with s[i] < s[i+1] (the "pivot"). If none: null.
 *    Everything right of i is non-increasing: it is already the largest arrangement of that suffix.
 * 2. From the right, find the first j with s[j] > s[i]; swap them (smallest increase at position i).
 * 3. Reverse the suffix after i to make it the smallest (non-decreasing).
 *
 * Dry run "1243":
 *   pivot: '4' > '3' no, '2' < '4' -> i = 1
 *   rightmost digit > '2': '3' at j = 3 -> swap -> "1342"
 *   reverse suffix after i: "42" -> "24" -> "1324"
 *
 * EDGE CASES
 * - all digits equal ("777") -> null
 * - single digit -> null
 * - repeated digits: use strict > when searching j
 *
 * COMMON MISTAKES
 * - Sorting the suffix (O(n log n)) instead of reversing (it is already reverse-sorted).
 * - Using >= when searching j (swaps equal digits, result not larger).
 * - Converting to Number (precision loss beyond 15 digits; also loses leading zeros).
 */
const { permutations } = require('../../02_Implementations/enumeration');
const { mulberry32 } = require('../../02_Implementations/test_harness');

function bruteForce(s) {
  for (const p of permutations(s.split(''))) {
    const cand = p.join('');
    if (cand > s) return cand; // same length strings: lexicographic = numeric order
  }
  return null;
}

function optimal(s) {
  const d = s.split('');
  let i = d.length - 2;
  while (i >= 0 && d[i] >= d[i + 1]) i--;
  if (i < 0) return null;
  let j = d.length - 1;
  while (d[j] <= d[i]) j--;
  [d[i], d[j]] = [d[j], d[i]];
  for (let l = i + 1, r = d.length - 1; l < r; l++, r--) [d[l], d[r]] = [d[r], d[l]];
  return d.join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('1243'), '1324');
  assert.strictEqual(solve('4321'), null);
  assert.strictEqual(solve('1122'), '1212');
  assert.strictEqual(solve('0091'), '0109');
  assert.strictEqual(solve('7'), null);
  assert.strictEqual(solve('777'), null);
}
assert.strictEqual(optimal('1' + '9'.repeat(99999)), '9' + '1' + '9'.repeat(99998));
const rand = mulberry32(603);
for (let t = 0; t < 2000; t++) {
  const s = Array.from({ length: 1 + Math.floor(rand() * 7) }, () => String(Math.floor(rand() * 4))).join('');
  assert.strictEqual(optimal(s), bruteForce(s), s);
}
console.log('✓ 03_next_larger_arrangement passed');

module.exports = { optimal, bruteForce };
