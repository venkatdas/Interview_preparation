/**
 * 15. Minimum Number of K Consecutive Bit Flips   (LeetCode 995 — Hard)
 *
 * PROBLEM
 * Given a binary array nums and an integer k, a "k-bit flip" picks a subarray of length
 * exactly k and flips every bit in it (0 -> 1, 1 -> 0). Return the minimum number of
 * k-bit flips so that the array contains no 0s, or -1 if impossible.
 *
 * EXAMPLES
 * Input: nums = [0, 1, 0], k = 1             Output: 2
 * Input: nums = [1, 1, 0], k = 2             Output: -1   Explanation: flipping [1,0] gives [0,1]; no way to fix both
 * Input: nums = [0, 0, 0, 1, 0, 1, 1, 0], k = 3   Output: 3
 *   Explanation: flip [0..2] -> 1,1,1,1,0,1,1,0 ; flip [4..6] -> 1,1,1,1,1,0,0,0 ; flip [5..7] -> all ones
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Flips must be exactly length k and within bounds? (yes)
 * - n up to 10^5 -> O(n * k) simulation is too slow
 * - Modifying the input allowed? (ask; the version below does not)
 *
 * The greedy insight: scan left to right. The leftmost 0 MUST be fixed by a flip that
 * starts exactly there (any flip starting earlier was already decided; starting later
 * leaves this 0 alone). So: whenever the CURRENT bit (after all flips so far) is 0,
 * flip [i, i + k - 1]. Greedy is optimal because every flip is forced.
 *
 * APPROACH 1 — Brute force (greedy with real flipping)   O(n * k) time, O(n) space
 * Same greedy, but physically flip the k bits each time. Correct, too slow for big k.
 *
 * APPROACH 2 — Optimal (sliding window of active flips)   O(n) time, O(n) space
 * We don't need to flip bits; we need to know how many flips currently COVER index i.
 * A flip that started at index j covers i while i - j < k, i.e. j > i - k.
 * Keep `activeFlips` = number of flips whose window still includes i. Track where flips
 * started in an array `flippedAt[j]` (1 if a flip started at j). As i moves right,
 * the flip that started at i - k (if any) expires: activeFlips -= flippedAt[i - k].
 * The effective bit at i is nums[i] XOR (activeFlips % 2). If it is 0:
 *   - if i + k > n -> impossible, return -1
 *   - start a flip here: flippedAt[i] = 1, activeFlips++, count++
 *
 * Dry run on [0, 0, 0, 1, 0, 1, 1, 0], k = 3:
 *   i=0 active 0, bit 0 -> flip at 0 (active 1, count 1)
 *   i=1 active 1, bit 0^1=1 ok | i=2 active 1, bit 1 ok
 *   i=3 flip from 0 expires (active 0), bit 1 ok
 *   i=4 active 0, bit 0 -> flip at 4 (active 1, count 2)
 *   i=5 bit 1^1=0 -> flip at 5 (active 2, count 3)
 *   i=6 bit 1^0=1 ok (active 2 -> parity 0)
 *   i=7 flip from 4 expires (active 1), bit 0^1=1 ok
 *   count 3
 *
 * EDGE CASES
 * - Already all ones -> 0
 * - k = 1 -> number of zeros
 * - A zero too close to the end to fit a flip -> -1
 * - k === n -> at most one flip; possible only if all equal
 */

function bruteForce(nums, k) {
  const bits = [...nums];
  let flips = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === 0) {
      if (i + k > bits.length) return -1;
      for (let j = i; j < i + k; j++) bits[j] ^= 1; // physically flip k bits
      flips++;
    }
  }
  return flips;
}

function optimal(nums, k) {
  const n = nums.length;
  const flippedAt = new Array(n).fill(0); // 1 if a flip STARTS at this index
  let activeFlips = 0;                    // flips whose k-window still covers index i
  let flips = 0;

  for (let i = 0; i < n; i++) {
    if (i >= k) activeFlips -= flippedAt[i - k]; // the flip started k steps ago no longer covers i

    const effectiveBit = nums[i] ^ (activeFlips % 2);
    if (effectiveBit === 0) {
      if (i + k > n) return -1;           // not enough room for a flip here
      flippedAt[i] = 1;
      activeFlips++;
      flips++;
    }
  }
  return flips;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([0, 1, 0], 1), 2);
  assert.strictEqual(solve([1, 1, 0], 2), -1);
  assert.strictEqual(solve([0, 0, 0, 1, 0, 1, 1, 0], 3), 3);
  assert.strictEqual(solve([1, 1, 1], 2), 0);
  assert.strictEqual(solve([0, 0, 0, 0], 4), 1);
  assert.strictEqual(solve([0, 1, 0, 1], 4), -1);
  assert.strictEqual(solve([0], 1), 1);
  assert.strictEqual(solve([0, 0, 1, 1, 0, 0], 2), 2);
}
console.log('✓ 15-min-k-consecutive-bit-flips passed');

module.exports = { optimal, bruteForce };
