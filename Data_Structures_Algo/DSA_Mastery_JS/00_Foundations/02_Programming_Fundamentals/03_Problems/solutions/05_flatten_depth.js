/**
 * 05. Flatten to Depth   (Original — Medium)
 *
 * PROBLEM
 * Given a nested array and a depth d (default Infinity), return a NEW array where
 * nested arrays are expanded up to d levels. depth 0 returns a shallow copy.
 * Behave like Array.prototype.flat(d), but write it yourself, and make it safe for
 * very deeply nested input (100,000 levels) where recursion would overflow the stack.
 *
 * EXAMPLES
 * Input: [1, [2, [3, [4]]]], d = 1          Output: [1, 2, [3, [4]]]
 * Input: [1, [2, [3, [4]]]], d = Infinity   Output: [1, 2, 3, 4]
 * Input: [[], [[]], 5],      d = Infinity   Output: [5]
 * Input: [1, 2],             d = 0          Output: [1, 2]   (a copy)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can elements be objects? (yes, keep them as-is: only ARRAYS are expanded)
 * - Is input order preserved? (yes)
 * - How deep can nesting be? (up to 1e5 -> recursion depth is a real risk)
 *
 * APPROACH 1 — Brute force (recursion)   O(total elements) time, O(depth) call stack
 * For each element: if it is an array and depth > 0, recurse with depth - 1 and
 * push all results; otherwise push the element. Simple, but each nesting level is a
 * stack frame, so ~10k+ levels throws RangeError: Maximum call stack size exceeded.
 *
 * APPROACH 2 — Optimal (explicit stack of [element, depth])   O(total elements) time, O(total) heap space
 * Push the top-level elements onto a stack in REVERSE order (so popping yields them
 * left to right), each tagged with the remaining depth. Pop one:
 *   - an array with depth > 0 -> push its children (reversed) with depth - 1
 *   - anything else           -> append to output
 * The heap holds the stack, so depth is limited only by memory.
 *
 * Dry run [1, [2, [3]]], d = 1:
 *   stack (top on right): [[2,[3]],1] [1,1]           out []
 *   pop 1         -> out [1]
 *   pop [2,[3]] d=1 -> push [[3],0] [2,0]
 *   pop 2         -> out [1,2]
 *   pop [3] d=0   -> depth exhausted, out [1,2,[3]]
 *
 * EDGE CASES
 * - empty nested arrays     -> vanish when expanded
 * - depth 0                 -> shallow copy, new outer array
 * - objects / strings       -> never expanded (strings are not arrays)
 * - 100,000 levels deep     -> explicit stack still works
 *
 * COMMON MISTAKES
 * - Pushing children in normal order onto the stack (output comes out reversed).
 * - Expanding strings by iterating them (for...of over 'ab' gives 'a', 'b').
 * - Returning the input itself for depth 0 (caller then aliases it).
 */

function bruteForce(arr, depth = Infinity) {
  const out = [];
  for (const x of arr) {
    if (Array.isArray(x) && depth > 0) out.push(...bruteForce(x, depth - 1));
    else out.push(x);
  }
  return out;
}

function optimal(arr, depth = Infinity) {
  const out = [];
  const stack = [];
  for (let i = arr.length - 1; i >= 0; i--) stack.push([arr[i], depth]);
  while (stack.length) {
    const [x, d] = stack.pop();
    if (Array.isArray(x) && d > 0) {
      for (let i = x.length - 1; i >= 0; i--) stack.push([x[i], d - 1]);
    } else {
      out.push(x);
    }
  }
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, [2, [3, [4]]]], 1), [1, 2, [3, [4]]]);
  assert.deepStrictEqual(solve([1, [2, [3, [4]]]]), [1, 2, 3, 4]);
  assert.deepStrictEqual(solve([[], [[]], 5]), [5]);
  const src = [1, 2];
  const copy = solve(src, 0);
  assert.deepStrictEqual(copy, [1, 2]);
  assert.notStrictEqual(copy, src);
  assert.deepStrictEqual(solve(['ab', { a: [1] }]), ['ab', { a: [1] }]);
}
// very deep input: recursion fails, explicit stack works
let deep = [42];
for (let i = 0; i < 100000; i++) deep = [deep];
assert.deepStrictEqual(optimal(deep), [42]);
assert.throws(() => bruteForce(deep), RangeError);

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(5);
const gen = lvl => Array.from({ length: Math.floor(rand() * 4) }, () => (lvl > 0 && rand() < 0.4 ? gen(lvl - 1) : Math.floor(rand() * 9)));
for (let t = 0; t < 300; t++) {
  const a = gen(4), d = Math.floor(rand() * 5);
  assert.deepStrictEqual(optimal(a, d), bruteForce(a, d));
  assert.deepStrictEqual(optimal(a, d), a.flat(d));
}
console.log('✓ 05_flatten_depth passed');

module.exports = { optimal, bruteForce };
