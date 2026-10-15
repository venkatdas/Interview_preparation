/**
 * 16. Find the Duplicate Number (bit counting version)   (LeetCode 287 — Medium)
 *
 * PROBLEM
 * nums has n + 1 integers, each in [1, n]. Exactly one number is repeated (possibly many
 * times). Find it WITHOUT modifying the array and using O(1) extra space.
 *
 * EXAMPLES
 * Input: [1,3,4,2,2]   Output: 2
 * Input: [3,1,3,4,2]   Output: 3
 * Input: [3,3,3,3,3]   Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I sort or use a Set? (no: read-only, O(1) space)
 * - Exactly one value repeats? (yes, but it may repeat more than twice)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each element, scan the rest for an equal one.
 *
 * APPROACH 2 — Optimal (count 1 bits per column vs the "ideal" 1..n)   O(32 n) time, O(1) space
 * Imagine the array were exactly [1, 2, ..., n] (no duplicate). For each bit position, count
 * how many of 1..n have that bit set: call it `baseCount`. Now count in the real array:
 * `actualCount`. The real array = {1..n} with ONE value replaced (several times) by the
 * duplicate. If actualCount > baseCount at bit i, the duplicate has bit i set: every extra
 * copy of it adds 1s to the columns where it has 1s, and the values it replaced contribute
 * fewer 1s in total only if the duplicate's bit is set there. Build the duplicate bit by bit.
 * (Floyd's cycle detection is the other famous O(n) solution - see 15_Linked_Lists/.)
 *
 * Dry run on [1,3,4,2,2] (n = 4; ideal {1,2,3,4} = 001,010,011,100):
 *   bit0: base = 2 (1,3), actual = 2 (1,3)      -> not > -> 0
 *   bit1: base = 2 (2,3), actual = 3 (3,2,2)    -> >  -> set
 *   bit2: base = 1 (4),   actual = 1 (4)        -> 0
 *   duplicate = 010 = 2
 *
 * EDGE CASES
 * - duplicate appears more than twice -> still works (more extra 1s)
 * - n = 1: [1,1] -> 1
 * - duplicate is n (the largest value)
 */

function bruteForce(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return nums[i];
    }
  }
  return -1;
}

function optimal(nums) {
  const n = nums.length - 1;
  let duplicate = 0;
  for (let bit = 0; bit < 32; bit++) {
    const flag = 1 << bit;
    let baseCount = 0;
    let actualCount = 0;
    for (let value = 1; value <= n; value++) if (value & flag) baseCount++;
    for (const num of nums) if (num & flag) actualCount++;
    if (actualCount > baseCount) duplicate |= flag; // the extra 1s come from the duplicate
  }
  return duplicate;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 4, 2, 2]), 2);
  assert.strictEqual(solve([3, 1, 3, 4, 2]), 3);
  assert.strictEqual(solve([3, 3, 3, 3, 3]), 3);
  assert.strictEqual(solve([1, 1]), 1);
  assert.strictEqual(solve([2, 2, 2, 1]), 2);
  assert.strictEqual(solve([1, 2, 3, 4, 5, 5]), 5);
  assert.strictEqual(solve([4, 1, 4, 2, 3]), 4);
}
console.log('✓ 16-find-the-duplicate-number passed');

module.exports = { optimal, bruteForce };
