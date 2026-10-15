/**
 * 15. Maximum XOR of Two Numbers in an Array   (LeetCode 421 — Medium)
 *
 * PROBLEM
 * Return the maximum value of nums[i] XOR nums[j] over all 0 <= i <= j < n.
 *
 * EXAMPLES
 * Input: [3,10,5,25,2,8]   Output: 28   Explanation: 5 ^ 25 = 28
 * Input: [14,70,53,83,49,91,36,80,92,51,66,70]   Output: 127
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-negative numbers < 2^31? (yes)
 * - n up to 2 * 10^5 -> O(n^2) is too slow
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try every pair.
 *
 * APPROACH 2 — Optimal (bit-by-bit greedy with a prefix set)   O(32 n) time, O(n) space
 * Build the answer from the most significant bit down. Suppose we already know the best
 * answer restricted to the top k bits (call it `best`). Can we also set bit k+1? Be greedy:
 * `candidate = best | (1 << bit)`. Collect every number's top-(k+1)-bit prefix into a set.
 * Because a ^ b = candidate  <=>  a ^ candidate = b, we can check in O(1) per prefix whether
 * SOME pair produces `candidate`: for each prefix p, ask if (p ^ candidate) is in the set.
 * If yes, keep the bit; else leave it 0. Higher bits dominate, so grabbing each one as early
 * as possible is optimal (a 1 at bit k beats any combination of lower bits).
 *
 * Dry run on [3,5] (3 = 011, 5 = 101), pretending numbers are 3 bits wide, bits 2..0:
 *   bit2: mask 100, prefixes {000, 100}, candidate 100: 000^100 = 100 in set -> best = 100
 *   bit1: mask 110, prefixes {010, 100}, candidate 110: 010^110 = 100 in set -> best = 110
 *   bit0: mask 111, prefixes {011, 101}, candidate 111: 011^111 = 100 no, 101^111 = 010 no -> best stays 110
 *   best = 110 = 6 = 3 ^ 5 -> correct
 *
 * EDGE CASES
 * - single element -> 0 (x ^ x)
 * - all equal -> 0
 * - contains 0 -> max is the largest element's XOR with something, often itself vs 0
 */

function bruteForce(nums) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) best = Math.max(best, nums[i] ^ nums[j]);
  }
  return best;
}

function optimal(nums) {
  let best = 0;
  let mask = 0;
  for (let bit = 30; bit >= 0; bit--) {    // values < 2^31, so bit 30 is the top data bit
    mask |= 1 << bit;                      // mask now keeps bits [bit..30]
    const prefixes = new Set();
    for (const num of nums) prefixes.add(num & mask);

    const candidate = best | (1 << bit);   // greedily hope this bit can be 1
    for (const prefix of prefixes) {
      if (prefixes.has(prefix ^ candidate)) { // a ^ b = candidate  <=>  a ^ candidate = b
        best = candidate;
        break;
      }
    }
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 10, 5, 25, 2, 8]), 28);
  assert.strictEqual(solve([14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]), 127);
  assert.strictEqual(solve([0]), 0);
  assert.strictEqual(solve([7, 7, 7]), 0);
  assert.strictEqual(solve([3, 5]), 6);
  assert.strictEqual(solve([0, 2 ** 30]), 2 ** 30);
  assert.strictEqual(solve([1, 2, 4, 8]), 12);
}
console.log('✓ 15-maximum-xor-of-two-numbers passed');

module.exports = { optimal, bruteForce };
