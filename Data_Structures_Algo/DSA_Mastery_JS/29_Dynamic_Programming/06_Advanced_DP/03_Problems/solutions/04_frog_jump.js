/**
 * 04. Frog Jump   (LeetCode 403 — Hard)
 *
 * PROBLEM
 * A frog crosses a river on stones placed at the given sorted positions. It starts on
 * stone 0 with a first jump of exactly 1 unit. If its last jump was k units, the next
 * jump must be k - 1, k or k + 1 units (and only forward, landing on a stone).
 * Can the frog reach the last stone?
 *
 * EXAMPLES
 * Input: [0,1,3,5,6,8,12,17]    Output: true
 *   Explanation: 0->1 (1), 1->3 (2), 3->5 (2), 5->8 (3), 8->12 (4), 12->17 (5)
 * Input: [0,1,2,3,4,8,9,11]     Output: false   Explanation: the gap 4 -> 8 is too big
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 2 <= n <= 2000, stones strictly increasing, stones[0] = 0.
 * - The first jump must be exactly 1, so if stones[1] != 1 the answer is false.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(3^n) time, O(n) space
 * canCross(index, lastJump): try jumps lastJump - 1, lastJump, lastJump + 1, look up
 * whether a stone exists at that position (Map position -> index), recurse.
 *
 * APPROACH 2 — Memoised recursion (Map key trick)   O(n^2) time, O(n^2) space
 * STATE      reach(i, k) = can we reach the end standing on stone i, having arrived
 *            with a jump of size k?
 * RECURRENCE reach(i, k) = OR over step in {k-1, k, k+1}, step > 0:
 *                          there is a stone j at stones[i] + step  AND  reach(j, step)
 * BASE CASES reach(last, anything) = true.
 * The jump size k can be at most i (you add at most 1 per stone), so there are at most
 * n * n states. Key the memo with `${i},${k}`.
 *
 * APPROACH 3 — Tabulation with a set of jump sizes per stone   O(n^2) time, O(n^2) space
 * dp[i] = Set of jump sizes that can land ON stone i. Process stones left to right:
 * for every k in dp[i], for step in {k-1, k, k+1} (step > 0), if stones[i] + step is a
 * stone j, add step to dp[j]. Answer: dp[last] is non-empty.
 *
 * Dry run [0,1,3,5,6,8,12,17]:
 *   dp[0] = {0}  (pretend we arrived with jump 0 so the first jump can be 1)
 *   stone 0 (pos 0): k=0 -> step 1 -> pos 1 is stone 1 -> dp[1] = {1}
 *   stone 1 (pos 1): k=1 -> steps 1,2 -> pos 2 (no stone), pos 3 -> dp[2] = {2}
 *   stone 2 (pos 3): k=2 -> steps 1,2,3 -> pos 4 no, pos 5 -> dp[3]={2}, pos 6 -> dp[4]={3}
 *   ...continues until dp[7] gets a value -> true
 *
 * EDGE CASES
 * - stones[1] !== 1 -> false immediately
 * - two stones [0,1] -> true
 */

function bruteForce(stones) {
  const indexOfPosition = new Map(stones.map((position, index) => [position, index]));
  const last = stones.length - 1;
  function canCross(index, lastJump) {
    if (index === last) return true;
    for (const step of [lastJump - 1, lastJump, lastJump + 1]) {
      if (step <= 0) continue;
      const next = indexOfPosition.get(stones[index] + step);
      if (next !== undefined && canCross(next, step)) return true;
    }
    return false;
  }
  return canCross(0, 0);
}

function memo(stones) {
  const indexOfPosition = new Map(stones.map((position, index) => [position, index]));
  const last = stones.length - 1;
  const cache = new Map(); // key `${index},${lastJump}` -> boolean
  function canCross(index, lastJump) {
    if (index === last) return true;
    const key = `${index},${lastJump}`;
    if (cache.has(key)) return cache.get(key);
    let result = false;
    for (const step of [lastJump - 1, lastJump, lastJump + 1]) {
      if (step <= 0) continue;
      const next = indexOfPosition.get(stones[index] + step);
      if (next !== undefined && canCross(next, step)) { result = true; break; }
    }
    cache.set(key, result);
    return result;
  }
  return canCross(0, 0);
}

function tabulation(stones) {
  const n = stones.length;
  const indexOfPosition = new Map(stones.map((position, index) => [position, index]));
  const jumpsInto = Array.from({ length: n }, () => new Set()); // dp[i]
  jumpsInto[0].add(0);
  for (let i = 0; i < n; i++) {
    for (const k of jumpsInto[i]) {
      for (const step of [k - 1, k, k + 1]) {
        if (step <= 0) continue;
        const next = indexOfPosition.get(stones[i] + step);
        if (next !== undefined) jumpsInto[next].add(step);
      }
    }
  }
  return jumpsInto[n - 1].size > 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([0, 1, 3, 5, 6, 8, 12, 17]), true);
  assert.strictEqual(solve([0, 1, 2, 3, 4, 8, 9, 11]), false);
  assert.strictEqual(solve([0, 1]), true);
  assert.strictEqual(solve([0, 2]), false);        // first jump must be 1
  assert.strictEqual(solve([0, 1, 3, 6, 10, 15, 16, 21]), true);
  assert.strictEqual(solve([0, 1, 3, 6, 7]), false);
}
console.log('✓ 04-frog-jump passed');

module.exports = { bruteForce, memo, tabulation };
