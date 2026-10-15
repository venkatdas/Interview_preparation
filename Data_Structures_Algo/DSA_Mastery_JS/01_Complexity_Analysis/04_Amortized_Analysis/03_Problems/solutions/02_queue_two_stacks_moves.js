/**
 * 02. Two-Stack Queue Move Count   (Original — Easy)
 *
 * PROBLEM
 * You are given a list of operations on a FIFO queue: ['enq', x] or ['deq'].
 * Implement the queue with two stacks and return { outputs, moves } where outputs are
 * the dequeued values (or null for a dequeue on an empty queue) and moves is the number
 * of elements moved between the stacks. Compare two strategies:
 *   - eager: before every dequeue move everything from `in` to `out`, pop, then move
 *     everything back (so `in` always holds the queue)
 *   - lazy: refill `out` from `in` only when `out` is empty
 * Show that lazy makes at most one move per enqueued element.
 *
 * EXAMPLES
 * ops: enq 1, enq 2, enq 3, deq, enq 4, deq, deq, deq
 *   outputs: [1, 2, 3, 4]
 *   lazy moves: 4 (3 on the first deq, 1 on the last)
 *   eager moves: 3+2 + 3+2 ... (quadratic in the queue size)
 * ops: deq           outputs: [null], moves 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 1e5 operations.
 * - Values are any JS values (use null only as the "empty" signal).
 *
 * APPROACH 1 — Brute force (eager transfer both ways)   O(n) per dequeue, O(n²) total
 * Each dequeue pours `in` into `out` (size s moves), pops, then pours back (s - 1 moves).
 *
 * APPROACH 2 — Optimal (lazy transfer)   O(1) amortized per operation, O(n) total
 * Pour only when `out` is empty. Elements in `out` are already in FIFO order (oldest on top).
 * Each element moves from `in` to `out` exactly once and never goes back: total moves <= #enqueues.
 * Accounting: charge enqueue 3 (1 push + 2 credits for its future move), dequeue 1.
 *
 * Dry run (example 1, lazy):
 *   enq 1,2,3 -> in [1,2,3]
 *   deq: out empty -> move 3 -> out [3,2,1], pop 1
 *   enq 4 -> in [4]
 *   deq -> pop 2; deq -> pop 3 (no moves, out not empty)
 *   deq: out empty -> move 1 -> pop 4.   moves = 4
 *
 * EDGE CASES
 * - dequeue on empty -> null, no moves
 * - interleaved enq/deq: elements arriving after a refill wait in `in`
 *
 * COMMON MISTAKES
 * - Refilling when `in` is non-empty even though `out` still has elements (breaks FIFO order).
 * - Moving elements back to `in` (eager): correct but O(n) per operation.
 */
const { mulberry32 } = require('../../02_Implementations/amortized_structures');

function bruteForce(ops) {
  const inS = [], out = [], outputs = [];
  let moves = 0;
  for (const [op, x] of ops) {
    if (op === 'enq') { inS.push(x); continue; }
    if (!inS.length) { outputs.push(null); continue; }
    while (inS.length) { out.push(inS.pop()); moves++; }
    outputs.push(out.pop());
    while (out.length) { inS.push(out.pop()); moves++; }
  }
  return { outputs, moves };
}

function optimal(ops) {
  const inS = [], out = [], outputs = [];
  let moves = 0;
  for (const [op, x] of ops) {
    if (op === 'enq') { inS.push(x); continue; }
    if (!out.length) while (inS.length) { out.push(inS.pop()); moves++; }
    outputs.push(out.length ? out.pop() : null);
  }
  return { outputs, moves };
}

// ---------- tests ----------
const assert = require('assert');
const ex = [['enq', 1], ['enq', 2], ['enq', 3], ['deq'], ['enq', 4], ['deq'], ['deq'], ['deq']];
assert.deepStrictEqual(optimal(ex), { outputs: [1, 2, 3, 4], moves: 4 });
assert.deepStrictEqual(bruteForce(ex).outputs, [1, 2, 3, 4]);
assert.ok(bruteForce(ex).moves > 4);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([['deq']]), { outputs: [null], moves: 0 });
  assert.deepStrictEqual(solve([]), { outputs: [], moves: 0 });
}
// adversarial for eager: n enqueues then n dequeues
const n = 2000;
const big = [...Array.from({ length: n }, (_, i) => ['enq', i]), ...Array.from({ length: n }, () => ['deq'])];
assert.strictEqual(optimal(big).moves, n);
assert.ok(bruteForce(big).moves > n * n / 2);
const rand = mulberry32(512);
for (let t = 0; t < 300; t++) {
  const seq = Array.from({ length: 60 }, (_, i) => (rand() < 0.55 ? ['enq', i] : ['deq']));
  const a = optimal(seq), b = bruteForce(seq);
  assert.deepStrictEqual(a.outputs, b.outputs);
  const enqs = seq.filter(o => o[0] === 'enq').length;
  assert.ok(a.moves <= enqs, 'each element moves at most once');
}
console.log('✓ 02_queue_two_stacks_moves passed');

module.exports = { optimal, bruteForce };
