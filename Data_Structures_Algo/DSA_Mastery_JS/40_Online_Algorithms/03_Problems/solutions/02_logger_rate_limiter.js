/**
 * 02. Logger Rate Limiter   (LeetCode 359 — Easy)
 *
 * PROBLEM
 * Messages arrive with a timestamp in seconds (non-decreasing). shouldPrintMessage(t, msg)
 * returns true if this exact message was NOT printed in the last 10 seconds, i.e. it is
 * printed now and blocked until t + 10. Otherwise it returns false (and is not printed).
 *
 * EXAMPLES
 * (1,"foo") -> true    next allowed "foo" at 11
 * (2,"bar") -> true    next allowed "bar" at 12
 * (3,"foo") -> false
 * (8,"bar") -> false
 * (10,"foo")-> false
 * (11,"foo")-> true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Timestamps non-decreasing? (yes)  - Can two messages share a timestamp? (yes)
 * - Is a blocked call counted as a print? (no — only printed messages reset the clock)
 * - Memory: unbounded number of distinct messages? (discuss cleanup)
 *
 * APPROACH 1 — Brute force   O(n) per call, O(n) space
 * Keep a list of every printed (time, msg). For a new call scan the list for the same message
 * printed within the last 10 seconds.
 *
 * APPROACH 2 — Optimal (hash map msg -> next allowed time)   O(1) per call, O(m) space
 * map.get(msg) is the earliest time it may print again. If t >= that time (or absent),
 * print and set map[msg] = t + 10.
 *
 * Dry run:
 *   t   msg   map before        allowed?  map after
 *   1   foo   {}                yes       {foo:11}
 *   2   bar   {foo:11}          yes       {foo:11, bar:12}
 *   3   foo   {foo:11,bar:12}   3<11 no   unchanged
 *   11  foo   {foo:11,bar:12}   11>=11 yes {foo:21, bar:12}
 *
 * Memory follow-up: the map grows with distinct messages. Keep a queue of (time, msg) for
 * printed messages and evict entries older than 10 s, so memory is bounded by the number of
 * messages printed in the last 10 seconds.
 *
 * EDGE CASES
 * - exactly 10 seconds later -> allowed (>=, not >)
 * - same timestamp, same message twice -> second is false
 * - blocked call must not extend the block
 */

function bruteForce() {
  const printed = [];
  return {
    shouldPrintMessage(t, msg) {
      for (const [pt, pm] of printed) if (pm === msg && t - pt < 10) return false;
      printed.push([t, msg]);
      return true;
    },
  };
}

function optimal() {
  const nextAllowed = new Map();
  return {
    shouldPrintMessage(t, msg) {
      const when = nextAllowed.get(msg);
      if (when !== undefined && t < when) return false;
      nextAllowed.set(msg, t + 10);
      return true;
    },
  };
}

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const L = make();
  const calls = [[1, 'foo'], [2, 'bar'], [3, 'foo'], [8, 'bar'], [10, 'foo'], [11, 'foo']];
  assert.deepStrictEqual(calls.map(([t, m]) => L.shouldPrintMessage(t, m)), [true, true, false, false, false, true]);
  const L2 = make();
  assert.strictEqual(L2.shouldPrintMessage(0, 'a'), true);
  assert.strictEqual(L2.shouldPrintMessage(0, 'a'), false);   // same timestamp
  assert.strictEqual(L2.shouldPrintMessage(9, 'a'), false);
  assert.strictEqual(L2.shouldPrintMessage(10, 'a'), true);   // exactly 10 later
  assert.strictEqual(L2.shouldPrintMessage(10, 'b'), true);
}
let s = 3;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let trial = 0; trial < 30; trial++) {
  const a = bruteForce(), b = optimal();
  let t = 0;
  for (let i = 0; i < 100; i++) {
    t += Math.floor(rnd() * 4);
    const m = 'm' + Math.floor(rnd() * 4);
    assert.strictEqual(a.shouldPrintMessage(t, m), b.shouldPrintMessage(t, m));
  }
}
console.log('✓ 02_logger_rate_limiter passed');

module.exports = { optimal, bruteForce };
