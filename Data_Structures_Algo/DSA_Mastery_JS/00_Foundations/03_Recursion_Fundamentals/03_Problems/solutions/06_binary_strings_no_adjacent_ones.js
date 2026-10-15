/**
 * 06. Binary Strings Without Adjacent Ones   (Original — Medium)
 *
 * PROBLEM
 * Given n, return ALL binary strings of length n that never contain "11", in
 * lexicographic order. Generate them with recursion that never builds an invalid
 * prefix (pruning), and explain why the number of strings is a Fibonacci number.
 *
 * EXAMPLES
 * Input: n = 1   Output: ["0", "1"]
 * Input: n = 2   Output: ["00", "01", "10"]
 * Input: n = 3   Output: ["000", "001", "010", "100", "101"]
 * Input: n = 0   Output: [""]     (one empty string)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 20 -> 2^20 ~ 1e6 candidates for brute force; the valid count is fib(22) = 17711.
 * - Order? (lexicographic: try '0' before '1')
 *
 * APPROACH 1 — Brute force (generate all, then filter)   O(2^n * n) time
 * Recursively generate all 2^n strings (append '0' or '1'), keep those without "11".
 * Most of the work is wasted on strings that were already invalid after 2 characters.
 *
 * APPROACH 2 — Optimal (recursion with pruning)   O(F(n+2) * n) time, O(n) stack
 * build(prefix): if prefix.length === n, record it.
 *   always try '0'
 *   try '1' only if the last character is not '1'
 * Each recursive call extends a VALID prefix, so every leaf is an answer: the work is
 * proportional to the output. Count(n) = Count(n-1) [ends after '0'] + Count(n-2) ['10' appended]
 * = Fibonacci, so Count(n) = fib(n + 2).
 *
 * Dry run n = 3 (recursion tree, '-' = pruned):
 *   ""  -> "0" -> "00" -> "000", "001"
 *               -> "01" -> "010", "011"-
 *       -> "1" -> "10" -> "100", "101"
 *               -> "11"-
 *   results: 000 001 010 100 101  (5 = fib(5))
 *
 * EDGE CASES
 * - n = 0 -> [""]
 * - n = 1 -> ["0", "1"] (no previous character to clash with)
 *
 * COMMON MISTAKES
 * - Checking the whole prefix for "11" each call (O(n) extra per call): only the last char matters.
 * - Pushing the shared array 'path' instead of path.join('') / a copy.
 * - Forgetting to pop after the recursive call when using a shared array.
 */

function bruteForce(n) {
  const all = [];
  (function gen(prefix) {
    if (prefix.length === n) { all.push(prefix); return; }
    gen(prefix + '0');
    gen(prefix + '1');
  })('');
  return all.filter(s => !s.includes('11'));
}

function optimal(n) {
  const out = [];
  const path = [];
  function build() {
    if (path.length === n) { out.push(path.join('')); return; } // snapshot, not the live array
    path.push('0'); build(); path.pop();
    if (path[path.length - 1] !== '1') { path.push('1'); build(); path.pop(); }
  }
  build();
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(0), ['']);
  assert.deepStrictEqual(solve(1), ['0', '1']);
  assert.deepStrictEqual(solve(2), ['00', '01', '10']);
  assert.deepStrictEqual(solve(3), ['000', '001', '010', '100', '101']);
}
const fib = k => { let a = 0, b = 1; for (let i = 0; i < k; i++) [a, b] = [b, a + b]; return a; };
for (let n = 0; n <= 16; n++) {
  const got = optimal(n);
  assert.strictEqual(got.length, fib(n + 2));
  assert.deepStrictEqual(got, bruteForce(n));
}
assert.strictEqual(optimal(20).length, 17711);
console.log('✓ 06_binary_strings_no_adjacent_ones passed');

module.exports = { optimal, bruteForce };
