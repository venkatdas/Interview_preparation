/**
 * 02. Lexicographically Smallest Equivalent String   (LeetCode 1061 — Medium)
 *
 * PROBLEM
 * s1 and s2 have the same length; s1[i] and s2[i] are "equivalent" characters.
 * Equivalence is reflexive, symmetric and transitive. For baseStr, replace every
 * character by the smallest character equivalent to it and return the result.
 *
 * EXAMPLES
 * Input: s1 = "parker", s2 = "morris", baseStr = "parser"   Output: "makkek"
 *   groups: {m,p}, {a,o}, {k,r}, {e,i}, {s}
 * Input: s1 = "hello", s2 = "world", baseStr = "hold"       Output: "hdld"
 * Input: s1 = "leetcode", s2 = "programs", baseStr = "sourcecode"   Output: "aauaaaaada"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase letters (26 nodes)
 * - baseStr may contain letters not in s1/s2 (they map to themselves)
 *
 * APPROACH 1 — Brute force   O(26 * (n + 26)) time
 * Build an adjacency list of equivalences; for each character of baseStr do a DFS over its
 * component and take the minimum letter. Repeated DFS per character is wasteful but fine
 * for 26 letters.
 *
 * APPROACH 2 — Optimal (Union-Find where the root is always the smallest letter)
 *   O((n + m) * alpha(26)) time, O(26) space
 * Union every pair (s1[i], s2[i]). When merging two roots, make the SMALLER letter the
 * parent. Then find(ch) directly returns the smallest equivalent letter. The trick of
 * choosing the representative on purpose replaces union-by-size (no balance needed for
 * 26 nodes).
 *
 * Dry run: s1 = "parker", s2 = "morris"
 *   p-m -> root m; a-o -> root a; r-r no-op; k-r -> root k; e-i -> root e; r-s -> find(r)=k, s -> k
 *   baseStr "parser": p->m, a->a, r->k, s->k, e->e, r->k  -> "makkek"
 *
 * EDGE CASES
 * - s1 === s2 (all no-ops)
 * - a chain a-b, b-c, c-d -> all map to a
 * - empty baseStr -> ""
 */

function bruteForce(s1, s2, baseStr) {
  const adj = Array.from({ length: 26 }, () => []);
  for (let i = 0; i < s1.length; i++) {
    const a = s1.charCodeAt(i) - 97;
    const b = s2.charCodeAt(i) - 97;
    adj[a].push(b);
    adj[b].push(a);
  }
  function smallestInComponent(start) {
    const seen = new Set([start]);
    const stack = [start];
    let best = start;
    while (stack.length) {
      const node = stack.pop();
      best = Math.min(best, node);
      for (const nb of adj[node]) {
        if (!seen.has(nb)) {
          seen.add(nb);
          stack.push(nb);
        }
      }
    }
    return best;
  }
  let out = '';
  for (const ch of baseStr) out += String.fromCharCode(97 + smallestInComponent(ch.charCodeAt(0) - 97));
  return out;
}

function optimal(s1, s2, baseStr) {
  const parent = Array.from({ length: 26 }, (_, i) => i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  for (let i = 0; i < s1.length; i++) {
    const ra = find(s1.charCodeAt(i) - 97);
    const rb = find(s2.charCodeAt(i) - 97);
    if (ra === rb) continue;
    if (ra < rb) parent[rb] = ra;   // smaller letter becomes the representative
    else parent[ra] = rb;
  }
  let out = '';
  for (const ch of baseStr) out += String.fromCharCode(97 + find(ch.charCodeAt(0) - 97));
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('parker', 'morris', 'parser'), 'makkek');
  assert.strictEqual(solve('hello', 'world', 'hold'), 'hdld');
  assert.strictEqual(solve('leetcode', 'programs', 'sourcecode'), 'aauaaaaada');
  assert.strictEqual(solve('abc', 'abc', 'xyz'), 'xyz');
  assert.strictEqual(solve('abc', 'bcd', 'dcba'), 'aaaa');
  assert.strictEqual(solve('a', 'b', ''), '');
}
function randomWord(len) {
  return Array.from({ length: len }, () => 'abcdefg'[Math.floor(Math.random() * 7)]).join('');
}
for (let trial = 0; trial < 100; trial++) {
  const len = Math.floor(Math.random() * 6);
  const s1 = randomWord(len);
  const s2 = randomWord(len);
  const base = randomWord(Math.floor(Math.random() * 8));
  assert.strictEqual(optimal(s1, s2, base), bruteForce(s1, s2, base));
}
console.log('✓ 02-lexicographically-smallest-equivalent-string passed');

module.exports = { optimal, bruteForce };
