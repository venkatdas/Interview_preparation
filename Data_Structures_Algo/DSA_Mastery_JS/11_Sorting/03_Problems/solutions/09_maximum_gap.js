/**
 * 09. Maximum Gap   (LeetCode 164 — Medium)
 *
 * PROBLEM
 * Given an unsorted integer array, return the maximum difference between two
 * successive elements in its SORTED form. Return 0 if fewer than 2 elements.
 * Follow-up: do it in linear time and linear space.
 *
 * EXAMPLES
 * Input: [3,6,9,1]   Output: 3   (sorted 1,3,6,9 -> gaps 2,3,3 -> 3)
 * Input: [10]        Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 10^5, values 0..10^9 (so counting sort on the value is NOT ok; bucket/radix is)
 * - Duplicates? (yes -> gap 0 between them)
 *
 * APPROACH 1 — Brute force (sort)   O(n log n) time
 * Sort, scan adjacent pairs, keep the max difference. Already fine for interviews;
 * the follow-up asks for O(n).
 *
 * APPROACH 2 — Optimal (bucket sort idea / pigeonhole)   O(n) time, O(n) space
 * Key insight: with n numbers spread over [min, max], the maximum gap is AT LEAST
 * (max - min) / (n - 1) (the average gap). So if we split the range into n - 1 buckets
 * of that width, the answer can never be between two numbers in the SAME bucket (that
 * gap would be smaller than the width). We only need, per bucket, its min and max,
 * then compare each bucket's min with the previous non-empty bucket's max.
 * (Radix sort followed by a scan is the other O(n) answer: O(d * n) with d = 10 digits.)
 *
 * Dry run [3,6,9,1]: min=1 max=9 n=4 -> width = ceil(8/3) = 3, buckets:
 *   idx = floor((v - min) / width): 1->0, 3->0, 6->1, 9->2
 *   bucket0 [min 1, max 3] bucket1 [6,6] bucket2 [9,9]
 *   gaps between buckets: 6 - 3 = 3, 9 - 6 = 3 -> answer 3
 *
 * EDGE CASES
 * - fewer than 2 elements -> 0
 * - all equal -> 0 (width would be 0: guard with Math.max(1, ...))
 * - two elements -> their difference
 */

function bruteForce(nums) {
  if (nums.length < 2) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  let best = 0;
  for (let i = 1; i < sorted.length; i++) best = Math.max(best, sorted[i] - sorted[i - 1]);
  return best;
}

function optimal(nums) {
  const n = nums.length;
  if (n < 2) return 0;
  let min = Infinity, max = -Infinity;
  for (const value of nums) { min = Math.min(min, value); max = Math.max(max, value); }
  if (min === max) return 0;

  const bucketCount = n - 1;
  const width = Math.max(1, Math.ceil((max - min) / bucketCount));   // avoid width 0
  const bucketMin = new Array(bucketCount + 1).fill(Infinity);        // +1: max lands in its own slot
  const bucketMax = new Array(bucketCount + 1).fill(-Infinity);

  for (const value of nums) {
    const index = Math.floor((value - min) / width);
    bucketMin[index] = Math.min(bucketMin[index], value);
    bucketMax[index] = Math.max(bucketMax[index], value);
  }

  let best = 0;
  let previousMax = min;                      // first bucket always contains `min`
  for (let b = 0; b <= bucketCount; b++) {
    if (bucketMin[b] === Infinity) continue;  // empty bucket: the gap just gets bigger
    best = Math.max(best, bucketMin[b] - previousMax);
    previousMax = bucketMax[b];
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 6, 9, 1]), 3);
  assert.strictEqual(solve([10]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1, 1, 1, 1]), 0);
  assert.strictEqual(solve([1, 10000000]), 9999999);
  assert.strictEqual(solve([1, 3, 100]), 97);
  assert.strictEqual(solve([2, 99999999]), 99999997);
  assert.strictEqual(solve([0, 0, 0, 5]), 5);
}
for (let trial = 0; trial < 300; trial++) {
  const input = Array.from({ length: Math.floor(Math.random() * 20) }, () => Math.floor(Math.random() * 1000));
  assert.strictEqual(optimal(input), bruteForce(input), JSON.stringify(input));
}
console.log('✓ 09-maximum-gap passed');

module.exports = { optimal, bruteForce };
