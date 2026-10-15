/**
 * 05. Beautiful Array   (LeetCode 932 — Medium)
 *
 * PROBLEM
 * An array is beautiful if it is a permutation of 1..n and for every i < k < j there is
 * NO index k with 2 * nums[k] = nums[i] + nums[j] (no element is the average of two
 * elements around it). Return any beautiful array of length n.
 *
 * EXAMPLES
 * Input: 4   Output: [2,1,4,3]  (one valid answer)
 * Input: 5   Output: [3,1,2,5,4]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1000 -> cannot enumerate permutations
 * - Any valid answer is accepted
 *
 * APPROACH 1 — Brute force (backtracking)   O(n!) worst case
 * Build the permutation one element at a time and check the average condition against
 * every pair placed so far. Only feasible for n <= 8 or so.
 *
 * APPROACH 2 — Optimal (Divide & conquer: odds on the left, evens on the right)   O(n log n)
 * Key facts:
 *   1. If A is beautiful, so is 2A - 1 (all odd) and 2A (all even): the condition is
 *      preserved under affine maps x -> ax + b.
 *   2. Concatenating an all-odd beautiful array with an all-even one is beautiful: for i in
 *      the odd part and j in the even part, nums[i] + nums[j] is odd, so no integer k is
 *      their average.
 * So beautiful(n) = [2x - 1 for x in beautiful(ceil(n/2))] + [2x for x in beautiful(floor(n/2))].
 * Base: beautiful(1) = [1].
 *
 * Dry run n = 5:
 *   beautiful(3) = odds of beautiful(2) + evens of beautiful(1)
 *     beautiful(2) = odds of [1] + evens of [1] = [1] + [2] = [1,2]
 *     -> [1,3] + [2] = [1,3,2]
 *   beautiful(2) = [1,2]
 *   beautiful(5) = [1,5,3] + [2,4] = [1,5,3,2,4]
 *
 * EDGE CASES
 * - n = 1 -> [1]
 * - n = 2 -> [1,2]
 * - verify the output with an independent checker in tests
 */

function isBeautiful(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 2; j < nums.length; j++) {
      const sum = nums[i] + nums[j];
      if (sum % 2 !== 0) continue;
      for (let k = i + 1; k < j; k++) if (2 * nums[k] === sum) return false;
    }
  }
  return true;
}

function bruteForce(n) {
  const used = new Array(n + 1).fill(false);
  const current = [];
  function backtrack() {
    if (current.length === n) return true;
    for (let v = 1; v <= n; v++) {
      if (used[v]) continue;
      current.push(v);
      // check only triples that end at the new element
      let ok = true;
      const j = current.length - 1;
      for (let i = 0; i < j - 1 && ok; i++) {
        const sum = current[i] + current[j];
        if (sum % 2 !== 0) continue;
        for (let k = i + 1; k < j; k++) if (2 * current[k] === sum) { ok = false; break; }
      }
      if (ok) {
        used[v] = true;
        if (backtrack()) return true;
        used[v] = false;
      }
      current.pop();
    }
    return false;
  }
  backtrack();
  return current;
}

function optimal(n) {
  const memo = new Map([[1, [1]]]);
  function build(size) {
    if (memo.has(size)) return memo.get(size);
    const odds = build(Math.ceil(size / 2)).map((x) => 2 * x - 1);
    const evens = build(Math.floor(size / 2)).map((x) => 2 * x);
    const result = odds.concat(evens);
    memo.set(size, result);
    return result;
  }
  return build(n);
}

// ---------- tests ----------
const assert = require('assert');
for (let n = 1; n <= 8; n++) {
  const b = bruteForce(n);
  assert.strictEqual(b.length, n);
  assert.ok(isBeautiful(b));
  assert.deepStrictEqual(b.slice().sort((a, c) => a - c), Array.from({ length: n }, (_, i) => i + 1));
}
for (let n = 1; n <= 60; n++) {
  const o = optimal(n);
  assert.strictEqual(o.length, n);
  assert.ok(isBeautiful(o), `optimal(${n}) is not beautiful`);
  assert.deepStrictEqual(o.slice().sort((a, c) => a - c), Array.from({ length: n }, (_, i) => i + 1));
}
assert.deepStrictEqual(optimal(1), [1]);
assert.deepStrictEqual(optimal(5), [1, 5, 3, 2, 4]);
console.log('✓ 05-beautiful-array passed');

module.exports = { optimal, bruteForce, isBeautiful };
