/**
 * Meet in the Middle — reusable helpers
 *
 * The idea: when n is around 40, trying all 2^n subsets (~10^12) is far too slow,
 * but 2^(n/2) = 2^20 ≈ 10^6 is fine. So we:
 *   1. split the array into two halves, left and right,
 *   2. enumerate every subset sum of each half (2^(n/2) sums each),
 *   3. combine one sum from the left with one sum from the right, using
 *      sort + binary search, two pointers, or a hash map, instead of trying all pairs.
 *
 * Helpers in this file:
 *   splitHalves(arr)                -> [left, right]
 *   subsetSums(arr)                 -> every subset sum (2^k values, unsorted, built iteratively)
 *   sortedSubsetSums(arr)           -> every subset sum in ascending order, built by MERGING (no sort call)
 *   subsetSumsBySize(arr)           -> bySize[c] = sums of subsets that use exactly c elements
 *   countPairsAtMost(A, B, target)  -> # of pairs (a, b) with a + b <= target (A, B sorted) — two pointers
 *   closestPairSum(A, B, goal)      -> min |a + b - goal| (B sorted) — binary search
 *   countPairsEqual(A, B, target)   -> # of pairs with a + b === target — hash map
 *   lowerBound(sorted, x)           -> first index with sorted[i] >= x
 *   upperBound(sorted, x)           -> first index with sorted[i] > x
 */

function splitHalves(arr) {
  if (!Array.isArray(arr)) throw new TypeError('splitHalves expects an array');
  const mid = arr.length >> 1;
  return [arr.slice(0, mid), arr.slice(mid)];
}

/**
 * All 2^k subset sums of arr. Built iteratively: start with [0]; for each value x,
 * every existing sum s spawns s + x. WHY iterative: no recursion depth issues and the
 * output array is filled in place, which is fast for 2^20 values.
 */
function subsetSums(arr) {
  if (arr.length > 25) throw new RangeError('subsetSums: half too large (2^k memory)');
  const sums = new Array(1 << arr.length);
  sums[0] = 0;
  let size = 1;
  for (const x of arr) {
    for (let i = 0; i < size; i++) sums[size + i] = sums[i] + x;
    size *= 2;
  }
  return sums;
}

/**
 * Same set of sums, but ascending, built by merging.
 * Invariant: `cur` is sorted. Adding x to every element of a sorted list keeps it
 * sorted, so the new list = merge(cur, cur + x). That is O(2^k) total instead of
 * O(2^k * k) for sort — the classic "generate sorted sums" trick.
 */
function sortedSubsetSums(arr) {
  if (arr.length > 25) throw new RangeError('sortedSubsetSums: half too large');
  let cur = [0];
  for (const x of arr) {
    const next = new Array(cur.length * 2);
    let i = 0, j = 0, k = 0;
    while (i < cur.length && j < cur.length) {
      const a = cur[i], b = cur[j] + x;
      if (a <= b) { next[k++] = a; i++; } else { next[k++] = b; j++; }
    }
    while (i < cur.length) next[k++] = cur[i++];
    while (j < cur.length) next[k++] = cur[j++] + x;
    cur = next;
  }
  return cur;
}

/**
 * bySize[c] = list of sums of subsets with exactly c elements (c = 0..k).
 * Needed when the problem fixes HOW MANY items each side takes
 * (e.g. "split 2n numbers into two groups of n").
 * Uses bitmasks: popcount(mask) is the subset size.
 */
function subsetSumsBySize(arr) {
  const k = arr.length;
  if (k > 20) throw new RangeError('subsetSumsBySize: half too large');
  const bySize = Array.from({ length: k + 1 }, () => []);
  const sums = new Array(1 << k).fill(0);
  const count = new Array(1 << k).fill(0);
  for (let mask = 1; mask < 1 << k; mask++) {
    const low = mask & -mask;            // lowest set bit
    const idx = 31 - Math.clz32(low);    // its index
    sums[mask] = sums[mask ^ low] + arr[idx];
    count[mask] = count[mask ^ low] + 1;
  }
  for (let mask = 0; mask < 1 << k; mask++) bySize[count[mask]].push(sums[mask]);
  return bySize;
}

function lowerBound(sorted, x) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < x) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function upperBound(sorted, x) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= x) lo = mid + 1; else hi = mid;
  }
  return lo;
}

/**
 * Count pairs (a from A, b from B) with a + b <= target.
 * A and B must be sorted ascending. Two pointers: i walks A up, j walks B down.
 * For a fixed A[i], every B[0..j] works, so add j + 1. As A[i] grows, the allowed
 * part of B can only shrink — that monotonicity is why two pointers is O(|A| + |B|).
 */
