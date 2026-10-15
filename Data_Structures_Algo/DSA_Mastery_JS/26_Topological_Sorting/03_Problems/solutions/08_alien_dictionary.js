/**
 * 08. Alien Dictionary   (LeetCode 269 — Hard)
 *
 * PROBLEM
 * You get a list of words sorted according to an unknown alphabet (the "alien" order).
 * Derive the order of the letters. Return any valid order as a string, or "" if the
 * words are inconsistent (contradiction / cycle, or an invalid prefix case). Letters
 * that appear in the words but have no ordering constraint may go anywhere.
 *
 * EXAMPLES
 * Input: ["wrt","wrf","er","ett","rftt"]   Output: "wertf"
 * Input: ["z","x"]                          Output: "zx"
 * Input: ["z","x","z"]                      Output: ""   (z < x and x < z)
 * Input: ["abc","ab"]                       Output: ""   (a longer word cannot come
 *                                                        before its own prefix)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase letters only? (yes)
 * - Multiple valid answers accepted? (yes)
 * - Is ["ab", "abc"] valid? (yes - prefix FIRST is fine)
 *
 * HOW TO GET EDGES: compare each ADJACENT pair of words. The first position where they
 * differ gives one fact: word1[i] -> word2[i]. Only the first difference counts!
 *   "wrt" vs "wrf": t -> f        "wrf" vs "er": w -> e
 *   "er"  vs "ett": r -> t        "ett" vs "rftt": e -> r
 *
 * APPROACH 1 — Alternative (DFS post-order with 3 colours)   O(C + total letters)
 * Build the same graph, run DFS topological sort; a gray hit means contradiction -> "".
 * Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (edges + Kahn)   O(total letters + C) time, O(C) space  (C <= 26)
 *   1. Collect every letter that appears (nodes), in-degree 0.
 *   2. For each adjacent pair, add the first-difference edge; if no difference and word1
 *      is longer -> return "".
 *   3. Kahn's algorithm. If fewer letters come out than exist -> "".
 *
 * Dry run on ["wrt","wrf","er","ett","rftt"]:
 *   letters {w,r,t,f,e}; edges t->f, w->e, r->t, e->r
 *   indeg: w0 r1 t1 f1 e1  queue [w]
 *   pop w -> "w", e becomes 0;  pop e -> "we", r 0;  pop r -> "wer", t 0;
 *   pop t -> "wert", f 0;  pop f -> "wertf". 5 letters = 5 -> "wertf"
 *
 * EDGE CASES
 * - single word -> its unique letters in any order
 * - ["abc","ab"] -> "" (invalid prefix)
 * - duplicate words -> no edge, fine
 * - letters with no constraints must still appear in the output
 */

// shared: returns { letters: Set, adj: Map<letter, Set<letter>> } or null if invalid prefix
function buildGraph(words) {
  const adj = new Map();
  for (const word of words) for (const ch of word) if (!adj.has(ch)) adj.set(ch, new Set());

  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i];
    const b = words[i + 1];
    const minLen = Math.min(a.length, b.length);
    let j = 0;
    while (j < minLen && a[j] === b[j]) j++;
    if (j === minLen) {
      if (a.length > b.length) return null;      // "abc" before "ab" is impossible
      continue;                                  // prefix case, no information
    }
    adj.get(a[j]).add(b[j]);                     // first difference: a[j] < b[j]
  }
  return adj;
}

function dfsVersion(words) {
  const adj = buildGraph(words);
  if (!adj) return '';
  const color = new Map();                       // undefined = white, 1 gray, 2 black
  const finished = [];
  function dfs(letter) {
    color.set(letter, 1);
    for (const next of adj.get(letter)) {
      if (color.get(next) === 1) return false;
      if (!color.has(next) && !dfs(next)) return false;
    }
    color.set(letter, 2);
    finished.push(letter);
    return true;
  }
  for (const letter of adj.keys()) {
    if (!color.has(letter) && !dfs(letter)) return '';
  }
  return finished.reverse().join('');
}

function optimal(words) {
  const adj = buildGraph(words);
  if (!adj) return '';
  const indegree = new Map();
  for (const letter of adj.keys()) indegree.set(letter, 0);
  for (const nexts of adj.values()) {
    for (const next of nexts) indegree.set(next, indegree.get(next) + 1);
  }

  const queue = [];
  for (const [letter, deg] of indegree) if (deg === 0) queue.push(letter);

  let order = '';
  let head = 0;
  while (head < queue.length) {
    const letter = queue[head++];
    order += letter;
    for (const next of adj.get(letter)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  return order.length === adj.size ? order : '';  // missing letters = cycle
}

// ---------- tests ----------
const assert = require('assert');
// any valid order is accepted, so verify constraints instead of exact strings
function isValidOrder(order, words) {
  const adj = buildGraph(words);
  if (!adj) return order === '';
  if (order.length !== adj.size || new Set(order).size !== order.length) return false;
  const pos = new Map([...order].map((ch, i) => [ch, i]));
  for (const [from, tos] of adj) for (const to of tos) if (pos.get(from) > pos.get(to)) return false;
  return true;
}
for (const solve of [dfsVersion, optimal]) {
  const w1 = ['wrt', 'wrf', 'er', 'ett', 'rftt'];
  assert.ok(isValidOrder(solve(w1), w1));
  assert.strictEqual(solve(['z', 'x']), 'zx');
  assert.strictEqual(solve(['z', 'x', 'z']), '');
  assert.strictEqual(solve(['abc', 'ab']), '');
  assert.ok(isValidOrder(solve(['ab', 'abc']), ['ab', 'abc']));
  assert.ok(isValidOrder(solve(['zy', 'zx']), ['zy', 'zx']));
  assert.strictEqual(solve(['a', 'b', 'a']), '');
  assert.strictEqual(solve(['abc']).length, 3);
}
assert.strictEqual(optimal(['wrt', 'wrf', 'er', 'ett', 'rftt']), 'wertf');
console.log('✓ 08-alien-dictionary passed');

module.exports = { optimal, dfsVersion, buildGraph };
