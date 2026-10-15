/**
 * 04. Cursor Editor   (Original — Easy)
 *
 * PROBLEM
 * A tiny text editor starts empty with the cursor at position 0. It receives a string of
 * key presses `keys`:
 *   - a lowercase letter: insert it at the cursor (cursor moves right after it)
 *   - '<': move the cursor one left (ignored at the start)
 *   - '>': move the cursor one right (ignored at the end)
 *   - '#': delete the character just left of the cursor (ignored at the start)
 * Return the final text.
 *
 * EXAMPLES
 * Input: "ab<c"      Output: "acb"
 * Input: "abc<<#d"   Output: "dbc"   Explanation: cursor after 'a', delete 'a', type 'd'
 * Input: "<#>"       Output: ""
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 key presses. Inserting into the middle of an array is O(n) each.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * Keep the text in an array and use splice at the cursor index for every insert/delete.
 *
 * APPROACH 2 — Optimal (two stacks = a "gap buffer", like a doubly linked list split at the cursor)   O(n) time, O(n) space
 * Left stack holds the characters before the cursor (top = closest), right stack holds the
 * characters after it (top = closest). Insert = push left. '#' = pop left. '<' = move one
 * from left to right. '>' = move one from right to left. Answer = left + reversed right.
 *
 * Dry run on "abc<<#d":
 *   a,b,c      left [a,b,c]  right []
 *   <          left [a,b]    right [c]
 *   <          left [a]      right [c,b]
 *   #          left []       right [c,b]
 *   d          left [d]      right [c,b]
 *   text = "d" + reverse([c,b]) = "dbc"
 *
 * EDGE CASES
 * - moves/deletes at the boundaries are ignored
 * - empty input -> ""
 *
 * COMMON MISTAKES
 * - Forgetting to reverse the right stack at the end.
 * - Building strings with += inside the loop at the middle (O(n^2)).
 */

function bruteForce(keys) {
  const text = [];
  let cur = 0;
  for (const k of keys) {
    if (k === '<') { if (cur > 0) cur--; }
    else if (k === '>') { if (cur < text.length) cur++; }
    else if (k === '#') { if (cur > 0) { text.splice(cur - 1, 1); cur--; } }
    else { text.splice(cur, 0, k); cur++; }
  }
  return text.join('');
}

function optimal(keys) {
  const left = [], right = [];
  for (const k of keys) {
    if (k === '<') { if (left.length) right.push(left.pop()); }
    else if (k === '>') { if (right.length) left.push(right.pop()); }
    else if (k === '#') left.pop(); // pop on empty is a harmless no-op
    else left.push(k);
  }
  return left.join('') + right.reverse().join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('ab<c'), 'acb');
  assert.strictEqual(solve('abc<<#d'), 'dbc');
  assert.strictEqual(solve('<#>'), '');
  assert.strictEqual(solve(''), '');
  assert.strictEqual(solve('ab<<>>c'), 'abc');
  assert.strictEqual(solve('abc###x'), 'x');
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(304);
for (let t = 0; t < 300; t++) {
  let keys = '';
  const n = Math.floor(rand() * 20);
  for (let i = 0; i < n; i++) keys += 'abc<>#'[Math.floor(rand() * 6)];
  assert.strictEqual(optimal(keys), bruteForce(keys));
}
console.log('✓ set_03/04_cursor_editor passed');
module.exports = { optimal, bruteForce };
