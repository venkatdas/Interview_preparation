/**
 * 06. Counting Bits   (LeetCode 338 — Easy)
 *
 * PROBLEM
 * Given n, return an array ans of length n + 1 where ans[i] is the number of 1 bits in i.
 *
 * EXAMPLES
 * Input: 2   Output: [0,1,1]
 * Input: 5   Output: [0,1,1,2,1,2]   Explanation: 0,1,10,11,100,101
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can we do better than O(n * 32)? (yes, O(n) with DP)
 *
 * APPROACH 1 — Brute force   O(n log n) time, O(n) space
 * For every i run Kernighan's popcount. Fine, but the interviewer wants the DP.
 *
 * APPROACH 2 — Optimal (DP on i >> 1)   O(n) time, O(n) space (the output)
 * i >> 1 is i with its last bit dropped. So bits(i) = bits(i >> 1) + (i & 1).
 * i >> 1 < i, so it has already been computed. One addition per number.
 * (Alternative recurrence: bits(i) = bits(i & (i - 1)) + 1.)
 *
 * Dry run for n = 5:
 *   ans[0]=0
 *   ans[1]=ans[0]+1=1
 *   ans[2]=ans[1]+0=1
 *   ans[3]=ans[1]+1=2
 *   ans[4]=ans[2]+0=1
 *   ans[5]=ans[2]+1=2  -> [0,1,1,2,1,2]
 *
 * EDGE CASES
 * - n = 0 -> [0]
 * - n = 1 -> [0,1]
 */

function bruteForce(n) {
  const result = [];
  for (let i = 0; i <= n; i++) {
    let x = i;
    let count = 0;
    while (x !== 0) { x &= x - 1; count++; }
    result.push(count);
  }
  return result;
}

function optimal(n) {
  const bits = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    bits[i] = bits[i >> 1] + (i & 1); // drop the last bit, add it back as 0 or 1
  }
  return bits;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(2), [0, 1, 1]);
  assert.deepStrictEqual(solve(5), [0, 1, 1, 2, 1, 2]);
  assert.deepStrictEqual(solve(0), [0]);
  assert.deepStrictEqual(solve(1), [0, 1]);
  assert.deepStrictEqual(solve(8), [0, 1, 1, 2, 1, 2, 2, 3, 1]);
}
console.log('✓ 06-counting-bits passed');

module.exports = { optimal, bruteForce };
