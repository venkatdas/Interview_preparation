/**
 * 02. Playlist Pairs   (Original — Easy)
 *
 * PROBLEM
 * A radio host has song lengths in seconds, sorted in non-decreasing order. An ad break slot
 * fits two DIFFERENT songs (different positions) whose total length is at most `limit`.
 * Return how many index pairs (i < j) fit.
 *
 * EXAMPLES
 * lengths = [60, 90, 120, 200], limit = 210  -> 3   (60+90, 60+120, 90+120)
 * lengths = [100, 100, 100],     limit = 200 -> 3   (every pair)
 * lengths = [300],               limit = 500 -> 0   (need two songs)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^5, input already sorted ascending. Pairs are by index, so equal lengths count separately.
 * - The answer can reach ~5 * 10^9: still exact in a JS Number (< 2^53).
 *
 * PATTERN: two pointers (opposite ends). Clues: "sorted", "pair", "sum at most".
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Check every pair.
 *
 * APPROACH 2 — Optimal (two pointers)   O(n) time, O(1) space
 * left = 0, right = n - 1. If a[left] + a[right] <= limit, then a[left] pairs with EVERY index
 * in (left, right] (they are all <= a[right]), so add right - left and move left up.
 * Otherwise a[right] is too big even with the smallest remaining song: move right down.
 *
 * Dry run on [60, 90, 120, 200], limit 210:
 *   l=0 r=3: 60+200=260 > 210 -> r=2
 *   l=0 r=2: 60+120=180 <= 210 -> count += 2 (pairs with 90 and 120), l=1
 *   l=1 r=2: 90+120=210 <= 210 -> count += 1, l=2
 *   l=2 r=2: stop. count = 3
 *
 * EDGE CASES
 * - n < 2 -> 0;  all pairs fit -> n(n-1)/2;  nothing fits -> 0.
 */

function bruteForce(lengths, limit) {
  let count = 0;
  for (let i = 0; i < lengths.length; i++) {
    for (let j = i + 1; j < lengths.length; j++) if (lengths[i] + lengths[j] <= limit) count++;
  }
  return count;
}

function optimal(lengths, limit) {
  let left = 0;
  let right = lengths.length - 1;
  let count = 0;
  while (left < right) {
    if (lengths[left] + lengths[right] <= limit) {
      count += right - left; // left pairs with every index in (left, right]
      left++;
    } else {
      right--;
    }
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([60, 90, 120, 200], 210), 3);
  assert.strictEqual(solve([100, 100, 100], 200), 3);
  assert.strictEqual(solve([300], 500), 0);
  assert.strictEqual(solve([], 10), 0);
  assert.strictEqual(solve([5, 6, 7], 10), 0);
  assert.strictEqual(solve([1, 2, 3, 4], 100), 6);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2);
for (let t = 0; t < 300; t++) {
  const arr = Array.from({ length: Math.floor(rand() * 15) }, () => Math.floor(rand() * 50)).sort((a, b) => a - b);
  const limit = Math.floor(rand() * 100);
  assert.strictEqual(optimal(arr, limit), bruteForce(arr, limit));
}
console.log('✓ 02_playlist_pairs passed');

module.exports = { optimal, bruteForce };
