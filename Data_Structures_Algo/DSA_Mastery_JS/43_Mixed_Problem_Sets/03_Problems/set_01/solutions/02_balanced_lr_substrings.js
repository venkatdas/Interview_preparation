/**
 * 02. Balanced L/R Substrings   (Original — Easy)
 *
 * PROBLEM
 * A dance routine is written as a string of 'L' (step left), 'R' (step right) and '.'
 * (pause). A non-empty substring is "balanced" if it has the same number of 'L' as 'R'
 * (pauses do not matter, so "..", "L.R" and "RL" are all balanced).
 * Return how many balanced substrings the routine has (count every start/end pair).
 *
 * EXAMPLES
 * Input: "LR"     Output: 1   Explanation: only "LR"
 * Input: "L.R"    Output: 2   Explanation: "L.R" and "."
 * Input: "LRLR"   Output: 4   Explanation: "LR" (x2), "RL", "LRLR"
 * Input: "LLL"    Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only 'L', 'R', '.' characters. Length up to 10^5, so O(n^2) is too slow.
 * - Overlapping and repeated substrings count separately (count positions, not text).
 * - The answer can exceed 2^31 for long strings, but stays below 2^53.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Fix a start i, extend the end j one character at a time while tracking
 * balance = #L - #R. Each time balance is 0, count one.
 *
 * APPROACH 2 — Optimal (prefix sum + hash map of counts)   O(n) time, O(n) space
 * Let P[j] = (#L - #R) in the first j characters (P[0] = 0). Substring s[i..j-1] is
 * balanced exactly when P[i] === P[j]. So walk once, and for each new prefix value
 * add "how many earlier prefixes had the same value", then record it.
 *
 * Dry run on "L.R":
 *   start          bal=0  seen{0:1}               total=0
 *   'L'  bal=1     seen has 0 of 1 -> +0          seen{0:1,1:1}      total=0
 *   '.'  bal=1     seen has 1 of 1 -> +1 (".")    seen{0:1,1:2}      total=1
 *   'R'  bal=0     seen has 1 of 0 -> +1 ("L.R")  seen{0:2,1:2}      total=2
 *   answer 2
 *
 * EDGE CASES
 * - ""             -> 0 (no non-empty substring)
 * - "...."         -> every substring is balanced: n*(n+1)/2
 * - only L's       -> 0
 *
 * COMMON MISTAKES
 * - Forgetting to seed the map with {0: 1}: misses substrings that start at index 0.
 * - Adding the current prefix to the map BEFORE counting it: counts the empty substring.
 */

function bruteForce(s) {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    let bal = 0;
    for (let j = i; j < s.length; j++) {
      if (s[j] === 'L') bal++; else if (s[j] === 'R') bal--;
      if (bal === 0) total++;
    }
  }
  return total;
}

function optimal(s) {
  const seen = new Map([[0, 1]]); // the empty prefix
  let bal = 0, total = 0;
  for (const ch of s) {
    if (ch === 'L') bal++; else if (ch === 'R') bal--;
    const c = seen.get(bal) || 0;
    total += c; // every earlier equal prefix closes a balanced substring here
    seen.set(bal, c + 1);
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('LR'), 1);
  assert.strictEqual(solve('L.R'), 2);
  assert.strictEqual(solve('LRLR'), 4);
  assert.strictEqual(solve('LLL'), 0);
  assert.strictEqual(solve(''), 0);
  assert.strictEqual(solve('...'), 6);
  assert.strictEqual(solve('RL.'), 3); // "RL", "RL.", "."
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(102);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 15);
  let s = '';
  for (let i = 0; i < n; i++) s += 'LR.'[Math.floor(rand() * 3)];
  assert.strictEqual(optimal(s), bruteForce(s));
}
console.log('✓ set_01/02_balanced_lr_substrings passed');
module.exports = { optimal, bruteForce };
