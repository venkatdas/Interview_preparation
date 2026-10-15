/**
 * 06. Next Greater Element I & II   (LeetCode 496 — Easy, 503 — Medium)
 *
 * PROBLEM
 * Part I (496): nums1 is a subset of nums2 (no duplicates). For each x in nums1,
 * find the first element to the RIGHT of x in nums2 that is greater than x, or -1.
 *
 * Part II (503): a single CIRCULAR array. For each element, find the next greater
 * element going right and wrapping around to the start, or -1.
 *
 * EXAMPLES
 * I:  nums1 = [4,1,2], nums2 = [1,3,4,2]   Output: [-1,3,-1]
 *     4 has nothing greater after it; 1 -> 3; 2 is last -> -1
 * II: nums = [1,2,1]                      Output: [2,-1,2]
 *     the last 1 wraps around to find 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Part I: are values unique? (yes -> we can key a Map by value)
 * - Part II: "next" means the first greater element going right, with wrap-around?
 * - Strictly greater? (yes)
 *
 * APPROACH 1 — Brute force   O(n*m) / O(n^2) time
 * For each element scan rightwards (with wrap for part II) until something
 * greater appears.
 *
 * APPROACH 2 — Optimal (monotonic decreasing stack)   O(n) time, O(n) space
 * Part I: walk nums2 once with a decreasing stack. When nums2[i] is greater
 * than the top, the top's next greater is nums2[i]: record it in a Map
 * (value -> answer). Then answer nums1 by lookup.
 *
 * Part II: same stack of INDICES, but loop i from 0 to 2n-1 and use i % n.
 * The second lap lets elements near the end "see" elements at the start.
 * Only push indices during the first lap (second lap only resolves).
 *
 * Dry run (II) on [1,2,1], n=3, i = 0..5:
 *   i=0 (1)  push 0          stack [0]
 *   i=1 (2)  2>1 pop 0 ans[0]=2 ; push 1   stack [1]
 *   i=2 (1)  push 2          stack [1,2]
 *   i=3 (1)  not greater than 1 (top is index 2, value 1) -> nothing
 *   i=4 (2)  2>1 pop 2 ans[2]=2 ; 2>2? no  stack [1]
 *   i=5 (1)  nothing
 *   ans = [2,-1,2]
 *
 * EDGE CASES
 * - decreasing array -> all -1 (part I) / the max is -1 and the rest find the max (part II)
 * - all equal -> all -1
 * - single element
 */

// ---------- Part I ----------
function bruteForceI(nums1, nums2) {
  return nums1.map((x) => {
    const start = nums2.indexOf(x);
    for (let j = start + 1; j < nums2.length; j++) {
      if (nums2[j] > x) return nums2[j];
    }
    return -1;
  });
}

function nextGreaterElementI(nums1, nums2) {
  const nextGreater = new Map(); // value -> its next greater value
  const stack = [];              // values, decreasing from bottom to top
  for (const value of nums2) {
    while (stack.length && stack[stack.length - 1] < value) {
      nextGreater.set(stack.pop(), value);
    }
    stack.push(value);
  }
  return nums1.map((x) => (nextGreater.has(x) ? nextGreater.get(x) : -1));
}

// ---------- Part II ----------
function bruteForceII(nums) {
  const n = nums.length;
  return nums.map((x, i) => {
    for (let step = 1; step < n; step++) {
      const candidate = nums[(i + step) % n];
      if (candidate > x) return candidate;
    }
    return -1;
  });
}

function nextGreaterElementII(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(-1);
  const stack = []; // indices, values decreasing

  for (let i = 0; i < 2 * n; i++) {
    const value = nums[i % n];
    while (stack.length && nums[stack[stack.length - 1]] < value) {
      answer[stack.pop()] = value;
    }
    if (i < n) stack.push(i); // only the first lap adds candidates
  }
  return answer;
}

const optimal = nextGreaterElementII;
const bruteForce = bruteForceII;

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForceI, nextGreaterElementI]) {
  assert.deepStrictEqual(solve([4, 1, 2], [1, 3, 4, 2]), [-1, 3, -1]);
  assert.deepStrictEqual(solve([2, 4], [1, 2, 3, 4]), [3, -1]);
  assert.deepStrictEqual(solve([], [1, 2]), []);
  assert.deepStrictEqual(solve([3], [3]), [-1]);
}
for (const solve of [bruteForceII, nextGreaterElementII]) {
  assert.deepStrictEqual(solve([1, 2, 1]), [2, -1, 2]);
  assert.deepStrictEqual(solve([1, 2, 3, 4, 3]), [2, 3, 4, -1, 4]);
  assert.deepStrictEqual(solve([5, 4, 3, 2, 1]), [-1, 5, 5, 5, 5]);
  assert.deepStrictEqual(solve([2, 2, 2]), [-1, -1, -1]);
  assert.deepStrictEqual(solve([7]), [-1]);
  assert.deepStrictEqual(solve([-1, -3, -2]), [-1, -2, -1]);
}
console.log('✓ 06-next-greater-element passed');

module.exports = { optimal, bruteForce, nextGreaterElementI, nextGreaterElementII, bruteForceI, bruteForceII };
