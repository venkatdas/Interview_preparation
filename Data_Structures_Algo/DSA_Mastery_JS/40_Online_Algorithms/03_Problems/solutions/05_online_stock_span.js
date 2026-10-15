/**
 * 05. Online Stock Span   (LeetCode 901 — Medium)
 *
 * PROBLEM
 * Prices arrive one per day. next(price) returns today's span: the number of consecutive
 * days ending today (including today) on which the price was <= today's price.
 *
 * EXAMPLES
 * prices 100, 80, 60, 70, 60, 75, 85
 * spans    1,  1,  1,  2,  1,  4,  6
 *   75 -> days 60,70,60,75 are all <= 75, the day before (80) is not -> 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 calls, prices positive integers. Equal prices count (<=).
 *
 * APPROACH 1 — Brute force   O(n) per call, O(n) space
 * Store all prices; walk backwards from today while price <= today's price.
 *
 * APPROACH 2 — Optimal (monotonic stack of [price, span])   O(1) amortised, O(n) space
 * Keep a stack with strictly DECREASING prices. Each entry stores how many days it "absorbed".
 * For a new price, pop every entry with price <= today and add its span to ours: those days
 * are all covered, and they can never stop a later span (today blocks them anyway).
 * Each price is pushed once and popped at most once -> O(1) amortised.
 *
 * Dry run:
 *   price  pops                 span  stack after
 *   100    -                    1     [100:1]
 *   80     -                    1     [100:1, 80:1]
 *   60     -                    1     [.., 80:1, 60:1]
 *   70     60:1                 2     [.., 80:1, 70:2]
 *   60     -                    1     [.., 70:2, 60:1]
 *   75     60:1, 70:2           4     [100:1, 80:1, 75:4]
 *   85     75:4, 80:1           6     [100:1, 85:6]
 *
 * EDGE CASES
 * - strictly increasing prices -> span = day number
 * - equal prices -> popped (<=), span accumulates
 * - first call -> 1
 */

function bruteForce() {
  const prices = [];
  return {
    next(price) {
      prices.push(price);
      let span = 0;
      for (let i = prices.length - 1; i >= 0 && prices[i] <= price; i--) span++;
      return span;
    },
  };
}

function optimal() {
  const stack = [];   // [price, span], prices strictly decreasing bottom -> top
  return {
    next(price) {
      let span = 1;
      while (stack.length && stack[stack.length - 1][0] <= price) span += stack.pop()[1];
      stack.push([price, span]);
      return span;
    },
  };
}

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const s1 = make();
  assert.deepStrictEqual([100, 80, 60, 70, 60, 75, 85].map(p => s1.next(p)), [1, 1, 1, 2, 1, 4, 6]);
  const inc = make();
  assert.deepStrictEqual([1, 2, 3, 4].map(p => inc.next(p)), [1, 2, 3, 4]);
  const eq = make();
  assert.deepStrictEqual([5, 5, 5].map(p => eq.next(p)), [1, 2, 3]);
  const dec = make();
  assert.deepStrictEqual([9, 8, 7].map(p => dec.next(p)), [1, 1, 1]);
}
let s = 9;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 50; t++) {
  const a = bruteForce(), b = optimal();
  for (let i = 0; i < 60; i++) {
    const p = 1 + Math.floor(rnd() * 20);
    assert.strictEqual(a.next(p), b.next(p));
  }
}
console.log('✓ 05_online_stock_span passed');

module.exports = { optimal, bruteForce };
