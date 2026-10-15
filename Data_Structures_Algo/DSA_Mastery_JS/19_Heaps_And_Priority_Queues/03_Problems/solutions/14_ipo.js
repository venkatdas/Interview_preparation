/**
 * 14. IPO   (LeetCode 502 — Hard)
 *
 * PROBLEM
 * You have capital w and can do at most k projects. Project i needs at least
 * capital[i] to start and adds profits[i] to your capital when done (profit is
 * pure gain; the capital is not spent). Return the maximum capital after at
 * most k projects.
 *
 * EXAMPLES
 * Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]   Output: 4
 *   Explanation: with 0 only project 0 is allowed (+1 -> 1); now projects 1 and 2 are
 *   allowed, pick profit 3 -> 4
 * Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]   Output: 6
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Each project at most once? (yes)
 * - Does capital get consumed? (no, it is only a requirement)
 * - n up to 10^5, k up to 10^5 -> need about n log n
 *
 * APPROACH 1 — Brute force   O(k * n) time, O(n) space
 * Repeat k times: scan all unused projects, pick the affordable one with the
 * highest profit, add it. Greedy is correct (more capital never hurts), but
 * each scan is O(n).
 *
 * APPROACH 2 — Optimal (two heaps)   O((n + k) log n) time, O(n) space
 * Two heaps make the greedy fast:
 *   byCapital = MIN-heap of all projects keyed by required capital
 *   byProfit  = MAX-heap of currently AFFORDABLE projects keyed by profit
 * Repeat k times:
 *   1. move every project with capital <= w from byCapital to byProfit
 *      (each project moves at most once overall)
 *   2. if byProfit is empty -> nothing affordable, stop
 *   3. w += byProfit.pop()
 *
 * Dry run on k = 2, w = 0, profits [1,2,3], capital [0,1,1]:
 *   byCapital {(0,p1),(1,p2),(1,p3)}
 *   round 1: move (0,p1) -> byProfit {1}; pop 1 -> w = 1
 *   round 2: move (1,p2),(1,p3) -> byProfit {3,2}; pop 3 -> w = 4
 *   answer 4
 *
 * EDGE CASES
 * - k = 0 -> w unchanged
 * - nothing affordable at the start -> w unchanged
 * - k > number of projects -> stop early
 * - profits of 0
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function bruteForce(k, w, profits, capital) {
  const used = new Array(profits.length).fill(false);
  for (let round = 0; round < k; round++) {
    let bestIndex = -1;
    for (let i = 0; i < profits.length; i++) {
      if (used[i] || capital[i] > w) continue;
      if (bestIndex === -1 || profits[i] > profits[bestIndex]) bestIndex = i;
    }
    if (bestIndex === -1) break;
    used[bestIndex] = true;
    w += profits[bestIndex];
  }
  return w;
}

function optimal(k, w, profits, capital) {
  const projects = profits.map((profit, i) => [capital[i], profit]);
  const byCapital = MinHeap.from(projects, (a, b) => a[0] - b[0]); // cheapest requirement on top
  const byProfit = new MinHeap((a, b) => b - a); // max-heap of affordable profits

  for (let round = 0; round < k; round++) {
    // unlock every project we can now afford
    while (!byCapital.isEmpty() && byCapital.peek()[0] <= w) {
      byProfit.push(byCapital.pop()[1]);
    }
    if (byProfit.isEmpty()) break; // nothing affordable, more rounds will not help
    w += byProfit.pop(); // take the most profitable affordable project
  }
  return w;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(2, 0, [1, 2, 3], [0, 1, 1]), 4);
  assert.strictEqual(solve(3, 0, [1, 2, 3], [0, 1, 2]), 6);
  assert.strictEqual(solve(0, 5, [1, 2], [0, 0]), 5);
  assert.strictEqual(solve(2, 0, [1, 2], [1, 1]), 0);
  assert.strictEqual(solve(10, 1, [5, 1], [0, 0]), 7);
  assert.strictEqual(solve(1, 2, [1, 2, 3], [1, 1, 3]), 4);
}
console.log('✓ 14-ipo passed');

module.exports = { optimal, bruteForce };
