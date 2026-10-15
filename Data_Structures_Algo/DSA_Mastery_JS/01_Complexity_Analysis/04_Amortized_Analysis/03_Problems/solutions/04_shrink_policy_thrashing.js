/**
 * 04. Shrink Policy Thrashing   (Original — Medium)
 *
 * PROBLEM
 * A dynamic array doubles when a push finds it full, and halves its capacity after a pop
 * when it becomes "too empty". Two shrink rules are proposed:
 *   - naive:  shrink when size <= capacity / 2
 *   - safe:   shrink when size <= capacity / 4
 * Given a sequence of operations ('push' or 'pop'), simulate the array and return
 * { values, copies } where values are the popped values and copies counts element copies
 * during resizes. Build an adversarial sequence that makes the naive rule cost Θ(n) per
 * operation, and show the safe rule stays O(1) amortized for ANY sequence.
 *
 * EXAMPLES
 * ops: push x4 (values 0..3), then push, pop, push, pop (alternating at the boundary)
 *   after 4 pushes: cap 4, size 4 (copies so far 1 + 2 = 3)
 *   naive: push #5 -> grow to 8 (4 copies); pop -> size 4 <= 8/2 -> shrink to 4 (4 copies);
 *          push -> full -> grow to 8 (4 copies); pop -> shrink again (4 copies) ...
 *          every operation copies about n elements
 *   safe:  after growing to 8, a pop leaves size 4 > 8/4: no more resizes
 *   values popped (both rules): [4, 5]
 * ops: ['pop'] on empty -> values [null]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Popping an empty array returns null and does nothing.
 * - Capacity never drops below 1.
 *
 * APPROACH 1 — Brute force (naive shrink at 1/2)   Θ(n) per op in the worst case
 * Right after a resize (in either direction) the array is exactly half full, so ONE
 * push or pop can trigger the next resize: alternating push/pop at a power of two
 * resizes on every operation -> Θ(n²) total for n operations.
 *
 * APPROACH 2 — Optimal (shrink at 1/4)   O(1) amortized
 * After any resize the array is half full. To trigger the next grow you need about
 * capacity/2 pushes; to trigger the next shrink you need about capacity/4 pops.
 * Either way, Θ(capacity) cheap operations pay for the Θ(capacity) copies of the
 * next resize (accounting: charge 3 per op). Total copies <= 3·(number of ops).
 *
 * Dry run (safe), start cap 8 size 5: pop -> 4 (4 > 2, no shrink), pop -> 3, pop -> 2 -> 2 <= 8/4 -> shrink to 4 (copy 2).
 *   Now size 2 of cap 4: half full again.
 *
 * EDGE CASES
 * - pop on empty -> null
 * - the very first pushes (cap 1 -> 2 -> 4) count as copies too
 * - long pop runs: capacity keeps halving, never below 1
 *
 * COMMON MISTAKES
 * - Shrinking at 1/2 "to save memory" (thrashing).
 * - Shrinking by more than half (e.g. to exactly size): the next push resizes immediately.
 */
const { DynamicArray, mulberry32 } = require('../../02_Implementations/amortized_structures');

function run(ops, shrinkAt) {
  const arr = new DynamicArray({ shrinkAt });
  const values = [];
  let next = 0;
  for (const op of ops) {
    if (op === 'push') arr.push(next++);
    else values.push(arr.size ? arr.pop() : null);
  }
  return { values, copies: arr.copies };
}

const bruteForce = ops => run(ops, 0.5);
const optimal = ops => run(ops, 0.25);

function adversarial(n, rounds) {
  const ops = Array.from({ length: n }, () => 'push'); // n a power of two: array exactly full
  for (let i = 0; i < rounds; i++) ops.push('push', 'pop');
  return ops;
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal(['pop']), { values: [null], copies: 0 });
assert.deepStrictEqual(bruteForce(['pop']), { values: [null], copies: 0 });
assert.deepStrictEqual(optimal([]), { values: [], copies: 0 });
const exOps = ['push', 'push', 'push', 'push', 'push', 'pop', 'push', 'pop'];
assert.deepStrictEqual(bruteForce(exOps), { values: [4, 5], copies: 19 });
assert.deepStrictEqual(optimal(exOps), { values: [4, 5], copies: 7 });
const small = ['push', 'push', 'push', 'push', 'push', 'pop', 'push', 'pop', 'push'];
assert.deepStrictEqual(optimal(small).values, bruteForce(small).values);
assert.ok(bruteForce(small).copies > optimal(small).copies);

const adv = adversarial(1024, 1000);
const naive = bruteForce(adv), safe = optimal(adv);
assert.deepStrictEqual(naive.values, safe.values);
assert.ok(naive.copies > 1000 * 1000, `naive thrashes: ${naive.copies}`);
assert.ok(safe.copies <= 3 * adv.length, `safe: ${safe.copies}`);

const rand = mulberry32(514);
for (let t = 0; t < 200; t++) {
  const ops = Array.from({ length: 500 }, () => (rand() < 0.5 ? 'push' : 'pop'));
  const a = optimal(ops), b = bruteForce(ops);
  assert.deepStrictEqual(a.values, b.values);
  assert.ok(a.copies <= 3 * ops.length);
}
console.log('✓ 04_shrink_policy_thrashing passed');

module.exports = { optimal, bruteForce, adversarial };
