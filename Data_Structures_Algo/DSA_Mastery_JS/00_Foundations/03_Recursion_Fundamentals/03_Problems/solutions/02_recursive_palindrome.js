/**
 * 02. Recursive Palindrome   (Original — Easy)
 *
 * PROBLEM
 * Return true if string s reads the same forwards and backwards, considering only
 * letters and digits and ignoring case. Solve it RECURSIVELY. The recursive version
 * must run in O(n) time: it may not create a new string on each call.
 *
 * EXAMPLES
 * Input: "racecar"                          Output: true
 * Input: "Was it a car or a cat I saw?"     Output: true
 * Input: "abca"                             Output: false
 * Input: ""                                 Output: true
 * Input: ".,!"                              Output: true   (nothing to compare)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 2000 -> recursion depth at most n (each skip or compare is one frame), safe in Node (limit ~10k small frames).
 * - Unicode letters? (assume ASCII letters and digits)
 *
 * APPROACH 1 — Brute force (recursion with slicing)   O(n^2) time, O(n^2) total allocation
 * Clean the string once, then: isPal(t) = t.length < 2 || (t[0] === t.at(-1) && isPal(t.slice(1, -1))).
 * Looks O(n) but every slice copies up to n characters -> n/2 copies of size ~n.
 *
 * APPROACH 2 — Optimal (recursion on two indices)   O(n) time, O(n) stack
 * check(lo, hi):
 *   - skip non-alphanumeric characters by moving lo right or hi left (recursive step)
 *   - lo >= hi -> true (zero or one character left)
 *   - compare lowercase s[lo], s[hi]; if equal, check(lo + 1, hi - 1)
 * No copying: each call does O(1) work.
 *
 * Dry run "abca":
 *   check(0,3): 'a' vs 'a' equal -> check(1,2)
 *   check(1,2): 'b' vs 'c' differ -> false
 *
 * EDGE CASES
 * - empty string or only punctuation -> true
 * - single character -> true
 * - mixed case "Aa" -> true
 *
 * COMMON MISTAKES
 * - Slicing in every call (hidden O(n^2)).
 * - Base case lo === hi only: with even length lo jumps past hi and never equals it -> use lo >= hi.
 * - Recursing on punctuation skip with large runs of punctuation (fine here, but each skip is a frame).
 */

const isAlnum = c => /[a-z0-9]/i.test(c);

function bruteForce(s) {
  const t = [...s].filter(isAlnum).join('').toLowerCase();
  const isPal = u => u.length < 2 || (u[0] === u[u.length - 1] && isPal(u.slice(1, -1)));
  return isPal(t);
}

function optimal(s) {
  function check(lo, hi) {
    if (lo >= hi) return true;
    if (!isAlnum(s[lo])) return check(lo + 1, hi);
    if (!isAlnum(s[hi])) return check(lo, hi - 1);
    if (s[lo].toLowerCase() !== s[hi].toLowerCase()) return false;
    return check(lo + 1, hi - 1);
  }
  return check(0, s.length - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('racecar'), true);
  assert.strictEqual(solve('Was it a car or a cat I saw?'), true);
  assert.strictEqual(solve('abca'), false);
  assert.strictEqual(solve(''), true);
  assert.strictEqual(solve('.,!'), true);
  assert.strictEqual(solve('Aa'), true);
  assert.strictEqual(solve('ab'), false);
}
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(22);
for (let t = 0; t < 500; t++) {
  const half = Array.from({ length: Math.floor(rand() * 8) }, () => 'aB1 ,'[Math.floor(rand() * 5)]).join('');
  const s = rand() < 0.5 ? half + [...half].reverse().join('') : half + 'x' + half;
  assert.strictEqual(optimal(s), bruteForce(s), JSON.stringify(s));
}
console.log('✓ 02_recursive_palindrome passed');

module.exports = { optimal, bruteForce };
