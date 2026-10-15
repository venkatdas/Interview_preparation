/**
 * 01. Moving Average from Data Stream   (LeetCode 346 — Easy)
 *
 * PROBLEM
 * Build a class created with a window size. Each call next(val) adds a number from the
 * stream and returns the average of the last `size` numbers (or of all numbers so far if
 * fewer than `size` have arrived).
 *
 * EXAMPLES
 * size = 3
 * next(1)  -> 1
 * next(10) -> 5.5          (1 + 10) / 2
 * next(3)  -> 4.66667      (1 + 10 + 3) / 3
 * next(5)  -> 6            (10 + 3 + 5) / 3   the 1 fell out of the window
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - size >= 1? (yes)  - values can be negative? (yes, any integer)
 * - Up to 10^4 calls. Floating-point result is fine.
 *
 * APPROACH 1 — Brute force   O(size) per call, O(n) space
 * Push every value into an array; on each call sum the last `size` values.
 *
 * APPROACH 2 — Optimal (circular buffer + running sum)   O(1) per call, O(size) space
 * Keep a fixed array of length size, a write pointer `head`, a `count` and a running `sum`.
 * When the window is full, the slot we are about to overwrite holds the OLDEST value:
 * subtract it from sum, write the new value, add it to sum.
 *
 * Dry run, size = 3:
 *   call  val  buf          head  count  sum  return
 *   1     1    [1,_,_]      1     1      1    1
 *   2     10   [1,10,_]     2     2      11   5.5
 *   3     3    [1,10,3]     0     3      14   4.667
 *   4     5    [5,10,3]     1     3      18   6       (evicted buf[0]=1)
 *
 * EDGE CASES
 * - size = 1 -> always returns the last value
 * - fewer values than size -> divide by count, not size
 * - negative values work the same
 */

function bruteForce(size) {
  const all = [];
  return {
    next(val) {
      all.push(val);
      const w = all.slice(-size);
      return w.reduce((a, b) => a + b, 0) / w.length;
    },
  };
}

function optimal(size) {
  const buf = new Array(size);
  let head = 0, count = 0, sum = 0;
  return {
    next(val) {
      if (count === size) sum -= buf[head];   // overwrite the oldest value
      else count++;
      buf[head] = val;
      sum += val;
      head = (head + 1) % size;
      return sum / count;
    },
  };
}

// ---------- tests ----------
const assert = require('assert');
const near = (a, b) => Math.abs(a - b) < 1e-9;
for (const make of [bruteForce, optimal]) {
  const m = make(3);
  assert.ok(near(m.next(1), 1));
  assert.ok(near(m.next(10), 5.5));
  assert.ok(near(m.next(3), 14 / 3));
  assert.ok(near(m.next(5), 6));
  const one = make(1);
  assert.strictEqual(one.next(7), 7);
  assert.strictEqual(one.next(-2), -2);
  const neg = make(2);
  neg.next(-4);
  assert.strictEqual(neg.next(-6), -5);
}
let seed = 7;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 50; t++) {
  const size = 1 + Math.floor(rnd() * 6);
  const a = bruteForce(size), b = optimal(size);
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(rnd() * 200) - 100;
    assert.ok(near(a.next(x), b.next(x)));
  }
}
console.log('✓ 01_moving_average_from_data_stream passed');

module.exports = { optimal, bruteForce };
