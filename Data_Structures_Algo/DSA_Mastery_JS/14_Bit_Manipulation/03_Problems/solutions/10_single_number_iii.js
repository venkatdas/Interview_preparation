/**
 * 10. Single Number III   (LeetCode 260 — Medium)
 *
 * PROBLEM
 * Every element appears exactly twice except TWO elements, which appear once each.
 * Return the two single elements, in any order. O(n) time, O(1) space.
 *
 * EXAMPLES
 * Input: [1,2,1,3,2,5]   Output: [3,5]
 * Input: [-1,0]          Output: [-1,0]
 * Input: [0,1]           Output: [0,1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly two singles? (yes)
 * - Order of output? (any; tests sort it)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Hash map counts, collect keys with count 1.
 *
 * APPROACH 2 — Optimal (XOR, then split on a differing bit)   O(n) time, O(1) space
 * 1. XOR everything -> x ^ y (pairs cancel). Call it `xor`. It is non-zero because x !== y.
 * 2. Pick any set bit of `xor`: the lowest one is `xor & -xor`. At that bit, x and y DIFFER.
 * 3. Split the array into two groups by that bit. x is in one group, y in the other, and
 *    every pair lands in the same group (equal numbers have equal bits). XOR each group
 *    separately -> x and y.
 *
 * Dry run on [1,2,1,3,2,5]:
 *   xor = 3 ^ 5 = 011 ^ 101 = 110 (6)
 *   lowest set bit = 010 (2)
 *   group with bit1 set:   2, 2, 3  -> 3
 *   group with bit1 clear: 1, 1, 5  -> 5   -> [3,5]
 *
 * EDGE CASES
 * - just two elements -> themselves
 * - negatives: xor & -xor still isolates a bit; for xor = -2^31, -xor overflows back to
 *   -2^31 and the AND still yields that single bit, so it is safe
 */

function bruteForce(nums) {
  const counts = new Map();
  for (const num of nums) counts.set(num, (counts.get(num) || 0) + 1);
  const singles = [];
  for (const [num, count] of counts) if (count === 1) singles.push(num);
  return singles;
}

function optimal(nums) {
  let xor = 0;
  for (const num of nums) xor ^= num;        // = x ^ y

  const splitBit = xor & -xor;               // a bit where x and y differ

  let first = 0;
  let second = 0;
  for (const num of nums) {
    if (num & splitBit) first ^= num;        // group A: bit set
    else second ^= num;                      // group B: bit clear
  }
  return [first, second];
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (arr) => [...arr].sort((a, b) => a - b);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve([1, 2, 1, 3, 2, 5])), [3, 5]);
  assert.deepStrictEqual(sorted(solve([-1, 0])), [-1, 0]);
  assert.deepStrictEqual(sorted(solve([0, 1])), [0, 1]);
  assert.deepStrictEqual(sorted(solve([4, 4, 7, 9, 9, -3])), [-3, 7]);
  assert.deepStrictEqual(sorted(solve([2, 3])), [2, 3]);
  assert.deepStrictEqual(sorted(solve([10, 20, 10, 30, 30, 40])), [20, 40]);
}
console.log('✓ 10-single-number-iii passed');

module.exports = { optimal, bruteForce };
