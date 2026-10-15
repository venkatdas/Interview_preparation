/**
 * 07. Depth-Weighted Deep Sum   (Original — Medium)
 *
 * PROBLEM
 * Given a nested array of integers, return the sum of every integer multiplied by
 * its depth. The outer array is depth 1. Write the natural recursive version, then
 * an iterative version with an explicit stack that also works when the nesting is
 * 100,000 levels deep (where recursion overflows Node's call stack).
 *
 * EXAMPLES
 * Input: [1, [2, 3], [[4]]]   Output: 1*1 + 2*2 + 3*2 + 4*3 = 23
 * Input: [[1, 1], 2, [1, 1]]  Output: 10   (four 1s at depth 2 = 8, plus 2 at depth 1)
 * Input: []                   Output: 0
 * Input: [[[]]]               Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Depth up to 1e5 -> recursion fails, need explicit stack.
 * - Total integers up to 1e5; sums fit in a Number.
 *
 * APPROACH 1 — Brute force (recursion)   O(N) time, O(D) stack (D = max depth)
 * sum(arr, depth) = for each x: array ? sum(x, depth + 1) : x * depth.
 * Clean, but each nesting level is one frame -> RangeError around 10k levels.
 *
 * APPROACH 2 — Optimal (explicit stack of [array, depth])   O(N) time, O(N) heap
 * stack = [[input, 1]]. Pop [arr, d]; for each x: if array push [x, d + 1], else total += x * d.
 * Addition is commutative, so visiting order does not matter (the "easy" conversion).
 *
 * Dry run [1, [2, 3], [[4]]]:
 *   pop [root,1]: 1 -> total 1; push [[2,3],2]; push [[[4]],2]
 *   pop [[[4]],2]: push [[4],3]
 *   pop [[4],3]: 4*3 -> total 13
 *   pop [[2,3],2]: 2*2 + 3*2 -> total 23
 *
 * EDGE CASES
 * - empty arrays at any depth contribute 0
 * - negative integers (fine)
 * - extremely deep nesting (explicit stack only)
 *
 * COMMON MISTAKES
 * - Starting depth at 0 (every product off by one level).
 * - Incrementing depth for numbers instead of for arrays.
 */

function bruteForce(nested, depth = 1) {
  let total = 0;
  for (const x of nested) total += Array.isArray(x) ? bruteForce(x, depth + 1) : x * depth;
  return total;
}

function optimal(nested) {
  let total = 0;
  const stack = [[nested, 1]];
  while (stack.length) {
    const [arr, d] = stack.pop();
    for (const x of arr) {
      if (Array.isArray(x)) stack.push([x, d + 1]);
      else total += x * d;
    }
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, [2, 3], [[4]]]), 23);
  assert.strictEqual(solve([[1, 1], 2, [1, 1]]), 10);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[[]]]), 0);
  assert.strictEqual(solve([-1, [-2]]), -5);
}
let deep = [1];
for (let i = 0; i < 100000; i++) deep = [deep];
assert.strictEqual(optimal(deep), 100001);
assert.throws(() => bruteForce(deep), RangeError);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(27);
const gen = l => Array.from({ length: Math.floor(rand() * 4) }, () => (l > 0 && rand() < 0.4 ? gen(l - 1) : Math.floor(rand() * 21) - 10));
for (let t = 0; t < 500; t++) { const a = gen(5); assert.strictEqual(optimal(a), bruteForce(a)); }
console.log('✓ 07_depth_weighted_sum passed');

module.exports = { optimal, bruteForce };