function countPairsAtMost(A, B, target) {
  let j = B.length - 1;
  let count = 0;
  for (let i = 0; i < A.length; i++) {
    while (j >= 0 && A[i] + B[j] > target) j--;
    if (j < 0) break;
    count += j + 1;
  }
  return count;
}

/**
 * Smallest |a + b - goal| over all pairs. B must be sorted.
 * For each a we want b closest to goal - a: binary search for it and check the
 * neighbour on each side of the insertion point.
 */
function closestPairSum(A, B, goal) {
  if (A.length === 0 || B.length === 0) throw new RangeError('closestPairSum: empty list');
  let best = Infinity;
  for (const a of A) {
    const want = goal - a;
    const pos = lowerBound(B, want);
    if (pos < B.length) best = Math.min(best, Math.abs(a + B[pos] - goal));
    if (pos > 0) best = Math.min(best, Math.abs(a + B[pos - 1] - goal));
    if (best === 0) return 0;
  }
  return best;
}

/**
 * Count pairs with a + b === target using a frequency map of B.
 * Duplicates matter: the map stores HOW MANY times each sum appears, because two
 * different subsets with the same sum are two different answers.
 */
function countPairsEqual(A, B, target) {
  const freq = new Map();
  for (const b of B) freq.set(b, (freq.get(b) || 0) + 1);
  let count = 0;
  for (const a of A) count += freq.get(target - a) || 0;
  return count;
}

/** Full MITM: number of subsets of arr with sum <= target. */
function countSubsetsAtMost(arr, target) {
  const [L, R] = splitHalves(arr);
  return countPairsAtMost(sortedSubsetSums(L), sortedSubsetSums(R), target);
}

/** Full MITM: min |subset sum - goal|. */
function closestSubsetSum(arr, goal) {
  const [L, R] = splitHalves(arr);
  return closestPairSum(subsetSums(L), sortedSubsetSums(R), goal);
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function allSumsBrute(arr) {
    const out = [];
    for (let m = 0; m < 1 << arr.length; m++) {
      let s = 0;
      for (let i = 0; i < arr.length; i++) if (m & (1 << i)) s += arr[i];
      out.push(s);
    }
    return out;
  }
  const asc = (a, b) => a - b;

  // basic
  assert.deepStrictEqual(splitHalves([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]]);
  assert.deepStrictEqual(subsetSums([]), [0]);
  assert.deepStrictEqual(subsetSums([1, 2]), [0, 1, 2, 3]);
  assert.deepStrictEqual(sortedSubsetSums([3, -1, 2]), [-1, 0, 1, 2, 2, 3, 4, 5]);
  assert.deepStrictEqual(subsetSumsBySize([1, 2, 4]).map(l => l.sort(asc)), [[0], [1, 2, 4], [3, 5, 6], [7]]);
  assert.strictEqual(countPairsAtMost([1, 2, 3], [1, 2, 3], 4), 6);
  assert.strictEqual(countPairsAtMost([], [1], 4), 0);
  assert.strictEqual(closestPairSum([0, 5], [0, 7], 6), 1);
  assert.strictEqual(countPairsEqual([1, 1, 2], [2, 3, 3], 4), 5); // 1+3 (x4) and 2+2
  assert.strictEqual(lowerBound([1, 2, 2, 3], 2), 1);
  assert.strictEqual(upperBound([1, 2, 2, 3], 2), 3);

  // randomized against brute force
  const rand = mulberry32(42);
  for (let t = 0; t < 300; t++) {
    const n = Math.floor(rand() * 12);
    const arr = Array.from({ length: n }, () => Math.floor(rand() * 41) - 20);
    const all = allSumsBrute(arr);
    assert.deepStrictEqual(subsetSums(arr).slice().sort(asc), all.slice().sort(asc));
    assert.deepStrictEqual(sortedSubsetSums(arr), all.slice().sort(asc));
    const target = Math.floor(rand() * 61) - 30;
    assert.strictEqual(countSubsetsAtMost(arr, target), all.filter(s => s <= target).length);
    assert.strictEqual(closestSubsetSum(arr, target), Math.min(...all.map(s => Math.abs(s - target))));
    const bySize = subsetSumsBySize(arr);
    assert.strictEqual(bySize.reduce((acc, l) => acc + l.length, 0), 1 << n);
  }

  // scale check: n = 40 finishes quickly
  const big = Array.from({ length: 40 }, () => Math.floor(rand() * 2e6) - 1e6);
  const c = countSubsetsAtMost(big, 0);
  assert.ok(c > 0 && c < 2 ** 40);

  console.log('✓ meet_in_the_middle.js self-test passed');
}

module.exports = {
  splitHalves, subsetSums, sortedSubsetSums, subsetSumsBySize,
  countPairsAtMost, closestPairSum, countPairsEqual, lowerBound, upperBound,
  countSubsetsAtMost, closestSubsetSum,
};
