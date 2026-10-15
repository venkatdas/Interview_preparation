/**
 * 12. Hand of Straights   (LeetCode 846 — Medium)
 *
 * PROBLEM
 * You hold cards with integer values. You want to rearrange them into groups of exactly
 * groupSize consecutive cards (like 3,4,5). Return true if that is possible.
 *
 * EXAMPLES
 * Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3   Output: true   Explanation: [1,2,3],[2,3,4],[6,7,8]
 * Input: hand = [1,2,3,4,5], groupSize = 4            Output: false  Explanation: 5 is not divisible by 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Must every card be used? (yes)
 * - groupSize = 1? (always true)
 *
 * APPROACH 1 — Brute force   O(n! / ...) time
 * Backtracking: pick any unused card, try to build a group of consecutive cards from it,
 * recurse on the rest. Exponential.
 *
 * APPROACH 2 — Optimal (count map + start from the smallest)   O(n log n) time, O(n) space
 * Count cards. Repeatedly take the SMALLEST remaining value v and remove one copy of each
 * v, v+1, ..., v+groupSize-1. If any is missing, return false.
 *
 * WHY GREEDY WORKS
 * The smallest card has no smaller neighbour, so it can only be the FIRST card of its group.
 * That group is therefore forced to be [v, v+1, ..., v+groupSize-1] - there is no choice to
 * get wrong. Remove it and the argument repeats on what is left.
 *
 * Dry run on [1,2,3,6,2,3,4,7,8], groupSize 3:
 *   counts {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}
 *   smallest 1 -> remove 1,2,3 -> {2:1, 3:1, 4:1, 6:1, 7:1, 8:1}
 *   smallest 2 -> remove 2,3,4 -> {6:1, 7:1, 8:1}
 *   smallest 6 -> remove 6,7,8 -> {} -> true
 *
 * EDGE CASES
 * - hand.length % groupSize !== 0 -> false immediately
 * - groupSize = 1 -> true
 * - duplicates that need two overlapping groups ([1,1,2,2,3,3], 3) -> true
 */

function bruteForce(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;
  const cards = [...hand].sort((a, b) => a - b);
  const used = new Array(cards.length).fill(false);

  function go(remaining) {
    if (remaining === 0) return true;
    const first = used.indexOf(false);
    used[first] = true;
    const picked = [first];
    let ok = true;
    for (let k = 1; k < groupSize && ok; k++) {
      const want = cards[first] + k;
      const idx = cards.findIndex((card, i) => !used[i] && card === want);
      if (idx === -1) ok = false;
      else { used[idx] = true; picked.push(idx); }
    }
    const result = ok && go(remaining - groupSize);
    for (const i of picked) used[i] = false;
    return result;
  }
  return go(cards.length);
}

function optimal(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;

  const counts = new Map();
  for (const card of hand) counts.set(card, (counts.get(card) || 0) + 1);

  // process values from smallest to largest
  const values = [...counts.keys()].sort((a, b) => a - b);
  for (const value of values) {
    const need = counts.get(value);
    if (need === 0) continue;                       // already consumed by earlier groups
    for (let k = 0; k < groupSize; k++) {
      const next = value + k;
      const have = counts.get(next) || 0;
      if (have < need) return false;                // not enough of `next` to start `need` groups
      counts.set(next, have - need);
    }
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 6, 2, 3, 4, 7, 8], 3), true);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 4), false);
  assert.strictEqual(solve([1, 1, 2, 2, 3, 3], 3), true);
  assert.strictEqual(solve([1, 2, 4, 5], 2), true);
  assert.strictEqual(solve([1, 2, 4, 6], 2), false);
  assert.strictEqual(solve([5], 1), true);
  assert.strictEqual(solve([], 2), true);
  assert.strictEqual(solve([8, 10, 12], 3), false);
}
console.log('✓ 12-hand-of-straights passed');

module.exports = { optimal, bruteForce };
