/**
 * 07. K-th Symbol in Grammar   (LeetCode 779 — Medium)
 *
 * PROBLEM
 * Row 1 is "0". To build the next row, replace every 0 with "01" and every 1 with "10".
 * Given n and k (1-indexed), return the k-th symbol of row n.
 *
 * EXAMPLES
 * n=1, k=1 -> 0          row 1: 0
 * n=2, k=1 -> 0          row 2: 01
 * n=2, k=2 -> 1
 * n=4, k=5 -> 1          row 4: 01101001
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 30, 1 <= k <= 2^(n-1). Row 30 has 536,870,912 symbols: never build it.
 *
 * APPROACH 1 — Brute force (build the rows)   O(2^n) time, O(2^n) space
 * Build each row string from the previous one and index into the last. Fine for n <= 20.
 *
 * APPROACH 2 — Optimal (recurse on the parent)   O(n) time, O(n) stack
 * Every symbol at position k in row n was produced by its PARENT at position
 * ceil(k / 2) in row n-1. A parent p produces "p, flip(p)":
 *   k odd  -> left child  -> same as parent
 *   k even -> right child -> flipped parent
 * PROMISE: kth(n, k) returns the k-th symbol of row n.
 *   base: n === 1 -> 0
 *   step: parent = kth(n - 1, ceil(k / 2)); return k odd ? parent : 1 - parent
 * (Closed form: answer = popcount(k - 1) % 2.)
 *
 * Dry run n=4, k=5:
 *   kth(4,5): parent = kth(3,3)
 *     kth(3,3): parent = kth(2,2)
 *       kth(2,2): parent = kth(1,1) = 0, k even -> 1
 *     k=3 odd -> 1
 *   k=5 odd -> 1        answer 1
 *
 * EDGE CASES
 * - n = 1 (only k = 1)
 * - k = 1 is always 0 (leftmost path never flips)
 * - k = 2^(n-1), the last symbol
 */

function bruteForce(n, k) {
  let row = '0';
  for (let i = 1; i < n; i++) {
    let next = '';
    for (const ch of row) next += ch === '0' ? '01' : '10';
    row = next;
  }
  return Number(row[k - 1]);
}

function optimal(n, k) {
  if (n === 1) return 0;
  const parent = optimal(n - 1, Math.ceil(k / 2));
  return k % 2 === 1 ? parent : 1 - parent;     // left child copies, right child flips
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(optimal(1, 1), 0);
assert.strictEqual(optimal(2, 1), 0);
assert.strictEqual(optimal(2, 2), 1);
assert.strictEqual(optimal(4, 5), 1);
assert.strictEqual(optimal(30, 1), 0);
assert.strictEqual(optimal(30, 2 ** 29), 1);   // popcount(2^29 - 1) = 29 -> odd
for (let n = 1; n <= 12; n++) {
  for (let k = 1; k <= 2 ** (n - 1); k++) assert.strictEqual(optimal(n, k), bruteForce(n, k));
}
console.log('✓ 07_kth_symbol_in_grammar passed');

module.exports = { optimal, bruteForce };
