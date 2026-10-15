/**
 * 05. Count Good Triplets in an Array   (LeetCode 2179 — Hard)
 *
 * PROBLEM
 * nums1 and nums2 are both permutations of [0..n-1]. A triplet of VALUES (x, y, z) is good
 * if x appears before y before z in nums1 AND x before y before z in nums2.
 * Return the number of good triplets.
 *
 * EXAMPLES
 * Input: nums1 = [2,0,1,3], nums2 = [0,1,2,3]   Output: 1
 *   triplets in nums1 order: (2,0,1),(2,0,3),(2,1,3),(0,1,3); only (0,1,3) is also ordered in nums2
 * Input: nums1 = [4,0,1,3,2], nums2 = [4,1,0,2,3]   Output: 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5 -> O(n^3) and O(n^2) are out; need O(n log n)
 * - Both are permutations, so each value appears exactly once in each -> we can map values
 *   to their position in nums2.
 *
 * APPROACH 1 — Brute force   O(n^3) time
 * Enumerate i < j < k in nums1 and check that the positions of those values in nums2 are
 * also increasing.
 *
 * APPROACH 2 — Optimal (Positions + two Fenwick passes)   O(n log n) time, O(n) space
 * Replace each value in nums1 by its index in nums2: pos[i] = indexInNums2(nums1[i]).
 * Now a good triplet is simply i < j < k with pos[i] < pos[j] < pos[k]: an increasing
 * triple in the array `pos`. Count by picking the MIDDLE element j:
 *   left[j]  = how many i < j have pos[i] < pos[j]   (Fenwick sweep left to right)
 *   right[j] = how many k > j have pos[k] > pos[j]   = (n - 1 - pos[j]) - (j - left[j])
 *              (values greater than pos[j] in total, minus the ones already to the left)
 *   answer = sum over j of left[j] * right[j]
 *
 * Dry run: nums1 = [2,0,1,3], nums2 = [0,1,2,3] -> pos = [2,0,1,3]
 *   j=0 pos=2: left=0, greaterTotal=1, greaterLeft=0-0=0 -> right=1 -> 0
 *   j=1 pos=0: left=0, greaterTotal=3, greaterLeft=1-0=1 -> right=2 -> 0
 *   j=2 pos=1: left=1 (pos 0), greaterTotal=2, greaterLeft=2-1=1 -> right=1 -> 1*1=1
 *   j=3 pos=3: left=3, greaterTotal=0 -> 0
 *   answer 1
 *
 * EDGE CASES
 * - n < 3 -> 0
 * - identical permutations -> C(n, 3)
 * - reversed permutations -> 0
 */

function bruteForce(nums1, nums2) {
  const n = nums1.length;
  const posIn2 = new Array(n);
  nums2.forEach((v, i) => { posIn2[v] = i; });
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (posIn2[nums1[i]] >= posIn2[nums1[j]]) continue;
      for (let k = j + 1; k < n; k++) {
        if (posIn2[nums1[j]] < posIn2[nums1[k]]) count++;
      }
    }
  }
  return count;
}

function optimal(nums1, nums2) {
  const n = nums1.length;
  const posIn2 = new Array(n);
  nums2.forEach((v, i) => { posIn2[v] = i; });
  const pos = nums1.map((v) => posIn2[v]);

  const tree = new Array(n + 1).fill(0);
  function add(index) {
    for (let i = index + 1; i <= n; i += i & -i) tree[i]++;
  }
  function prefixCount(index) {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += tree[i];
    return sum;
  }

  let total = 0;
  for (let j = 0; j < n; j++) {
    const left = prefixCount(pos[j] - 1);              // earlier indices with smaller pos
    const greaterTotal = n - 1 - pos[j];               // all values greater than pos[j]
    const greaterLeft = j - left;                      // of those, already seen on the left
    const right = greaterTotal - greaterLeft;
    total += left * right;
    add(pos[j]);
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 0, 1, 3], [0, 1, 2, 3]), 1);
  assert.strictEqual(solve([4, 0, 1, 3, 2], [4, 1, 0, 2, 3]), 4);
  assert.strictEqual(solve([0, 1], [0, 1]), 0);
  assert.strictEqual(solve([0, 1, 2, 3, 4], [0, 1, 2, 3, 4]), 10);   // C(5,3)
  assert.strictEqual(solve([0, 1, 2, 3], [3, 2, 1, 0]), 0);
  assert.strictEqual(solve([0, 1, 2], [0, 1, 2]), 1);
}
function randomPermutation(n) {
  const p = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p;
}
for (let trial = 0; trial < 50; trial++) {
  const n = Math.floor(Math.random() * 12);
  const a = randomPermutation(n);
  const b = randomPermutation(n);
  assert.strictEqual(optimal(a, b), bruteForce(a, b));
}
console.log('✓ 05-count-good-triplets-in-an-array passed');

module.exports = { optimal, bruteForce };
