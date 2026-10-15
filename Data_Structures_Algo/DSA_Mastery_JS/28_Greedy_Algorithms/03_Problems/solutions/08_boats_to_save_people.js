/**
 * 08. Boats to Save People   (LeetCode 881 — Medium)
 *
 * PROBLEM
 * people[i] is the weight of person i. Each boat carries at most 2 people and at most
 * `limit` total weight. Every person weighs <= limit. Return the minimum number of boats.
 *
 * EXAMPLES
 * Input: people = [1,2], limit = 3       Output: 1   Explanation: (1,2)
 * Input: people = [3,2,2,1], limit = 3   Output: 3   Explanation: (1,2), (2), (3)
 * Input: people = [3,5,3,4], limit = 5   Output: 4   Explanation: nobody can pair up
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - At most 2 per boat, never 3? (yes - this is what makes two pointers enough)
 * - Can a person weigh more than limit? (no)
 *
 * APPROACH 1 — Brute force   O(n!) time
 * Try every way of pairing people (or leaving them alone) via backtracking; keep the min.
 *
 * APPROACH 2 — Optimal (sort + two pointers)   O(n log n) time, O(1) extra
 * Sort. Pointers at the lightest and heaviest. The heaviest person ALWAYS boards a boat now.
 * If the lightest fits with them, the lightest boards too. Either way, one boat is used.
 *
 * WHY GREEDY WORKS
 * The heaviest person must go in some boat. The best possible partner for them is the
 * lightest person (the only one guaranteed to fit if anyone does). Exchange argument: if an
 * optimal plan pairs the heaviest with someone else (or alone) and the lightest with a third
 * person, swap partners - all weight limits still hold (lightest <= anyone), boat count
 * unchanged. So pairing heaviest+lightest is always safe.
 *
 * Dry run on [3,2,2,1], limit 3:
 *   sorted [1,2,2,3], light=0, heavy=3
 *   1+3 > 3 -> 3 goes alone, heavy=2, boats=1
 *   1+2 <= 3 -> pair, light=1, heavy=1, boats=2
 *   light == heavy: 2 goes alone, boats=3
 *
 * EDGE CASES
 * - one person -> 1
 * - everyone exactly limit -> n boats
 * - empty -> 0
 */

function bruteForce(people, limit) {
  const used = new Array(people.length).fill(false);
  let best = Infinity;

  function go(boats) {
    const first = used.indexOf(false);
    if (first === -1) { best = Math.min(best, boats); return; }
    if (boats >= best) return;                   // prune
    used[first] = true;
    go(boats + 1);                               // alone
    for (let j = first + 1; j < people.length; j++) {
      if (!used[j] && people[first] + people[j] <= limit) {
        used[j] = true;
        go(boats + 1);                           // paired with j
        used[j] = false;
      }
    }
    used[first] = false;
  }
  go(0);
  return best === Infinity ? 0 : best;
}

function optimal(people, limit) {
  const sorted = [...people].sort((a, b) => a - b);
  let light = 0;
  let heavy = sorted.length - 1;
  let boats = 0;
  while (light <= heavy) {
    if (sorted[light] + sorted[heavy] <= limit) light++; // lightest rides along
    heavy--;                                             // heaviest always boards now
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
  assert.strictEqual(solve([2, 2, 2, 2], 4), 2);
  assert.strictEqual(solve([1, 1, 1, 1], 1), 4);
}
console.log('✓ 08-boats-to-save-people passed');

module.exports = { optimal, bruteForce };
