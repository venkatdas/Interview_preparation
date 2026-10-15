/**
 * 11. Wiggle Sort II   (LeetCode 324 — Medium)
 *
 * PROBLEM
 * Reorder the array in place so that nums[0] < nums[1] > nums[2] < nums[3] > ...
 * (strict inequalities). You may assume a valid answer always exists.
 *
 * EXAMPLES
 * Input: [1,5,1,1,6,4]   Output: [1,6,1,5,1,4]  (or [1,4,1,5,1,6], any valid wiggle)
 * Input: [1,3,2,2,3,1]   Output: [2,3,1,3,1,2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strict < and > (so duplicates are the tricky part: [4,5,5,6] works, [5,5,5] cannot)
 * - Multiple valid outputs; the checker only validates the wiggle property
 *
 * APPROACH 1 — Brute force (try permutations)   O(n! * n)
 * Generate permutations until one wiggles. Only sane for n <= 7; used here to
 * confirm an answer exists on tiny inputs.
 *
 * APPROACH 2 — Optimal (sort, split in half, interleave from the BACK)   O(n log n) time, O(n) space
 * Sort ascending. The smaller half goes to even indices, the larger half to odd indices.
 * To keep duplicates from meeting (e.g. [1,2,2,3] -> halves [1,2] [2,3] -> naive
 * interleave gives 1,2,2,3: a tie at positions 1,2), fill BOTH halves in REVERSE:
 * even positions get the smaller half from its largest element down, odd positions
 * get the larger half from its largest down. The equal "middle" elements end up as far
 * apart as possible.
 * (The O(n) time / O(1) space solution uses quickselect for the median + virtual
 * indexing + three-way partition; it is a famous trick but rarely expected.)
 *
 * Dry run [1,5,1,1,6,4]: sorted [1,1,1,4,5,6], small = [1,1,1], large = [4,5,6]
 *   even indices 0,2,4 <- small reversed: 1,1,1
 *   odd  indices 1,3,5 <- large reversed: 6,5,4
 *   result [1,6,1,5,1,4]  checks: 1<6>1<5>1<4  ok
 *
 * Dry run [1,2,2,3]: sorted, small=[1,2] large=[2,3]
 *   even <- 2,1 ; odd <- 3,2  -> [2,3,1,2]: 2<3>1<2 ok (naive order would give 1,2,2,3 fail)
 *
 * EDGE CASES
 * - [] and [x] -> unchanged (trivially valid)
 * - n odd: the smaller half gets the extra element (ceil(n/2) evens)
 * - many duplicates [4,5,5,6] -> [5,6,4,5]
 */

function isWiggle(nums) {
  for (let i = 1; i < nums.length; i++) {
    if (i % 2 === 1 && !(nums[i] > nums[i - 1])) return false;
    if (i % 2 === 0 && !(nums[i] < nums[i - 1])) return false;
  }
  return true;
}

function bruteForce(nums) {
  const used = new Array(nums.length).fill(false);
  const path = [];
  function go() {
    if (path.length === nums.length) return isWiggle(path);
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;  // skip duplicate branches
      used[i] = true; path.push(nums[i]);
      if (go()) return true;
      used[i] = false; path.pop();
    }
    return false;
  }
  const sorted = [...nums].sort((a, b) => a - b);
  nums.length = 0; nums.push(...sorted);   // so the duplicate-skip works
  if (go()) { for (let i = 0; i < path.length; i++) nums[i] = path[i]; }
  return nums;
}

function optimal(nums) {
  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const half = Math.ceil(n / 2);           // smaller half size (gets the extra when n is odd)
  let smallIndex = half - 1;               // walk the smaller half from its top down
  let largeIndex = n - 1;                  // walk the larger half from its top down
  for (let i = 0; i < n; i++) {
    nums[i] = i % 2 === 0 ? sorted[smallIndex--] : sorted[largeIndex--];
  }
  return nums;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  for (const input of [[1, 5, 1, 1, 6, 4], [1, 3, 2, 2, 3, 1], [4, 5, 5, 6], [1, 2, 2, 3], [1], [], [2, 1], [1, 1, 2, 2, 3, 3]]) {
    const copy = [...input];
    const out = solve(copy);
    assert.ok(isWiggle(out), `${solve.name} not wiggle for ${JSON.stringify(input)} -> ${JSON.stringify(out)}`);
    assert.deepStrictEqual([...out].sort((a, b) => a - b), [...input].sort((a, b) => a - b)); // same multiset
  }
}
assert.deepStrictEqual(optimal([1, 5, 1, 1, 6, 4]), [1, 6, 1, 5, 1, 4]);
assert.deepStrictEqual(optimal([1, 2, 2, 3]), [2, 3, 1, 2]);
for (let trial = 0; trial < 200; trial++) {
  // build an input that is guaranteed solvable: distinct values
  const size = Math.floor(Math.random() * 15);
  const input = Array.from({ length: size }, (_, i) => i * 3 + Math.floor(Math.random() * 2));
  assert.ok(isWiggle(optimal([...input])));
}
console.log('✓ 11-wiggle-sort-ii passed');

module.exports = { optimal, bruteForce, isWiggle };
