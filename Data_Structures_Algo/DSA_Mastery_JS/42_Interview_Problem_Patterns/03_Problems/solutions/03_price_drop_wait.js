/**
 * 03. Price Drop Wait   (Original — Medium)
 *
 * PROBLEM
 * prices[i] is the price of a gadget on day i. For every day, a shopper wants to know how
 * many days they must wait until the price is STRICTLY LOWER than today's. If it never
 * drops, the answer for that day is 0. Return the array of waits.
 *
 * EXAMPLES
 * prices = [50, 55, 45, 60, 40]  -> [2, 1, 2, 1, 0]
 * prices = [10, 10, 9]           -> [2, 1, 0]   (equal is not lower)
 * prices = [1, 2, 3]             -> [0, 0, 0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^5, prices are positive integers.
 * - "Lower" means strictly lower (equal prices do not count).
 *
 * PATTERN: monotonic stack (next smaller element). Clues: "for every day", "until the first
 * day that is lower", n up to 10^5 so the O(n^2) scan is too slow.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) extra space
 * For each i scan j = i+1.. until prices[j] < prices[i].
 *
 * APPROACH 2 — Optimal (monotonic stack)   O(n) time, O(n) space
 * Keep a stack of day indices whose answer is still unknown. Their prices are NON-DECREASING
 * from bottom to top (a lower day would already have resolved the ones above it).
 * For day i: while the top's price > prices[i], day i is the first lower day for the top:
 * answer[top] = i - top, pop. Then push i.
 *
 * Dry run on [50, 55, 45, 60, 40]:
 *   i=0 50: stack [0]
 *   i=1 55: 50 > 55? no; stack [0,1]
 *   i=2 45: pop 1 (55>45) ans[1]=1; pop 0 (50>45) ans[0]=2; stack [2]
 *   i=3 60: stack [2,3]
 *   i=4 40: pop 3 ans[3]=1; pop 2 ans[2]=2; stack [4]
 *   left on stack: day 4 -> 0.   Result [2,1,2,1,0]
 *
 * EDGE CASES
 * - empty -> [];  strictly increasing -> all 0;  equal prices do not resolve each other.
 */

function bruteForce(prices) {
  const res = new Array(prices.length).fill(0);
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[j] < prices[i]) { res[i] = j - i; break; }
    }
  }
  return res;
}

function optimal(prices) {
  const res = new Array(prices.length).fill(0);
  const stack = []; // indices with unresolved answers, prices non-decreasing bottom -> top
  for (let i = 0; i < prices.length; i++) {
    while (stack.length && prices[stack[stack.length - 1]] > prices[i]) {
      const day = stack.pop();
      res[day] = i - day;
    }
    stack.push(i);
  }
  return res;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([50, 55, 45, 60, 40]), [2, 1, 2, 1, 0]);
  assert.deepStrictEqual(solve([10, 10, 9]), [2, 1, 0]);
  assert.deepStrictEqual(solve([1, 2, 3]), [0, 0, 0]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([7]), [0]);
  assert.deepStrictEqual(solve([5, 4, 3]), [1, 1, 0]);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3);
for (let t = 0; t < 300; t++) {
  const arr = Array.from({ length: Math.floor(rand() * 20) }, () => 1 + Math.floor(rand() * 8));
  assert.deepStrictEqual(optimal(arr), bruteForce(arr));
}
console.log('✓ 03_price_drop_wait passed');

module.exports = { optimal, bruteForce };
