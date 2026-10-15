/**
 * 10. Find Peak Element   (LeetCode 162 — Medium)
 *
 * PROBLEM
 * A peak is an element strictly greater than its neighbours. Given an array where
 * nums[i] !== nums[i+1] for all i, return the index of ANY peak. Imagine
 * nums[-1] = nums[n] = -Infinity (the edges count as neighbours smaller than anything).
 * O(log n) required.
 *
 * EXAMPLES
 * Input: [1,2,3,1]         Output: 2   (3 is a peak)
 * Input: [1,2,1,3,5,6,4]   Output: 1 or 5   (two peaks, either is accepted)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Adjacent elements are never equal (otherwise "strictly greater" can fail everywhere)
 * - Any peak is fine? (yes)
 * - Unsorted input! Binary search still works because of the predicate below
 *
 * APPROACH 1 — Brute force   O(n)
 * Scan; return the first i with nums[i] > nums[i+1] (that is a peak, since all
 * previous elements were ascending). If none, the last element is a peak.
 *
 * APPROACH 2 — Optimal (binary search on the slope)   O(log n) time, O(1) space
 * Look at mid and mid + 1:
 *   nums[mid] < nums[mid+1] -> we are going UPHILL. A peak must exist to the right
 *     (either the climb continues to the end, which is a peak, or it turns down somewhere)
 *     -> left = mid + 1
 *   nums[mid] > nums[mid+1] -> going DOWNHILL. mid itself or something to the left is a peak
 *     -> right = mid
 * Loop while left < right. The predicate "slope goes up at i" is false then true... not
 * globally, but every time we discard a half we keep a half that provably has a peak.
 *
 * Dry run [1,2,1,3,5,6,4]:
 *   l=0 r=6 mid=3: 3 < 5 uphill -> l=4
 *   l=4 r=6 mid=5: 6 > 4 downhill -> r=5
 *   l=4 r=5 mid=4: 5 < 6 uphill -> l=5
 *   l === r === 5 -> index 5 (value 6) is a peak
 *
 * EDGE CASES
 * - single element -> 0
 * - strictly increasing -> last index; strictly decreasing -> 0
 * - two elements
 */

function bruteForce(nums) {
  for (let i = 0; i < nums.length - 1; i++) if (nums[i] > nums[i + 1]) return i;
  return nums.length - 1;
}

function optimal(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + ((right - left) >> 1);    // mid < right, so mid + 1 is in bounds
    if (nums[mid] < nums[mid + 1]) left = mid + 1;   // uphill: a peak lies to the right
    else right = mid;                                // downhill: mid or left of it is a peak
  }
  return left;
}

// ---------- tests ----------
const assert = require('assert');
function isPeak(nums, i) {
  const leftOk = i === 0 || nums[i] > nums[i - 1];
  const rightOk = i === nums.length - 1 || nums[i] > nums[i + 1];
  return leftOk && rightOk;
}
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 1]), 2);
  assert.ok([1, 5].includes(solve([1, 2, 1, 3, 5, 6, 4])));
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([1, 2]), 1);
  assert.strictEqual(solve([2, 1]), 0);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 4);
  assert.strictEqual(solve([5, 4, 3, 2, 1]), 0);
  assert.ok(isPeak([-3, -1, -2], solve([-3, -1, -2])));
}
for (let trial = 0; trial < 300; trial++) {
  // build an array with no equal neighbours
  const nums = [Math.floor(Math.random() * 10)];
  const n = 1 + Math.floor(Math.random() * 15);
  while (nums.length < n) {
    const next = Math.floor(Math.random() * 10);
    if (next !== nums[nums.length - 1]) nums.push(next);
  }
  assert.ok(isPeak(nums, optimal(nums)), JSON.stringify(nums));
}
console.log('✓ 10-find-peak-element passed');

module.exports = { optimal, bruteForce };
