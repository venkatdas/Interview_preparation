/**
 * 05. Isomorphic Strings   (LeetCode 205 — Easy)
 *
 * PROBLEM
 * Two strings s and t are isomorphic if every character of s can be replaced to get t,
 * where the replacement is consistent (same char always maps to the same char) and
 * no two different characters map to the same character. Order must be preserved.
 *
 * EXAMPLES
 * Input: s = "egg", t = "add"       Output: true    Explanation: e->a, g->d
 * Input: s = "foo", t = "bar"       Output: false   Explanation: o->a and o->r conflict
 * Input: s = "paper", t = "title"   Output: true    Explanation: p->t, a->i, e->l, r->e
 * Input: s = "badc", t = "baba"     Output: false   Explanation: b->b and d->b: two chars map to 'b'
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are lengths equal? (LeetCode guarantees it; check anyway)
 * - Any character set? (yes, so a Map not a 26-array)
 *
 * APPROACH 1 — Brute force (pattern fingerprint)   O(n) time, O(n) space
 * Convert each string into a "shape": replace each char with the index of its first
 * occurrence. "egg" -> [0,1,1], "add" -> [0,1,1]. Equal shapes -> isomorphic.
 * Building the shape uses indexOf which makes it O(n^2) in the simple version.
 *
 * APPROACH 2 — Optimal (two maps, bijection check)   O(n) time, O(k) space
 * Walk both strings together with two maps: sToT and tToS.
 * At position i:
 *   - if sToT has s[i] but maps to something else than t[i] -> false
 *   - if tToS has t[i] but maps to something else than s[i] -> false
 *   - otherwise record both directions
 * One map is not enough: "badc"/"baba" passes s->t alone (b->b, a->a, d->b ... wait d->b
 * while b->b is fine for s->t) but fails t->s (b maps to both b and d).
 *
 * Dry run on s = "foo", t = "bar":
 *   i=0 f/b: new, sToT{f:b} tToS{b:f}
 *   i=1 o/a: new, sToT{f:b,o:a} tToS{b:f,a:o}
 *   i=2 o/r: sToT has o -> a, but t[i] is r -> false
 *
 * EDGE CASES
 * - Different lengths -> false
 * - Empty strings -> true
 * - Same string -> true (identity mapping)
 * - Many-to-one mapping must fail ("ab" -> "aa")
 */

function bruteForce(s, t) {
  if (s.length !== t.length) return false;
  const shape = (str) => [...str].map((ch) => str.indexOf(ch)).join(',');
  return shape(s) === shape(t);
}

function optimal(s, t) {
  if (s.length !== t.length) return false;

  const sToT = new Map();
  const tToS = new Map();

  for (let i = 0; i < s.length; i++) {
    const a = s[i];
    const b = t[i];

    if (sToT.has(a) && sToT.get(a) !== b) return false; // a already maps elsewhere
    if (tToS.has(b) && tToS.get(b) !== a) return false; // b already taken by another char

    sToT.set(a, b);
    tToS.set(b, a);
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('egg', 'add'), true);
  assert.strictEqual(solve('foo', 'bar'), false);
  assert.strictEqual(solve('paper', 'title'), true);
  assert.strictEqual(solve('badc', 'baba'), false);
  assert.strictEqual(solve('ab', 'aa'), false);
  assert.strictEqual(solve('', ''), true);
  assert.strictEqual(solve('abc', 'abc'), true);
  assert.strictEqual(solve('a', 'ab'), false);
}
console.log('✓ 05-isomorphic-strings passed');

module.exports = { optimal, bruteForce };
