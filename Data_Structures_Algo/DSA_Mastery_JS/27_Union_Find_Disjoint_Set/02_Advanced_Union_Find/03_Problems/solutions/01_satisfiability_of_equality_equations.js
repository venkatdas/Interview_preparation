/**
 * 01. Satisfiability of Equality Equations   (LeetCode 990 — Medium)
 *
 * PROBLEM
 * You get equations of the form "a==b" or "a!=b" over single lowercase letters.
 * Return true if some assignment of integers to the letters satisfies all of them.
 *
 * EXAMPLES
 * Input: ["a==b","b!=a"]            Output: false
 * Input: ["b==a","a==b"]            Output: true
 * Input: ["a==b","b==c","a==c"]     Output: true
 * Input: ["a==b","b!=c","c==a"]     Output: false
 * Input: ["a!=a"]                   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Variables are single letters a-z (26 nodes)
 * - Can the same equation appear twice? (yes, harmless)
 * - Is "a!=a" possible? (yes -> false)
 *
 * APPROACH 1 — Brute force   O(26! ...) no; practical brute: BFS components   O(n + 26)
 * Build a graph of "==" edges, flood-fill to label components, then check each "!=".
 * This is fine, but union-find is the expected tool and shorter.
 *
 * APPROACH 2 — Optimal (Union-Find in two passes)   O(n * alpha(26)) time, O(26) space
 * Equality is transitive, so letters joined by "==" form components. Process every "=="
 * first (union), THEN every "!=" (find both; if same root -> contradiction).
 * Order matters: a "!=" seen before a later "==" could be wrongly accepted.
 *
 * Dry run on ["a==b","b!=c","c==a"]:
 *   pass 1: union(a,b): {a,b}; union(c,a): {a,b,c}
 *   pass 2: b!=c: find(b) === find(c) -> false
 *
 * EDGE CASES
 * - "a!=a" -> false immediately
 * - only "!=" equations -> true
 * - empty list -> true
 */

function bruteForce(equations) {
  const adj = new Map();
  for (const eq of equations) {
    if (eq[1] === '=') {
      const [a, b] = [eq[0], eq[3]];
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a).push(b);
      adj.get(b).push(a);
    }
  }
  const label = new Map();
  let next = 0;
  for (const start of adj.keys()) {
    if (label.has(start)) continue;
    const stack = [start];
    label.set(start, next);
    while (stack.length) {
      const node = stack.pop();
      for (const nb of adj.get(node)) {
        if (!label.has(nb)) {
          label.set(nb, next);
          stack.push(nb);
        }
      }
    }
    next++;
  }
  for (const eq of equations) {
    if (eq[1] === '!') {
      const [a, b] = [eq[0], eq[3]];
      if (a === b) return false;
      if (label.has(a) && label.has(b) && label.get(a) === label.get(b)) return false;
    }
  }
  return true;
}

function optimal(equations) {
  const parent = Array.from({ length: 26 }, (_, i) => i);
  const idx = (ch) => ch.charCodeAt(0) - 97;

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];   // path halving
      x = parent[x];
    }
    return x;
  }

  for (const eq of equations) {
    if (eq[1] === '=') parent[find(idx(eq[0]))] = find(idx(eq[3]));
  }
  for (const eq of equations) {
    if (eq[1] === '!' && find(idx(eq[0])) === find(idx(eq[3]))) return false;
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
  assert.strictEqual(solve([]), true);
  assert.strictEqual(solve(['a!=b', 'b!=c', 'c!=a']), true);
}
for (let trial = 0; trial < 100; trial++) {
  const letters = 'abcde';
  const n = Math.floor(Math.random() * 8);
  const equations = Array.from({ length: n }, () => {
    const a = letters[Math.floor(Math.random() * 5)];
    const b = letters[Math.floor(Math.random() * 5)];
    return a + (Math.random() < 0.6 ? '==' : '!=') + b;
  });
  assert.strictEqual(optimal(equations), bruteForce(equations));
}
console.log('✓ 01-satisfiability-of-equality-equations passed');

module.exports = { optimal, bruteForce };
