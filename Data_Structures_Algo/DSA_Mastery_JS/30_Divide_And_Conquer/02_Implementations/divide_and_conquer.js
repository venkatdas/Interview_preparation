/**
 * Divide & Conquer building blocks in JavaScript.
 *
 *   mergeSort(nums)            -> sorted copy, O(n log n)
 *   countInversions(nums)      -> number of pairs i < j with nums[i] > nums[j], O(n log n)
 *   maxSubarrayDC(nums)        -> maximum subarray sum, O(n log n) (Kadane is O(n); this shows the D&C shape)
 *   power(base, exp, mod?)     -> base^exp by repeated squaring, O(log exp)
 *   mergeKSortedArrays(arrays) -> one sorted array, O(N log k) where N = total length
 *
 * The pattern every function follows:
 *   1. DIVIDE  the input into smaller pieces (usually halves)
 *   2. CONQUER each piece recursively (base case: size 0 or 1)
 *   3. COMBINE the pieces' answers into the answer for the whole
 */

// ---------- merge sort ----------
function merge(left, right) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}

function mergeSort(nums) {
  if (nums.length <= 1) return nums.slice();                 // base case
  const mid = nums.length >> 1;
  const left = mergeSort(nums.slice(0, mid));                // conquer
  const right = mergeSort(nums.slice(mid));
  return merge(left, right);                                 // combine
}

// ---------- counting inversions ----------
// An inversion is a pair i < j with nums[i] > nums[j]. While merging two sorted halves,
// whenever we take right[j] before left[i], it is smaller than EVERY remaining element of
// the left half, so it forms (left.length - i) inversions at once.
function countInversions(nums) {
  function sortAndCount(arr) {
    if (arr.length <= 1) return { sorted: arr, count: 0 };
    const mid = arr.length >> 1;
    const left = sortAndCount(arr.slice(0, mid));
    const right = sortAndCount(arr.slice(mid));
    let count = left.count + right.count;                    // inversions inside each half
    const merged = [];
    let i = 0;
    let j = 0;
    while (i < left.sorted.length && j < right.sorted.length) {
      if (left.sorted[i] <= right.sorted[j]) {
        merged.push(left.sorted[i++]);
      } else {
        count += left.sorted.length - i;                     // cross inversions
        merged.push(right.sorted[j++]);
      }
    }
    while (i < left.sorted.length) merged.push(left.sorted[i++]);
    while (j < right.sorted.length) merged.push(right.sorted[j++]);
    return { sorted: merged, count };
  }
  return sortAndCount(nums).count;
}

// ---------- maximum subarray, D&C ----------
// The best subarray is either entirely in the left half, entirely in the right half, or
// crosses the middle. The crossing one = best suffix of left + best prefix of right.
function maxSubarrayDC(nums) {
  function solve(lo, hi) {
    if (lo === hi) return nums[lo];
    const mid = (lo + hi) >> 1;
    const left = solve(lo, mid);
    const right = solve(mid + 1, hi);
    let bestLeft = -Infinity;
    let sum = 0;
    for (let i = mid; i >= lo; i--) {                        // best suffix ending at mid
      sum += nums[i];
      bestLeft = Math.max(bestLeft, sum);
    }
    let bestRight = -Infinity;
    sum = 0;
    for (let i = mid + 1; i <= hi; i++) {                    // best prefix starting at mid+1
      sum += nums[i];
      bestRight = Math.max(bestRight, sum);
    }
    return Math.max(left, right, bestLeft + bestRight);
  }
  if (nums.length === 0) return 0;
  return solve(0, nums.length - 1);
}

// ---------- fast exponentiation ----------
// base^exp = (base^(exp/2))^2, times base if exp is odd. Each step halves exp -> O(log exp).
//
// (a * b) % mod with a, b < mod ~ 1e9 would produce ~1e18, past JS's exact-integer limit of
// 2^53. mulMod splits b into 16-bit halves so no intermediate exceeds ~2^47.
function mulMod(a, b, mod) {
  const high = Math.floor(b / 65536);
  const low = b % 65536;
  return ((a * high) % mod * 65536 + a * low) % mod;
}

function power(base, exp, mod = null) {
  if (exp < 0) return 1 / power(base, -exp, mod);
  let result = 1;
  let b = mod === null ? base : ((base % mod) + mod) % mod;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = mod === null ? result * b : mulMod(result, b, mod);
    b = mod === null ? b * b : mulMod(b, b, mod);
    e = Math.floor(e / 2);
  }
  return result;
}

// ---------- merge k sorted arrays ----------
// Pairwise: merge arrays[0..k/2) and arrays[k/2..k) recursively. Each level of recursion
// touches every element once (O(N)) and there are log k levels -> O(N log k).
function mergeKSortedArrays(arrays) {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0].slice();
  const mid = arrays.length >> 1;
  return merge(mergeKSortedArrays(arrays.slice(0, mid)), mergeKSortedArrays(arrays.slice(mid)));
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}
function randomArray(len, lo = -20, hi = 20) {
  return Array.from({ length: len }, () => randomInt(lo, hi));
}

for (let trial = 0; trial < 200; trial++) {
  const nums = randomArray(randomInt(0, 25));

  // merge sort vs built-in sort
  assert.deepStrictEqual(mergeSort(nums), nums.slice().sort((a, b) => a - b));

  // inversions vs O(n^2)
  let inv = 0;
  for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) if (nums[i] > nums[j]) inv++;
  assert.strictEqual(countInversions(nums), inv);

  // max subarray vs O(n^2)
  if (nums.length > 0) {
    let best = -Infinity;
    for (let i = 0; i < nums.length; i++) {
      let sum = 0;
      for (let j = i; j < nums.length; j++) {
        sum += nums[j];
        best = Math.max(best, sum);
      }
    }
    assert.strictEqual(maxSubarrayDC(nums), best);
  }

  // merge k sorted arrays vs flatten + sort
  const k = randomInt(0, 5);
  const arrays = Array.from({ length: k }, () => randomArray(randomInt(0, 6)).sort((a, b) => a - b));
  assert.deepStrictEqual(mergeKSortedArrays(arrays), arrays.flat().sort((a, b) => a - b));
}

// power vs Math.pow / naive modular loop
for (let trial = 0; trial < 200; trial++) {
  const base = randomInt(-5, 5);
  const exp = randomInt(0, 12);
  assert.strictEqual(power(base, exp), Math.pow(base, exp));
  const mod = 1_000_000_007;
  let naive = 1;
  for (let i = 0; i < exp; i++) naive = mulMod(naive, ((base % mod) + mod) % mod, mod);
  assert.strictEqual(power(base, exp, mod), naive);
}
assert.strictEqual(power(2, -2), 0.25);
assert.strictEqual(power(2, 10), 1024);
assert.strictEqual(countInversions([2, 4, 1, 3, 5]), 3);
assert.strictEqual(maxSubarrayDC([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
assert.strictEqual(maxSubarrayDC([]), 0);

console.log('✓ divide-and-conquer.js self-test passed');

module.exports = { mergeSort, merge, countInversions, maxSubarrayDC, power, mulMod, mergeKSortedArrays };
