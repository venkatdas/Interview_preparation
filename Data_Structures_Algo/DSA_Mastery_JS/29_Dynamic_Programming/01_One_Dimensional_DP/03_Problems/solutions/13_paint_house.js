/**
 * 13. Paint House   (LeetCode 256 — Medium)
 *
 * PROBLEM
 * There are n houses in a row. Painting house i with red/blue/green costs
 * costs[i][0] / costs[i][1] / costs[i][2]. No two adjacent houses may have
 * the same colour. Return the minimum total cost.
 *
 * EXAMPLES
 * Input: [[17,2,17],[16,16,5],[14,3,19]]   Output: 10
 *   Explanation: blue(2) + green(5) + blue(3) = 10
 * Input: [[7,6,2]]                           Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 100, exactly 3 colours
 * - Can the list be empty? (return 0)
 *
 * DP DEFINITION
 * STATE:       dp[i][c] = min cost to paint houses 0..i with house i coloured c
 * RECURRENCE:  dp[i][c] = costs[i][c] + min(dp[i-1][other colours])
 * BASE CASES:  dp[0][c] = costs[0][c]
 * ANSWER:      min(dp[n-1][0], dp[n-1][1], dp[n-1][2])
 *
 * Note: state is (index, colour) - the colour is the "what did I do last" piece
 * that the plain index can't capture. This is the gateway to state-machine DP.
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * For each house, try the two colours that differ from the previous one.
 *
 * APPROACH 2 — Memoization   O(n * 3) time, O(n * 3) space
 * APPROACH 3 — Tabulation   O(n * 3) time, O(n * 3) space
 * Dry run, costs = [[17,2,17],[16,16,5],[14,3,19]]:
 *   house : red    blue   green
 *   0     : 17     2      17
 *   1     : 16+2   16+17  5+2    -> 18   33   7
 *   2     : 14+7   3+7    19+18  -> 21   10   37
 *   answer = min(21, 10, 37) = 10
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 * Only the previous row (3 numbers) is needed.
 *
 * EDGE CASES
 * - One house -> min of its three costs
 * - Empty -> 0
 */

const COLOURS = [0, 1, 2];

function bruteForce(costs) {
  function minCostFrom(house, previousColour) {
    if (house === costs.length) return 0;
    let best = Infinity;
    for (const colour of COLOURS) {
      if (colour === previousColour) continue;
      best = Math.min(best, costs[house][colour] + minCostFrom(house + 1, colour));
    }
    return best;
  }
  return minCostFrom(0, -1);
}

function memo(costs) {
  const cache = new Map();
  function minCostFrom(house, previousColour) {
    if (house === costs.length) return 0;
    const key = house * 4 + (previousColour + 1); // pack two ints into one key
    if (cache.has(key)) return cache.get(key);
    let best = Infinity;
    for (const colour of COLOURS) {
      if (colour === previousColour) continue;
      best = Math.min(best, costs[house][colour] + minCostFrom(house + 1, colour));
    }
    cache.set(key, best);
    return best;
  }
  return minCostFrom(0, -1);
}

function tabulation(costs) {
  const n = costs.length;
  if (n === 0) return 0;
  const dp = costs.map(() => [0, 0, 0]);
  dp[0] = [...costs[0]];
  for (let house = 1; house < n; house++) {
    dp[house][0] = costs[house][0] + Math.min(dp[house - 1][1], dp[house - 1][2]);
    dp[house][1] = costs[house][1] + Math.min(dp[house - 1][0], dp[house - 1][2]);
    dp[house][2] = costs[house][2] + Math.min(dp[house - 1][0], dp[house - 1][1]);
  }
  return Math.min(...dp[n - 1]);
}

function optimized(costs) {
  if (costs.length === 0) return 0;
  let [red, blue, green] = costs[0];
  for (let house = 1; house < costs.length; house++) {
    const newRed = costs[house][0] + Math.min(blue, green);
    const newBlue = costs[house][1] + Math.min(red, green);
    const newGreen = costs[house][2] + Math.min(red, blue);
    red = newRed;
    blue = newBlue;
    green = newGreen;
  }
  return Math.min(red, blue, green);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[17, 2, 17], [16, 16, 5], [14, 3, 19]]), 10);
  assert.strictEqual(solve([[7, 6, 2]]), 2);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[1, 1, 1], [1, 1, 1]]), 2);
  assert.strictEqual(solve([[5, 8, 6], [19, 14, 13], [7, 5, 12], [14, 15, 17], [3, 20, 10]]), 43);
}
console.log('✓ 13-paint-house passed');

module.exports = { bruteForce, memo, tabulation, optimized };
