/**
 * 10. H-Index   (LeetCode 274 — Medium)
 *
 * PROBLEM
 * Given citations[i] = number of citations of a researcher's i-th paper, return the
 * h-index: the largest h such that the researcher has at least h papers with >= h
 * citations each.
 *
 * EXAMPLES
 * Input: [3,0,6,1,5]   Output: 3   (3 papers with >= 3 citations: 3, 6, 5; not 4 papers with >= 4)
 * Input: [1,3,1]       Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 5000, citations up to 1000 (but h can never exceed n!)
 * - Zero citations everywhere -> 0
 *
 * APPROACH 1 — Brute force (sort descending, scan)   O(n log n) time
 * Sort descending. Walk i = 0..n-1: while citations[i] >= i + 1, h = i + 1.
 * The first time the (i+1)-th paper has fewer than i+1 citations, stop.
 *
 * APPROACH 2 — Optimal (counting sort capped at n)   O(n) time, O(n) space
 * h is at most n, so citations above n are "as good as n". Count papers per citation
 * count in buckets 0..n (cap at n). Then walk h from n down to 0, accumulating how many
 * papers have >= h citations; the first h where that running total >= h is the answer.
 *
 * Dry run [3,0,6,1,5], n=5:
 *   buckets (capped): 0:1, 1:1, 3:1, 5:2   (6 counts as 5)
 *   h=5: papers >= 5 = 2 < 5
 *   h=4: 2 < 4
 *   h=3: 2 + 1 = 3 >= 3 -> answer 3
 *
 * EDGE CASES
 * - [0] -> 0; [100] -> 1 (one paper with >= 1 citation)
 * - all equal [5,5,5] -> 3
 * - [] -> 0
 */

function bruteForce(citations) {
  const sorted = [...citations].sort((a, b) => b - a);
  let h = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] >= i + 1) h = i + 1;   // (i+1) papers each with >= (i+1) citations
    else break;
  }
  return h;
}

function optimal(citations) {
  const n = citations.length;
  const counts = new Array(n + 1).fill(0);
  for (const c of citations) counts[Math.min(c, n)]++;   // anything above n behaves like n

  let papersWithAtLeastH = 0;
  for (let h = n; h >= 0; h--) {
    papersWithAtLeastH += counts[h];
    if (papersWithAtLeastH >= h) return h;
  }
  return 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 0, 6, 1, 5]), 3);
  assert.strictEqual(solve([1, 3, 1]), 1);
  assert.strictEqual(solve([0]), 0);
  assert.strictEqual(solve([100]), 1);
  assert.strictEqual(solve([5, 5, 5]), 3);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([0, 0, 0]), 0);
  assert.strictEqual(solve([1, 1, 1, 1, 1]), 1);
  assert.strictEqual(solve([10, 8, 5, 4, 3]), 4);
}
for (let trial = 0; trial < 200; trial++) {
  const input = Array.from({ length: Math.floor(Math.random() * 15) }, () => Math.floor(Math.random() * 12));
  assert.strictEqual(optimal(input), bruteForce(input));
}
console.log('✓ 10-h-index passed');

module.exports = { optimal, bruteForce };
