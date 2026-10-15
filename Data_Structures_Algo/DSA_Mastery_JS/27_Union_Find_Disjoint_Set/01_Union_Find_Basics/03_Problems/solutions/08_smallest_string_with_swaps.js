/**
 * 08. Smallest String With Swaps   (LeetCode 1202 — Medium)
 *
 * PROBLEM
 * Given a string s and a list of index pairs. You may swap the characters at the two
 * indices of any pair, as many times as you like. Return the lexicographically smallest
 * string you can get.
 *
 * EXAMPLES
 * Input: s = "dcab", pairs = [[0,3],[1,2]]         Output: "bacd"
 * Input: s = "dcab", pairs = [[0,3],[1,2],[0,2]]   Output: "abcd"
 * Input: s = "cba", pairs = [[0,1],[1,2]]          Output: "abc"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Unlimited swaps? (yes - that is what makes it a components problem)
 * - No pairs -> return s unchanged
 *
 * KEY INSIGHT: if indices are connected through pairs (directly or via a chain), you can
 * arrange the characters at those indices in ANY order (unlimited swaps along a
 * connected graph can realise any permutation). So: for each connected component of
 * indices, sort its characters and place them back in sorted index order.
 *
 * APPROACH 1 — Alternative (DFS to find index components)   O(n log n + pairs)
 * Build adjacency over indices, DFS each component, sort. Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (Union-Find)   O((n + pairs) * alpha + n log n)
 *   1. union every pair.
 *   2. group indices by root; collect their chars.
 *   3. sort indices ascending and chars ascending; zip them back.
 *
 * Dry run "dcab", [[0,3],[1,2]]:
 *   components {0,3} chars [d,b] -> sorted [b,d] -> s[0]=b, s[3]=d
 *              {1,2} chars [c,a] -> sorted [a,c] -> s[1]=a, s[2]=c
 *   result "bacd"
 *
 * EDGE CASES
 * - empty pairs -> s
 * - all indices connected -> fully sorted string
 * - duplicate pairs
 */

const { UnionFind } = require('../../02_Implementations/union_find');

function dfsVersion(s, pairs) {
  const n = s.length;
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) { adj[a].push(b); adj[b].push(a); }
  const visited = new Array(n).fill(false);
  const result = s.split('');
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    const indices = [];
    const stack = [start];
    visited[start] = true;
    while (stack.length) {
      const i = stack.pop();
      indices.push(i);
      for (const j of adj[i]) if (!visited[j]) { visited[j] = true; stack.push(j); }
    }
    indices.sort((a, b) => a - b);
    const chars = indices.map((i) => s[i]).sort();
    indices.forEach((i, k) => { result[i] = chars[k]; });
  }
  return result.join('');
}

function optimal(s, pairs) {
  const n = s.length;
  const uf = new UnionFind(n);
  for (const [a, b] of pairs) uf.union(a, b);

  const groups = new Map();                       // root -> list of indices (ascending)
  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(i);                     // i increases, so already sorted
  }

  const result = s.split('');
  for (const indices of groups.values()) {
    const chars = indices.map((i) => s[i]).sort(); // smallest chars to smallest indices
    indices.forEach((i, k) => { result[i] = chars[k]; });
  }
  return result.join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dfsVersion, optimal]) {
  assert.strictEqual(solve('dcab', [[0, 3], [1, 2]]), 'bacd');
  assert.strictEqual(solve('dcab', [[0, 3], [1, 2], [0, 2]]), 'abcd');
  assert.strictEqual(solve('cba', [[0, 1], [1, 2]]), 'abc');
  assert.strictEqual(solve('dcab', []), 'dcab');
  assert.strictEqual(solve('a', []), 'a');
  assert.strictEqual(solve('zyx', [[0, 1], [0, 1]]), 'yzx');
}
console.log('✓ 08-smallest-string-with-swaps passed');

module.exports = { optimal, dfsVersion };
