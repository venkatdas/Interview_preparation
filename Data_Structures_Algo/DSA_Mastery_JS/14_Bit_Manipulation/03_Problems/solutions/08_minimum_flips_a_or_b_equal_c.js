/**
 * 08. Minimum Flips to Make a OR b Equal to c   (LeetCode 1318 — Medium)
 *
 * PROBLEM
 * Given positive integers a, b, c, return the minimum number of single-bit flips in a and/or b
 * so that (a | b) === c.
 *
 * EXAMPLES
 * Input: a = 2, b = 6, c = 5   Output: 3
 *   Explanation: a=010 b=110 c=101. bit0: need 1, both 0 -> 1 flip. bit1: need 0, both 1 -> 2 flips. bit2: ok.
 * Input: a = 4, b = 2, c = 7   Output: 1
 * Input: a = 1, b = 2, c = 3   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - All positive and fit in 32 bits? (yes)
 *
 * APPROACH 1 — Brute force   O(32) time, O(1) space, via strings
 * Convert all three to 32-char binary strings and compare column by column with the
 * same case analysis. Same logic, just clunkier.
 *
 * APPROACH 2 — Optimal (per-bit case analysis)   O(32) = O(1) time, O(1) space
 * Look at bit i of a, b, c independently (bits do not interact under OR):
 *   c bit = 1 : need at least one of a,b to be 1. If both 0 -> 1 flip, else 0.
 *   c bit = 0 : need BOTH a,b to be 0. Flips = (a bit) + (b bit).
 *
 * Dry run on a=2 (010), b=6 (110), c=5 (101):
 *   bit0: c=1, a=0, b=0 -> +1
 *   bit1: c=0, a=1, b=1 -> +2
 *   bit2: c=1, a=0, b=1 -> +0   -> 3
 *
 * EDGE CASES
 * - already equal -> 0
 * - c = 0 -> popcount(a) + popcount(b)
 */

function bruteForce(a, b, c) {
  const bitsA = (a >>> 0).toString(2).padStart(32, '0');
  const bitsB = (b >>> 0).toString(2).padStart(32, '0');
  const bitsC = (c >>> 0).toString(2).padStart(32, '0');
  let flips = 0;
  for (let i = 0; i < 32; i++) {
    if (bitsC[i] === '1') {
      if (bitsA[i] === '0' && bitsB[i] === '0') flips++;
    } else {
      if (bitsA[i] === '1') flips++;
      if (bitsB[i] === '1') flips++;
    }
  }
  return flips;
}

function optimal(a, b, c) {
  let flips = 0;
  for (let i = 0; i < 32; i++) {
    const bitA = (a >>> i) & 1;
    const bitB = (b >>> i) & 1;
    const bitC = (c >>> i) & 1;
    if (bitC === 1) {
      if (bitA === 0 && bitB === 0) flips++;   // turn one of them on
    } else {
      flips += bitA + bitB;                    // turn every 1 off
    }
  }
  return flips;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(2, 6, 5), 3);
  assert.strictEqual(solve(4, 2, 7), 1);
  assert.strictEqual(solve(1, 2, 3), 0);
  assert.strictEqual(solve(7, 7, 0), 6);
  assert.strictEqual(solve(0, 0, 0), 0);
  assert.strictEqual(solve(8, 3, 5), 3);
}
console.log('✓ 08-minimum-flips-a-or-b-equal-c passed');

module.exports = { optimal, bruteForce };
