/**
 * 01. Online Stock Span   (LeetCode 901 — Medium)
 *
 * PROBLEM
 * Prices arrive one per day. The span of today's price is the number of consecutive days
 * ending today (including today) whose price was <= today's price. Implement next(price)
 * that returns the span.
 *
 * EXAMPLES
 * next(100) -> 1, next(80) -> 1, next(60) -> 1, next(70) -> 2, next(60) -> 1,
 * next(75) -> 4 (75, 60, 70, 60), next(85) -> 6
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 calls -> O(n) per call is accepted but O(1) amortized is expected
 * - Equal prices count toward the span (<=)
 *
 * APPROACH 1 — Brute force   O(n) per call, O(n) space
 * Store every price. Walk backwards while prices are <= today's.
 *
 * APPROACH 2 — Optimal (Monotonic stack of (price, span))   O(1) amortized per call
 * Keep a stack where prices are strictly DECREASING from bottom to top. For a new price,
 * pop every entry with price <= today's and add their spans to today's span (those days are
 * "absorbed": any future price that beats today also beats them, so they never need to be
 * looked at again). Push (price, span).
 *
 * Dry run: 100, 80, 60, 70, 60, 75, 85
 *   100: stack [(100,1)]                                  -> 1
 *   80:  stack [(100,1),(80,1)]                           -> 1
 *   60:  stack [(100,1),(80,1),(60,1)]                    -> 1
 *   70:  pop (60,1): span 2; stack [(100,1),(80,1),(70,2)] -> 2
 *   60:  stack [..., (70,2), (60,1)]                      -> 1
 *   75:  pop (60,1) -> 2, pop (70,2) -> 4; stack [(100,1),(80,1),(75,4)] -> 4
 *   85:  pop (75,4) -> 5, pop (80,1) -> 6; stack [(100,1),(85,6)]          -> 6
 *
 * EDGE CASES
 * - strictly increasing prices -> spans 1, 2, 3, ... (stack has one element)
 * - strictly decreasing prices -> all spans 1
 * - equal prices -> spans grow
 */

class StockSpannerBrute {
  constructor() {
    this.prices = [];
  }
  next(price) {
    this.prices.push(price);
    let span = 0;
    for (let i = this.prices.length - 1; i >= 0 && this.prices[i] <= price; i--) span++;
    return span;
  }
}

class StockSpanner {
  constructor() {
    this.stack = []; // [price, span], prices strictly decreasing bottom -> top
  }
  next(price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length - 1][0] <= price) {
      span += this.stack.pop()[1];   // absorb the popped day's span
    }
    this.stack.push([price, span]);
    return span;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [StockSpannerBrute, StockSpanner]) {
  const s = new Cls();
  assert.deepStrictEqual([100, 80, 60, 70, 60, 75, 85].map((p) => s.next(p)), [1, 1, 1, 2, 1, 4, 6]);
  const inc = new Cls();
  assert.deepStrictEqual([1, 2, 3, 4].map((p) => inc.next(p)), [1, 2, 3, 4]);
  const dec = new Cls();
  assert.deepStrictEqual([4, 3, 2, 1].map((p) => dec.next(p)), [1, 1, 1, 1]);
  const eq = new Cls();
  assert.deepStrictEqual([5, 5, 5].map((p) => eq.next(p)), [1, 2, 3]);
}
for (let trial = 0; trial < 50; trial++) {
  const a = new StockSpannerBrute();
  const b = new StockSpanner();
  for (let i = 0; i < 50; i++) {
    const price = Math.floor(Math.random() * 10);
    assert.strictEqual(b.next(price), a.next(price));
  }
}
console.log('✓ 01-online-stock-span passed');

module.exports = { StockSpanner, StockSpannerBrute, optimal: StockSpanner, bruteForce: StockSpannerBrute };
