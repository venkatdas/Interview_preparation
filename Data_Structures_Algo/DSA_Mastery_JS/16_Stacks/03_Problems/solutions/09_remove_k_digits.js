/**
 * 09. Remove K Digits   (LeetCode 402 — Medium)
 *
 * PROBLEM
 * Given a string num representing a non-negative integer and an integer k,
 * remove k digits so that the remaining number is the SMALLEST possible.
 * Return it as a string without leading zeros ("0" if nothing is left).
 *
 * EXAMPLES
 * Input: num = "1432219", k = 3   Output: "1219"   Explanation: remove 4, 3, 2
 * Input: num = "10200", k = 1     Output: "200"    Explanation: remove the 1, drop leading zeros
 * Input: num = "10", k = 2        Output: "0"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k <= num.length? (yes)
 * - Must strip leading zeros from the answer? (yes)
 * - Return "0" rather than ""? (yes)
 *
 * APPROACH 1 — Brute force (try all combinations)   O(C(n,k) * n) time
 * Generate every way to keep n-k digits, compare as numbers. Exponential.
 * We implement it with recursion for tiny inputs only, to verify the greedy.
 *
 * APPROACH 2 — Optimal (greedy with a monotonic increasing stack)   O(n) time, O(n) space
 * Key insight: the number is smallest when its digits are as small as possible
 * from the LEFT. So whenever a digit is smaller than the one before it, the
 * previous (bigger) digit should be removed - that "peak" is hurting us most.
 *   for each digit: while k > 0 and stack.top > digit: pop, k--
 *   push digit
 * If k is still > 0 after the loop, the stack is non-decreasing: remove from the END.
 * Finally strip leading zeros.
 *
 * Dry run on "1432219", k=3:
 *   1  push                 [1]
 *   4  push                 [1,4]
 *   3  4>3 pop (k=2) push   [1,3]
 *   2  3>2 pop (k=1) push   [1,2]
 *   2  push                 [1,2,2]
 *   1  2>1 pop (k=0) push   [1,2,1]
 *   9  push                 [1,2,1,9]
 *   k=0 -> "1219"
 *
 * EDGE CASES
 * - k === num.length -> "0"
 * - already increasing digits ("12345", k=2) -> remove from the end -> "123"
 * - leading zeros after removal ("10200", k=1)
 */

function bruteForce(num, k) {
  const keep = num.length - k;
  if (keep === 0) return '0';
  let best = null;
  (function choose(index, chosen) {
    if (chosen.length === keep) {
      const candidate = chosen.replace(/^0+/, '') || '0';
      if (best === null || BigInt(candidate) < BigInt(best)) best = candidate;
      return;
    }
    if (num.length - index < keep - chosen.length) return; // not enough digits left
    choose(index + 1, chosen + num[index]); // take it
    choose(index + 1, chosen);              // skip it
  })(0, '');
  return best;
}

function optimal(num, k) {
  const stack = []; // digits, non-decreasing from bottom to top

  for (const digit of num) {
    // a bigger digit before a smaller one is the first thing to remove
    while (k > 0 && stack.length && stack[stack.length - 1] > digit) {
      stack.pop();
      k--;
    }
    stack.push(digit);
  }

  // digits were already non-decreasing: the largest ones are at the end
  while (k > 0) {
    stack.pop();
    k--;
  }

  const result = stack.join('').replace(/^0+/, ''); // strip leading zeros
  return result === '' ? '0' : result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('1432219', 3), '1219');
  assert.strictEqual(solve('10200', 1), '200');
  assert.strictEqual(solve('10', 2), '0');
  assert.strictEqual(solve('12345', 2), '123');
  assert.strictEqual(solve('9', 1), '0');
  assert.strictEqual(solve('112', 1), '11');
  assert.strictEqual(solve('100', 1), '0');
  assert.strictEqual(solve('54321', 0), '54321');
}
console.log('✓ 09-remove-k-digits passed');

module.exports = { optimal, bruteForce };
