/**
 * 07. Top-K Heavy Hitters with Misra-Gries   (Original — Medium)
 *
 * PROBLEM
 * A huge stream of item ids (strings) passes by. Given k >= 2, return every item whose
 * frequency is STRICTLY greater than n / k (n = stream length), sorted by frequency
 * descending, ties by id ascending, as [id, count] pairs with EXACT counts.
 * You may read the stream twice, but you may keep only O(k) items in memory between passes
 * (no full frequency map).
 *
 * EXAMPLES
 * stream = a b a c a b d a b,  n = 9, k = 3, threshold n/k = 3
 *   a: 4 (> 3)  b: 3 (not > 3)  -> [["a", 4]]
 * stream = x y x y x y z, k = 2 -> threshold 3.5 -> [] (x: 3, y: 3)
 * stream = x x x y, k = 2 -> [["x", 3]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly greater than n/k? (yes)  - Exact counts required? (yes -> second pass)
 * - At most k-1 items can exceed n/k (k of them would already sum to more than n).
 *
 * APPROACH 1 — Brute force (full hash map)   O(n) time, O(distinct) space
 * Count everything in a Map, filter by count > n/k, sort. Correct, but memory grows with the
 * number of distinct ids — exactly what a streaming system cannot afford.
 *
 * APPROACH 2 — Optimal (Misra-Gries + verification pass)   O(n * k) worst time, O(k) space
 * Pass 1: Misra-Gries with k-1 counters. New item + free counter -> start at 1. New item and
 * all counters busy -> decrement ALL counters (drop zeros). Each "decrement all" cancels k
 * distinct occurrences (k-1 stored + the new one), which can happen at most n/k times, so
 * any item occurring more than n/k times survives. Survivors are CANDIDATES (maybe false).
 * Pass 2: count only the candidates exactly, keep those > n/k.
 *
 * Dry run, stream a b a c a b d a b, k = 3 (2 counters):
 *   a  {a:1}
 *   b  {a:1, b:1}
 *   a  {a:2, b:1}
 *   c  full -> decrement all -> {a:1}
 *   a  {a:2}
 *   b  {a:2, b:1}
 *   d  full -> decrement -> {a:1}
 *   a  {a:2}
 *   b  {a:2, b:1}
 *   candidates a, b; pass 2 counts a=4, b=3; threshold 3 -> [["a",4]]
 *
 * EDGE CASES
 * - empty stream -> []
 * - single distinct item -> it (count n > n/k)
 * - n = 1, k = 2: count 1 > 0.5 -> included
 */

const { MisraGries } = require('../../02_Implementations/streaming.js');

function sortResult(pairs) {
  return pairs.sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0));
}

function bruteForce(stream, k) {
  const freq = new Map();
  for (const x of stream) freq.set(x, (freq.get(x) || 0) + 1);
  return sortResult([...freq].filter(([, c]) => c > stream.length / k));
}

function optimal(stream, k) {
  const mg = new MisraGries(k);
  for (const x of stream) mg.add(x);                         // pass 1: O(k) memory
  const exact = new Map(mg.candidates().map(c => [c, 0]));
  for (const x of stream) if (exact.has(x)) exact.set(x, exact.get(x) + 1);   // pass 2
  return sortResult([...exact].filter(([, c]) => c > stream.length / k));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve('a b a c a b d a b'.split(' '), 3), [['a', 4]]);
  assert.deepStrictEqual(solve('x y x y x y z'.split(' '), 2), []);
  assert.deepStrictEqual(solve(['x', 'x', 'x', 'y'], 2), [['x', 3]]);
  assert.deepStrictEqual(solve([], 3), []);
  assert.deepStrictEqual(solve(['q'], 2), [['q', 1]]);
  assert.deepStrictEqual(solve(['b', 'a', 'b', 'a', 'c'], 3), [['a', 2], ['b', 2]]);
}
let s = 17;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 200; t++) {
  const k = 2 + Math.floor(rnd() * 6);
  const n = Math.floor(rnd() * 120);
  const stream = Array.from({ length: n }, () => (rnd() < 0.3 ? 'hot' + Math.floor(rnd() * 2) : 'c' + Math.floor(rnd() * 15)));
  assert.deepStrictEqual(optimal(stream, k), bruteForce(stream, k));
}
console.log('✓ 07_heavy_hitters_misra_gries passed');

module.exports = { optimal, bruteForce };
