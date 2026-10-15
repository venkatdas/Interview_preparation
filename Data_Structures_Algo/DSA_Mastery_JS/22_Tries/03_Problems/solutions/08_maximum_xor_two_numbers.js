/**
 * 08. Maximum XOR of Two Numbers in an Array   (LeetCode 421 — Medium)
 *
 * PROBLEM
 * Given an integer array nums, return the maximum value of nums[i] XOR nums[j]
 * for any 0 <= i <= j < n.
 *
 * EXAMPLES
 * Input: [3,10,5,25,2,8]   Output: 28   Explanation: 5 XOR 25 = 28
 * Input: [14,70,53,83,49,91,36,80,92,51,66,70]   Output: 127
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values non-negative and < 2^31? (yes -> 31 bits is enough)
 * - Can i == j? (yes, gives 0; the answer is >= 0 always)
 * - Single element -> 0
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try every pair, keep the max XOR.
 *
 * APPROACH 2 — Optimal (Binary trie, greedy from top bit)   O(n * 31) time, O(n * 31) space
 * Insert every number into a bitwise trie (bits from most significant down).
 * For each number x, walk the trie greedily: at each bit prefer the child with
 * the OPPOSITE bit of x (that makes this bit of the XOR a 1). A 1 in a higher
 * bit always beats everything below, so greedy is correct.
 *
 * Dry run (4 bits) nums = [3 (0011), 10 (1010), 5 (0101)], query x = 5 (0101):
 *   bit3: x=0, want 1 -> 10 has 1 -> result 1000, follow 1
 *   bit2: x=1, want 0 -> 10 has 0 -> result 1100
 *   bit1: x=0, want 1 -> 10 has 1 -> result 1110
 *   bit0: x=1, want 0 -> 10 has 0 -> result 1111 = 15 = 5 ^ 10. Correct.
 *
 * EDGE CASES
 * - all equal numbers -> 0
 * - [0] -> 0
 * - very large values near 2^31 - 1
 */

const { BinaryTrie } = require('../../02_Implementations/binary_trie');

function bruteForce(nums) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) best = Math.max(best, nums[i] ^ nums[j]);
  }
  return best;
}

function optimal(nums) {
  const trie = new BinaryTrie(31);
  for (const num of nums) trie.insert(num);
  let best = 0;
  for (const num of nums) best = Math.max(best, trie.maxXor(num));
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 10, 5, 25, 2, 8]), 28);
  assert.strictEqual(solve([14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]), 127);
  assert.strictEqual(solve([0]), 0);
  assert.strictEqual(solve([7, 7, 7]), 0);
  assert.strictEqual(solve([2 ** 31 - 1, 0]), 2 ** 31 - 1);
  assert.strictEqual(solve([1, 2, 4, 8]), 12);
}
// random cross-check
for (let round = 0; round < 50; round++) {
  const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 1e6));
  assert.strictEqual(optimal(arr), bruteForce(arr));
}
console.log('✓ 08-maximum-xor-two-numbers passed');

module.exports = { optimal, bruteForce };
