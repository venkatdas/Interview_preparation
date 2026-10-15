/**
 * 05. Largest Number   (LeetCode 179 — Medium)
 *
 * PROBLEM
 * Given a list of non-negative integers, arrange them so that they form the largest
 * possible number. Return it as a string (it may be too big for a number type).
 *
 * EXAMPLES
 * Input: [10,2]           Output: "210"
 * Input: [3,30,34,5,9]    Output: "9534330"
 * Input: [0,0]            Output: "0"      (not "00")
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-negative only? (yes)
 * - All zeros -> "0" (strip the leading zeros case)
 * - n <= 100, values <= 10^9
 *
 * APPROACH 1 — Brute force (all permutations)   O(n! * n)
 * Try every ordering, join, keep the largest (compare by length, then lexicographically).
 * Only feasible for n <= 8; included to validate the comparator on small inputs.
 *
 * APPROACH 2 — Optimal (custom comparator: a before b if a+b > b+a)   O(n log n * d) time
 * Sorting by numeric value is wrong: 3 vs 30 -> "330" beats "303", but 3 < 30.
 * Instead compare the two possible concatenations. For strings a and b, put a first
 * if a + b > b + a (as strings of digits, same length so string compare works).
 * This comparator is transitive (provable), so it is a valid sort order.
 * After sorting, if the first element is "0" everything is zero -> return "0".
 *
 * Dry run [3,30,34,5,9] -> strings:
 *   compare 3 vs 30: "330" > "303" -> 3 first
 *   compare 3 vs 34: "334" < "343" -> 34 first
 *   sorted: ["9","5","34","3","30"] -> "9534330"
 *
 * EDGE CASES
 * - [0] -> "0"; [0,0] -> "0"
 * - single element
 * - same digits different lengths: [12,121] -> "12121" (12 first: "12121" > "12112")
 */

function bruteForce(nums) {
  const strs = nums.map(String);
  let best = '';
  function better(a, b) {
    if (a.length !== b.length) return a.length > b.length;
    return a > b;
  }
  function go(path, remaining) {
    if (remaining.length === 0) {
      const joined = path.join('');
      if (better(joined, best)) best = joined;
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      go([...path, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
    }
  }
  go([], strs);
  return best[0] === '0' ? '0' : best;
}

function optimal(nums) {
  const strs = nums.map(String);
  // a goes before b if "ab" is bigger than "ba"
  strs.sort((a, b) => {
    const ab = a + b, ba = b + a;
    if (ab === ba) return 0;
    return ab > ba ? -1 : 1;
  });
  if (strs[0] === '0') return '0';   // largest piece is 0 -> all zeros
  return strs.join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([10, 2]), '210');
  assert.strictEqual(solve([3, 30, 34, 5, 9]), '9534330');
  assert.strictEqual(solve([0, 0]), '0');
  assert.strictEqual(solve([0]), '0');
  assert.strictEqual(solve([1]), '1');
  assert.strictEqual(solve([12, 121]), '12121');
  assert.strictEqual(solve([432, 43243]), '43243432');
  assert.strictEqual(solve([1, 1, 1]), '111');
}
for (let trial = 0; trial < 100; trial++) {
  const input = Array.from({ length: 1 + Math.floor(Math.random() * 6) }, () => Math.floor(Math.random() * 100));
  assert.strictEqual(optimal(input), bruteForce(input));
}
console.log('✓ 05-largest-number passed');

module.exports = { optimal, bruteForce };
