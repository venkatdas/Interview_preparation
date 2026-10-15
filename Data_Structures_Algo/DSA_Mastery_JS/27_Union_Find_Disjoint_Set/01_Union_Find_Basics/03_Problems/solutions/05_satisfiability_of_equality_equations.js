/**
 * 05. Satisfiability of Equality Equations   (LeetCode 990 — Medium)
 *
 * PROBLEM
 * Each equation is a 4-character string "a==b" or "a!=b" over single lowercase letters.
 * Return true if it is possible to assign values to the letters so that ALL equations
 * hold at once.
 *
 * EXAMPLES
 * Input: ["a==b","b!=a"]            Output: false
 * Input: ["b==a","a==b"]            Output: true
 * Input: ["a==b","b==c","a==c"]     Output: true
 * Input: ["a==b","b!=c","c==a"]     Output: false
 * Input: ["c==c","b==d","x!=z"]     Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - "a!=a" alone? (impossible -> false; the algorithm handles it since find(a)===find(a))
 * - Only 26 variables -> UnionFind(26) indexed by charCode - 97
 *
 * APPROACH 1 — Brute force (build == graph, DFS components, then check !=)   O(E + 26)
 * Build an adjacency list from "==" edges, label each letter with its component via DFS,
 * then every "!=" must have different labels. Correct and the same complexity; it is just
 * more code than union-find.
 *
 * APPROACH 2 — Optimal (Union-Find in two passes)   O(E * alpha(26)) time, O(1) space
 *   Pass 1: for every "==" equation, union(a, b).
 *   Pass 2: for every "!=" equation, if find(a) === find(b) -> contradiction -> false.
 * The two-pass order matters: a "!=" seen before a later "==" that joins them would be
 * missed if we checked in a single pass.
 *
 * Dry run ["a==b","b!=c","c==a"]:
 *   pass 1: union(a,b), union(c,a) -> {a,b,c} one set
 *   pass 2: b!=c -> find(b) === find(c) -> false
 *
 * EDGE CASES
 * - no "!=" at all -> true
 * - "a!=a" -> false
 * - letters that appear only in "!=" -> never unioned, fine
 */

const { UnionFind } = require('../../02_Implementations/union_find');

const id = (ch) => ch.charCodeAt(0) - 97;

function bruteForce(equations) {
  const adj = Array.from({ length: 26 }, () => []);
  for (const eq of equations) {
    if (eq[1] === '=') { adj[id(eq[0])].push(id(eq[3])); adj[id(eq[3])].push(id(eq[0])); }
  }
  const label = new Array(26).fill(-1);
  for (let start = 0; start < 26; start++) {
    if (label[start] !== -1) continue;
    const stack = [start];
    label[start] = start;
    while (stack.length) {
      const node = stack.pop();
      for (const next of adj[node]) if (label[next] === -1) { label[next] = start; stack.push(next); }
    }
  }
  for (const eq of equations) {
    if (eq[1] === '!' && label[id(eq[0])] === label[id(eq[3])]) return false;
  }
  return true;
}

function optimal(equations) {
  const uf = new UnionFind(26);
  for (const eq of equations) {
    if (eq[1] === '=') uf.union(id(eq[0]), id(eq[3]));          // pass 1: merge equals
  }
  for (const eq of equations) {
    if (eq[1] === '!' && uf.connected(id(eq[0]), id(eq[3]))) return false; // pass 2
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['a==b', 'b!=a']), false);
  assert.strictEqual(solve(['b==a', 'a==b']), true);
  assert.strictEqual(solve(['a==b', 'b==c', 'a==c']), true);
  assert.strictEqual(solve(['a==b', 'b!=c', 'c==a']), false);
  assert.strictEqual(solve(['c==c', 'b==d', 'x!=z']), true);
  assert.strictEqual(solve(['a!=a']), false);
  assert.strictEqual(solve(['a!=b', 'b==a']), false);   // != before == still caught
}
console.log('✓ 05-satisfiability-of-equality-equations passed');

module.exports = { optimal, bruteForce };
