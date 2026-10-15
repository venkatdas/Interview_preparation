/**
 * NN. Problem Name   (LeetCode ??? — Easy/Medium/Hard)
 *
 * Copy this file for every new problem. Fill in EVERY section before you write code.
 * The sections are the UMPIRE steps: Understand, Match, Plan, Implement, Review, Evaluate.
 *
 * PROBLEM                                                        <- U: Understand
 * Restate the problem in your own words. One or two sentences.
 *
 * EXAMPLES                                                       <- U: Understand
 * Input: ...   Output: ...   Explanation: ...
 * Input: ...   Output: ...   Explanation: ...   (include a small edge case)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK                      <- U: Understand
 * - How big is the input? (decides the acceptable complexity)
 * - Can it be empty? One element? Duplicates? Negatives? Sorted?
 * - What do I return when there is no answer?
 * - Values or indices? Can I modify the input in place?
 *
 * APPROACH 1 — Brute force   O(?) time, O(?) space                <- M + P: Match, Plan
 * The obvious way. 2-6 lines. What work does it repeat?
 *
 * APPROACH 2 — Optimal (<pattern name>)   O(?) time, O(?) space   <- M + P: Match, Plan
 * Which pattern (hash map, two pointers, sliding window, ...)? Why does it fit?
 * Step-by-step plan, then a dry run on one example:               <- R: Review
 *   step 1 ...  state = ...
 *   step 2 ...  state = ...
 *
 * EDGE CASES                                                      <- R: Review
 * - empty input         ->
 * - single element      ->
 * - all equal           ->
 * - answer at the ends  ->
 */

// ---------- I: Implement ----------

// Keep the brute force. It is your safety net and it is how you check the optimal.
function bruteForce(input) {
  // TODO
  return input;
}

// The main solution. Clean, commented on the "why" of tricky lines.
function optimal(input) {
  // TODO
  return input;
}

// ---------- tests ----------      <- R: Review (run with: node this-file.js)
const assert = require('assert');

// Use the SAME test cases for both functions so they must agree.
const testCases = [
  // [input, expectedOutput]
  [[], []],      // empty
  [[1], [1]],    // single element
];

for (const solve of [bruteForce, optimal]) {
  for (const [input, expected] of testCases) {
    assert.deepStrictEqual(solve(input), expected);
  }
}
console.log('✓ problem-template passed');

// ---------- E: Evaluate ----------
// Time:  O(?) because ...
// Space: O(?) because ...
// Trade-off: ...
// Follow-ups the interviewer might ask: ...

module.exports = { optimal, bruteForce };
