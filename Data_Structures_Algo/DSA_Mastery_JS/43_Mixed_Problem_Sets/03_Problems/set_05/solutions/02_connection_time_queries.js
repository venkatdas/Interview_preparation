/**
 * 02. Connection Time Queries   (Original — Hard)
 *
 * PROBLEM
 * n computers (0..n-1) start disconnected. `logs` lists cable installations [time, u, v]
 * (not necessarily in time order); once installed a cable stays. For each query [a, b]
 * return the EARLIEST time at which a and b became connected (directly or through other
 * computers). Return 0 when a === b and -1 if they are never connected.
 *
 * EXAMPLES
 * Input: n = 4, logs = [[5, 0, 1], [2, 2, 3], [9, 1, 2]], queries = [[0, 1], [0, 3], [2, 3], [1, 1]]
 * Output: [5, 9, 2, 0]
 * Input: n = 3, logs = [[1, 0, 1]], queries = [[0, 2]]   Output: [-1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n, logs, queries up to 10^5. Times distinct? (not required)
 * - Self-loops or repeated cables? (allowed, harmless)
 *
 * APPROACH 1 — Brute force   O(m * (n + q) * α) time
 * Sort logs by time. Add cables one at a time to a union-find; after each one, check every
 * still-unanswered query and record the current time if it just got connected.
 *
 * APPROACH 2 — Optimal (sort + union-find WITHOUT path compression, edges stamped with time)   O(m log m + (m + q) log n) time, O(n) space
 * Sort logs by time and union by size (keeps trees O(log n) deep). Never compress paths,
 * and remember stamp[child] = time when child's root was attached under another root.
 * The DSU forest is then a time-stamped tree: a and b are connected at time T iff the
 * paths from a and b meet below edges with stamp <= T. So the answer is the maximum stamp
 * on the two paths up to their lowest common ancestor in the DSU forest (if they share a root).
 * Walk both nodes up: always move the one with the SMALLER stamp first (stamps increase
 * going up), until they meet.
 *
 * Dry run on example 1 (sorted logs: t2 (2,3), t5 (0,1), t9 (1,2)):
 *   t2: union 2,3 -> parent[3]=2, stamp[3]=2
 *   t5: union 0,1 -> parent[1]=0, stamp[1]=5
 *   t9: union roots 0 and 2 (sizes equal) -> parent[2]=0, stamp[2]=9
 *   query (0,3): 3 -> 2 (stamp 2) -> 0 (stamp 9); 0 is root -> max stamp 9
 *   query (2,3): meet at 2 after 3 climbs edge stamp 2 -> 2
 *
 * EDGE CASES
 * - a === b -> 0
 * - different final roots -> -1
 * - cables that join already-connected computers -> skipped (no new stamp)
 *
 * COMMON MISTAKES
 * - Using path compression: it rewires edges and destroys the time stamps.
 * - Answering with the time the ROOTS merged instead of the max stamp on the meeting paths.
 */

function bruteForce(n, logs, queries) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const ans = queries.map(([a, b]) => (a === b ? 0 : -1));
  for (const [t, u, v] of logs.slice().sort((x, y) => x[0] - y[0])) {
    parent[find(u)] = find(v);
    queries.forEach(([a, b], i) => { if (ans[i] === -1 && find(a) === find(b)) ans[i] = t; });
  }
  return ans;
}

function optimal(n, logs, queries) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = new Array(n).fill(1);
  const stamp = new Array(n).fill(Infinity); // time this node was attached under its parent
  const root = (x) => { while (parent[x] !== x) x = parent[x]; return x; };
  for (const [t, u, v] of logs.slice().sort((x, y) => x[0] - y[0])) {
    let a = root(u), b = root(v);
    if (a === b) continue;
    if (size[a] < size[b]) [a, b] = [b, a];
    parent[b] = a; size[a] += size[b]; stamp[b] = t;
  }
  return queries.map(([a, b]) => {
    if (a === b) return 0;
    if (root(a) !== root(b)) return -1;
    let best = 0;
    while (a !== b) { // climb the side whose next edge is older; stamps grow upward
      if (stamp[a] < stamp[b]) { best = Math.max(best, stamp[a]); a = parent[a]; }
      else { best = Math.max(best, stamp[b]); b = parent[b]; }
    }
    return best;
  });
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(4, [[5, 0, 1], [2, 2, 3], [9, 1, 2]], [[0, 1], [0, 3], [2, 3], [1, 1]]), [5, 9, 2, 0]);
  assert.deepStrictEqual(solve(3, [[1, 0, 1]], [[0, 2]]), [-1]);
  assert.deepStrictEqual(solve(1, [], [[0, 0]]), [0]);
  assert.deepStrictEqual(solve(3, [[4, 0, 1], [1, 0, 1], [7, 1, 2]], [[0, 1], [2, 0]]), [1, 7]);
  assert.deepStrictEqual(solve(2, [[3, 0, 0]], [[0, 1]]), [-1]);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(502);
for (let t = 0; t < 400; t++) {
  const n = 1 + Math.floor(rand() * 8);
  const logs = Array.from({ length: Math.floor(rand() * 10) }, () => [Math.floor(rand() * 20), Math.floor(rand() * n), Math.floor(rand() * n)]);
  const queries = Array.from({ length: Math.floor(rand() * 6) }, () => [Math.floor(rand() * n), Math.floor(rand() * n)]);
  assert.deepStrictEqual(optimal(n, logs, queries), bruteForce(n, logs, queries));
}
console.log('✓ set_05/02_connection_time_queries passed');
module.exports = { optimal, bruteForce };
