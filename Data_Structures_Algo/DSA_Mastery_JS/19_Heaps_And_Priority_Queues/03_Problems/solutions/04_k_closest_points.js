/**
 * 04. K Closest Points to Origin   (LeetCode 973 — Medium)
 *
 * PROBLEM
 * Given points [[x, y], ...] and an integer k, return the k points closest to
 * (0, 0) by Euclidean distance. Any order is accepted.
 *
 * EXAMPLES
 * Input: points = [[1,3],[-2,2]], k = 1          Output: [[-2,2]]
 *   Explanation: dist^2: (1,3) -> 10, (-2,2) -> 8, so (-2,2) is closer
 * Input: points = [[3,3],[5,-1],[-2,4]], k = 2   Output: [[3,3],[-2,4]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the answer unique? (yes, guaranteed) Order matters? (no)
 * - Can I compare squared distances? (yes: sqrt is monotonic, skip it)
 *
 * APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space
 * Sort all points by squared distance and take the first k.
 *
 * APPROACH 2 — Optimal (MAX-heap of size k)   O(n log k) time, O(k) space
 * "k closest" = "k smallest distances". Keep a MAX-heap of the k closest seen
 * so far: its top is the FARTHEST of the candidates, the one to evict when a
 * closer point arrives. This is the mirror of problem 01 (min-heap for k largest).
 * Rule to remember: top K largest -> min-heap, top K smallest -> max-heap.
 *
 * Dry run on [[3,3],[5,-1],[-2,4]], k = 2  (dist^2: 18, 26, 20):
 *   push (3,3):18          heap = {18}
 *   push (5,-1):26         heap = {26,18}
 *   push (-2,4):20 -> size 3 -> pop farthest 26 -> heap = {20,18}
 *   answer = [[3,3],[-2,4]]
 *
 * EDGE CASES
 * - k = n -> return everything
 * - points at the origin (distance 0)
 * - ties in distance (any of the tied points is fine)
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function squaredDistance([x, y]) {
  return x * x + y * y;
}

function bruteForce(points, k) {
  return [...points].sort((a, b) => squaredDistance(a) - squaredDistance(b)).slice(0, k);
}

function optimal(points, k) {
  // max-heap by distance: top is the farthest of the current k candidates
  const maxHeap = new MinHeap((a, b) => squaredDistance(b) - squaredDistance(a));
  for (const point of points) {
    maxHeap.push(point);
    if (maxHeap.size() > k) maxHeap.pop(); // evict the farthest
  }
  return maxHeap.toArray();
}

// ---------- tests ----------
const assert = require('assert');
// order does not matter, so compare as sorted strings
function normalize(points) {
  return points.map((p) => p.join(',')).sort();
}
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve([[1, 3], [-2, 2]], 1)), normalize([[-2, 2]]));
  assert.deepStrictEqual(normalize(solve([[3, 3], [5, -1], [-2, 4]], 2)), normalize([[3, 3], [-2, 4]]));
  assert.deepStrictEqual(normalize(solve([[0, 0], [1, 1]], 2)), normalize([[0, 0], [1, 1]]));
  assert.deepStrictEqual(normalize(solve([[0, 1], [1, 0], [2, 2]], 2)), normalize([[0, 1], [1, 0]]));
  assert.deepStrictEqual(normalize(solve([[7, 7]], 1)), normalize([[7, 7]]));
}
console.log('✓ 04-k-closest-points passed');

module.exports = { optimal, bruteForce };
