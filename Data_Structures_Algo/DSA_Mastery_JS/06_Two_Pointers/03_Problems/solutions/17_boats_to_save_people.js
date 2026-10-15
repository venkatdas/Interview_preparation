/**
 * 17. Boats to Save People   (LeetCode 881 — Medium)
 *
 * PROBLEM
 * people[i] is the weight of person i. Each boat carries at most 2 people and at most
 * `limit` total weight. Every person weighs <= limit. Return the minimum number of boats.
 *
 * EXAMPLES
 * Input: people = [1, 2], limit = 3         Output: 1   Explanation: (1, 2)
 * Input: people = [3, 2, 2, 1], limit = 3   Output: 3   Explanation: (1, 2), (2), (3)
 * Input: people = [3, 5, 3, 4], limit = 5   Output: 4   Explanation: nobody can share
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - At most 2 per boat, not "as many as fit"? (yes, exactly this rule makes two pointers work)
 * - Every person fits alone? (guaranteed)
 * - Can I sort? (yes)
 *
 * APPROACH 1 — Brute force   exponential
 * Try all ways of pairing people. Only to illustrate; we implement a small backtracking
 * version for tests on tiny inputs.
 *
 * APPROACH 2 — Optimal (sort + greedy opposite ends)   O(n log n) time, O(1) extra space
 * Sort. The HEAVIEST person must take a boat. Who should share it? The LIGHTEST person
 * is the best candidate: if even the lightest can't fit with the heaviest, nobody can,
 * and the heaviest goes alone. If the lightest fits, pairing them is never worse than
 * pairing the lightest with someone else (exchange argument: any other partner could be
 * swapped in later).
 *   light = 0, heavy = n - 1
 *   while light <= heavy:
 *     if people[light] + people[heavy] <= limit: light++   (they share)
 *     heavy--                                              (heavy always boards)
 *     boats++
 *
 * Dry run on sorted [1, 2, 2, 3], limit 3:
 *   light=0(1) heavy=3(3): 1+3=4 > 3 -> heavy alone. heavy=2, boats=1
 *   light=0(1) heavy=2(2): 1+2=3 <= 3 -> share. light=1, heavy=1, boats=2
 *   light=1(2) heavy=1(2): same person -> boards alone. heavy=0, boats=3
 *   light > heavy stop. 3
 *
 * EDGE CASES
 * - One person -> 1
 * - Everyone exactly limit -> n boats
 * - All pairs fit -> ceil(n / 2)
 * - Empty -> 0
 */

function bruteForce(people, limit) {
  // backtracking: pick the first unassigned person, either alone or with any partner
  const used = new Array(people.length).fill(false);
  function solve() {
    const first = used.indexOf(false);
    if (first === -1) return 0;
    used[first] = true;
    let best = 1 + solve(); // alone
    for (let partner = first + 1; partner < people.length; partner++) {
      if (!used[partner] && people[first] + people[partner] <= limit) {
        used[partner] = true;
        best = Math.min(best, 1 + solve());
        used[partner] = false;
      }
    }
    used[first] = false;
    return best;
  }
  return solve();
}

function optimal(people, limit) {
  const sorted = [...people].sort((a, b) => a - b);
  let light = 0;
  let heavy = sorted.length - 1;
  let boats = 0;

  while (light <= heavy) {
    if (sorted[light] + sorted[heavy] <= limit) light++; // lightest rides along
    heavy--; // heaviest always takes this boat
    boats++;
  }
  return boats;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2], 3), 1);
  assert.strictEqual(solve([3, 2, 2, 1], 3), 3);
  assert.strictEqual(solve([3, 5, 3, 4], 5), 4);
  assert.strictEqual(solve([5], 5), 1);
  assert.strictEqual(solve([], 5), 0);
  assert.strictEqual(solve([1, 1, 1, 1], 2), 2);
  assert.strictEqual(solve([2, 4], 5), 2);
  assert.strictEqual(solve([1, 1, 1, 1, 1], 10), 3);
}
console.log('✓ 17-boats-to-save-people passed');

module.exports = { optimal, bruteForce };
