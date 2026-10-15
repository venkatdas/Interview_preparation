/**
 * 12. Strobogrammatic Number II   (LeetCode 247 — Medium)
 *
 * PROBLEM
 * A strobogrammatic number looks the same after rotating it 180 degrees
 * (0->0, 1->1, 8->8, 6->9, 9->6). Return all strobogrammatic numbers with exactly
 * n digits, as strings, with no leading zero (except "0" itself when n = 1).
 *
 * EXAMPLES
 * n = 1 -> ["0", "1", "8"]
 * n = 2 -> ["11", "69", "88", "96"]
 * n = 3 -> ["101","111","181","609","619","689","808","818","888","906","916","986"]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 14. Output order? (any)
 * - Is "00" valid for n = 2? (no - leading zero)
 *
 * APPROACH 1 — Brute force (check every n-digit number)   O(10^n * n) time
 * Loop over all numbers with n digits, rotate each, keep the ones equal to themselves.
 * Only usable for n <= 6.
 *
 * APPROACH 2 — Optimal (build from the inside out)   O(5^(n/2) * n) time
 * PROMISE: build(m) returns all strobogrammatic strings of length m, ALLOWING leading 0.
 *   base: m = 0 -> [""], m = 1 -> ["0", "1", "8"]
 *   step: for each inner of build(m - 2), wrap it with each pair
 *         (0,0) (1,1) (6,9) (8,8) (9,6)  ->  left + inner + right
 *   at the OUTERMOST level (m === n) skip the (0,0) pair: no leading zero.
 * Inner layers may use 0, so we need to know which call is the outer one -> pass n along.
 *
 * Dry run n = 3:
 *   build(1) = ["0","1","8"]
 *   wrap each with 1_1, 6_9, 8_8, 9_6 (no 0_0 at the outer level) -> 4 * 3 = 12 strings
 *
 * EDGE CASES
 * - n = 1: "0" is allowed (it is not a leading zero, it is the number zero)
 * - even n: middle is empty
 */

const PAIRS = [['0', '0'], ['1', '1'], ['6', '9'], ['8', '8'], ['9', '6']];

function bruteForce(n) {
  const rot = { 0: '0', 1: '1', 6: '9', 8: '8', 9: '6' };
  const out = [];
  const lo = n === 1 ? 0 : 10 ** (n - 1), hi = 10 ** n;
  for (let x = lo; x < hi; x++) {
    const s = String(x);
    let r = '';
    let ok = true;
    for (let i = s.length - 1; i >= 0 && ok; i--) {
      if (!(s[i] in rot)) ok = false; else r += rot[s[i]];
    }
    if (ok && r === s) out.push(s);
  }
  return out;
}

function optimal(n) {
  function build(m) {
    if (m === 0) return [''];
    if (m === 1) return ['0', '1', '8'];
    const out = [];
    for (const inner of build(m - 2)) {
      for (const [l, r] of PAIRS) {
        if (m === n && l === '0') continue;   // outermost layer: no leading zero
        out.push(l + inner + r);
      }
    }
    return out;
  }
  return build(n);
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (a) => [...a].sort();
assert.deepStrictEqual(sorted(optimal(1)), ['0', '1', '8']);
assert.deepStrictEqual(sorted(optimal(2)), ['11', '69', '88', '96']);
assert.strictEqual(optimal(3).length, 12);
assert.ok(!optimal(4).some((s) => s[0] === '0'));
assert.strictEqual(optimal(14).length, 4 * 5 ** 6);
for (let n = 1; n <= 6; n++) assert.deepStrictEqual(sorted(optimal(n)), sorted(bruteForce(n)));
console.log('✓ 12_strobogrammatic_number_ii passed');

module.exports = { optimal, bruteForce };
