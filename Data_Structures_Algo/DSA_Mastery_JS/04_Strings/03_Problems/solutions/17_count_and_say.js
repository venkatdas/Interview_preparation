/**
 * 17. Count and Say   (LeetCode 38 — Medium)
 *
 * PROBLEM
 * The count-and-say sequence starts with "1". Each next term is produced by READING the
 * previous term out loud: group consecutive equal digits and say "<count><digit>".
 * Return the n-th term (1-indexed).
 *
 * EXAMPLES
 * Input: 1   Output: "1"
 * Input: 2   Output: "11"     Explanation: "1" is read as "one 1"
 * Input: 3   Output: "21"     Explanation: "11" is "two 1s"
 * Input: 4   Output: "1211"   Explanation: "21" is "one 2, one 1"
 * Input: 5   Output: "111221" Explanation: "1211" is "one 1, one 2, two 1s"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n >= 1? (yes, 1 <= n <= 30)
 * - Can a run be longer than 9? (never in this sequence - the max digit is 3)
 * - Recursive or iterative? (either; iterative avoids call-stack worries)
 *
 * APPROACH 1 — Brute force   O(n * L) time, O(L) space   (L = length of the n-th term)
 * Recursion: countAndSay(n) = say(countAndSay(n - 1)). The `say` step is built with
 * a global regex that captures runs, (\d)\1* , replacing each run with its length + digit.
 * (Note: the literal regex cannot be written inside this comment because it contains the
 * comment-closing sequence - a tiny JS gotcha worth knowing.)
 * Correct, but regex hides the actual logic the interviewer wants to see.
 *
 * APPROACH 2 — Optimal (iterative run-length encoding)   O(n * L) time, O(L) space
 * Start with "1". Repeat n - 1 times: scan the current term with an index, count how many
 * times the current digit repeats, push `count` and `digit` into an output array, continue
 * after the run. Join and loop. Each term is produced in one linear pass.
 *
 * Dry run building term 4 from "21":
 *   i=0 digit '2', run length 1 -> push "1","2"
 *   i=1 digit '1', run length 1 -> push "1","1"
 *   "1211"
 * Then term 5 from "1211":
 *   '1' x1 -> "11", '2' x1 -> "12", '1' x2 -> "21"  -> "111221"
 *
 * EDGE CASES
 * - n = 1         -> "1" (no iterations)
 * - the term length grows roughly 1.3x per step; n = 30 is ~4500 chars, fine
 */

function bruteForce(n) {
  if (n === 1) return '1';
  const previous = bruteForce(n - 1);
  // each match is a run of one repeated digit; replace with "<length><digit>"
  return previous.replace(/(\d)\1*/g, (run, digit) => `${run.length}${digit}`);
}

function optimal(n) {
  let term = '1';
  for (let step = 1; step < n; step++) {
    const next = [];
    let i = 0;
    while (i < term.length) {
      const digit = term[i];
      let runLength = 0;
      while (i < term.length && term[i] === digit) {
        runLength++;
        i++;
      }
      next.push(String(runLength), digit); // "say" the run
    }
    term = next.join('');
  }
  return term;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1), '1');
  assert.strictEqual(solve(2), '11');
  assert.strictEqual(solve(3), '21');
  assert.strictEqual(solve(4), '1211');
  assert.strictEqual(solve(5), '111221');
  assert.strictEqual(solve(6), '312211');
  assert.strictEqual(solve(10), '13211311123113112211');
}
assert.strictEqual(optimal(30), bruteForce(30));
console.log('✓ 17-count-and-say passed');

module.exports = { optimal, bruteForce };
