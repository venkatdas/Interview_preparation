/**
 * Binary search templates in JavaScript.
 *
 *  1. search(nums, target)            classic exact match, returns index or -1    [left <= right]
 *  2. lowerBound(nums, target)        first index with nums[i] >= target          [left < right]
 *  3. upperBound(nums, target)        first index with nums[i] >  target          [left < right]
 *  4. searchOnAnswer(lo, hi, canDo)   smallest x in [lo, hi] with canDo(x) true  (monotonic N..NY..Y)
 *  5. searchLast(lo, hi, isOk)        largest  x in [lo, hi] with isOk(x) true   (monotonic Y..YN..N)
 *  6. searchReal(lo, hi, isTooSmall)  boundary on real numbers, fixed iterations
 *  7. searchRecursive(nums, target)   the recursive form, for completeness
 *
 * Every function states its loop invariant in a comment. If you can say the
 * invariant out loud, you will never get the off-by-ones wrong.
 */

// ---------- 1. classic exact match ----------
// invariant: if target is in nums, it is inside [left, right] (inclusive)
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {                       // range still has at least one element
    const mid = left + ((right - left) >> 1);   // never overflows, rounds down
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;     // target can only be right of mid
    else right = mid - 1;                       // target can only be left of mid
  }
  return -1;                                    // range became empty
}

// ---------- 2. lower bound (bisect_left) ----------
// invariant: nums[0..left-1] < target  and  nums[right..n-1] >= target
// answer (first index >= target) is always in [left, right]; may equal n (append position)
function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length;                      // EXCLUSIVE right so n is a possible answer
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1;     // mid is too small: skip it
    else right = mid;                           // mid qualifies: keep it as a candidate
  }
  return left;
}

// ---------- 3. upper bound (bisect_right) ----------
// invariant: nums[0..left-1] <= target  and  nums[right..n-1] > target
function upperBound(nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] <= target) left = mid + 1;    // only change vs lowerBound: <= instead of <
    else right = mid;
  }
  return left;
}

// ---------- 4. binary search on the answer: FIRST true ----------
// canDo must be monotonic: false...false true...true over [lo, hi].
// invariant: every x < lo is false; every x >= hi is true (assuming canDo(hi) is true).
function searchOnAnswer(lo, hi, canDo) {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);  // Math.floor: works beyond 32-bit values
    if (canDo(mid)) hi = mid;                     // mid works -> answer is mid or smaller
    else lo = mid + 1;                            // mid fails -> answer is strictly bigger
  }
  return lo;                                      // lo === hi: the first true
}

// ---------- 5. binary search on the answer: LAST true ----------
// isOk is monotonic the other way: true...true false...false.
// Because we move `lo = mid` we must round mid UP, or two elements loop forever.
function searchLast(lo, hi, isOk) {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo + 1) / 2);  // round UP
    if (isOk(mid)) lo = mid;                          // mid works -> answer is mid or bigger
    else hi = mid - 1;                                // mid fails -> everything >= mid fails
  }
  return lo;                                          // assumes isOk(lo) was true initially
}

// ---------- 6. real-valued binary search ----------
// isTooSmall(x) is monotonic (true then false). Returns the boundary to ~1e-12.
function searchReal(lo, hi, isTooSmall, iterations = 100) {
  for (let i = 0; i < iterations; i++) {        // 2^100 halvings: far beyond double precision
    const mid = (lo + hi) / 2;
    if (isTooSmall(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

// ---------- 7. recursive version of (1) ----------
// O(log n) stack frames. Fine in JS: log2(1e9) ~ 30 frames.
function searchRecursive(nums, target, left = 0, right = nums.length - 1) {
  if (left > right) return -1;
  const mid = left + ((right - left) >> 1);
  if (nums[mid] === target) return mid;
  return nums[mid] < target
    ? searchRecursive(nums, target, mid + 1, right)
    : searchRecursive(nums, target, left, mid - 1);
}

// ---------- self-test ----------
const assert = require('assert');

const sorted = [1, 3, 4, 7, 9, 12, 15, 20];
assert.strictEqual(search(sorted, 7), 3);
assert.strictEqual(search(sorted, 1), 0);           // first element
assert.strictEqual(search(sorted, 20), 7);          // last element
assert.strictEqual(search(sorted, 10), -1);         // missing in the middle
assert.strictEqual(search(sorted, 0), -1);          // smaller than all
assert.strictEqual(search(sorted, 99), -1);         // larger than all
assert.strictEqual(search([], 5), -1);              // empty
assert.strictEqual(search([5], 5), 0);              // single
assert.strictEqual(search([5], 4), -1);
for (const target of [-1, 0, 1, 7, 10, 20, 21]) {
  assert.strictEqual(searchRecursive(sorted, target), search(sorted, target));
}

const withDupes = [1, 2, 2, 2, 5];
assert.strictEqual(lowerBound(withDupes, 2), 1);
assert.strictEqual(upperBound(withDupes, 2), 4);
assert.strictEqual(upperBound(withDupes, 2) - lowerBound(withDupes, 2), 3);  // count of 2s
assert.strictEqual(lowerBound(withDupes, 0), 0);    // insert at front
assert.strictEqual(lowerBound(withDupes, 6), 5);    // insert at end (=== n)
assert.strictEqual(lowerBound(withDupes, 3), 4);    // between 2 and 5
assert.strictEqual(upperBound(withDupes, 5), 5);
assert.strictEqual(lowerBound([], 1), 0);
assert.strictEqual(upperBound([], 1), 0);
// cross-check against a linear scan on random arrays
for (let trial = 0; trial < 200; trial++) {
  const arr = Array.from({ length: Math.floor(Math.random() * 20) }, () => Math.floor(Math.random() * 10) - 3)
    .sort((a, b) => a - b);
  const target = Math.floor(Math.random() * 14) - 5;
  let lb = arr.length, ub = arr.length;
  for (let i = 0; i < arr.length; i++) { if (arr[i] >= target) { lb = i; break; } }
  for (let i = 0; i < arr.length; i++) { if (arr[i] > target) { ub = i; break; } }
  assert.strictEqual(lowerBound(arr, target), lb);
  assert.strictEqual(upperBound(arr, target), ub);
  const found = search(arr, target);
  assert.ok(found === -1 ? !arr.includes(target) : arr[found] === target);
}

// search on answer: smallest x with x*x >= 50 -> 8
assert.strictEqual(searchOnAnswer(0, 50, (x) => x * x >= 50), 8);
assert.strictEqual(searchOnAnswer(0, 100, (x) => x >= 0), 0);                 // all true
assert.strictEqual(searchOnAnswer(1, 10 ** 15, (x) => x >= 123456789012), 123456789012); // big range
// last true: largest x with x*x <= 50 -> 7  (integer sqrt)
assert.strictEqual(searchLast(0, 50, (x) => x * x <= 50), 7);
assert.strictEqual(searchLast(0, 50, (x) => x * x <= 49), 7);
assert.strictEqual(searchLast(0, 50, (x) => x * x <= 0), 0);

// real: sqrt(2) to high precision
const root2 = searchReal(0, 2, (x) => x * x < 2);
assert.ok(Math.abs(root2 - Math.SQRT2) < 1e-9);

console.log('✓ binary-search-templates.js self-test passed');

module.exports = { search, lowerBound, upperBound, searchOnAnswer, searchLast, searchReal, searchRecursive };
