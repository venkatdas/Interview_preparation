/**
 * 05. Build Rounds   (Original — Medium)
 *
 * PROBLEM
 * A monorepo has n packages numbered 0..n-1. deps[i] = [a, b] means package a must be built
 * before package b. The CI system works in rounds: in one round it builds, in parallel, every
 * package whose prerequisites were all built in earlier rounds. Return the minimum number of
 * rounds to build everything, or -1 if it is impossible (a circular dependency).
 *
 * EXAMPLES
 * n = 4, deps = [[0,1],[0,2],[1,3],[2,3]]  -> 3   (round 1: 0, round 2: 1 and 2, round 3: 3)
 * n = 3, deps = []                         -> 1   (all at once)
 * n = 2, deps = [[0,1],[1,0]]              -> -1  (cycle)
 * n = 0                                    -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^5, 0 <= deps.length <= 2 * 10^5. Duplicate edges are allowed (harmless).
 * - Self-dependency [a, a] is a cycle.
 *
 * PATTERN: topological sort (Kahn's algorithm, level by level). Clues: "must be built before",
 * "rounds / in parallel", "impossible if circular".
 *
 * APPROACH 1 — Brute force   O(n * (n + E)) time, O(n + E) space
 * Simulate: each round, scan every unbuilt package and build it if all its prerequisites are
 * built (from earlier rounds). If a round builds nothing while packages remain -> -1.
 *
 * APPROACH 2 — Optimal (Kahn by levels)   O(n + E) time, O(n + E) space
 * In-degree = number of unbuilt prerequisites. The first round is every package with in-degree 0.
 * Building a round's packages decrements their dependents; those reaching 0 form the next round.
 * Count rounds; if fewer than n packages were built, there is a cycle.
 *
 * Dry run on n=4, deps [[0,1],[0,2],[1,3],[2,3]]:
 *   inDeg = [0,1,1,2]; round 1 = [0]
 *   build 0 -> inDeg[1]=0, inDeg[2]=0; round 2 = [1,2]
 *   build 1 -> inDeg[3]=1; build 2 -> inDeg[3]=0; round 3 = [3]
 *   built 4 = n -> answer 3
 *
 * EDGE CASES
 * - n = 0 -> 0;  no deps -> 1;  any cycle (including a self-loop) -> -1.
 */

function bruteForce(n, deps) {
  const prereqs = Array.from({ length: n }, () => []);
  for (const [a, b] of deps) prereqs[b].push(a);
  const builtRound = new Array(n).fill(0); // 0 = not built yet, otherwise the round number
  let built = 0;
  let round = 0;
  while (built < n) {
    round++;
    const now = [];
    for (let p = 0; p < n; p++) {
      if (builtRound[p]) continue;
      if (prereqs[p].every((q) => builtRound[q] && builtRound[q] < round)) now.push(p);
    }
    if (now.length === 0) return -1;
    for (const p of now) builtRound[p] = round;
    built += now.length;
  }
  return round;
}

function optimal(n, deps) {
  const graph = Array.from({ length: n }, () => []); // not fill([]): rows must not be shared
  const inDegree = new Array(n).fill(0);
  for (const [a, b] of deps) { graph[a].push(b); inDegree[b]++; }
  let current = [];
  for (let p = 0; p < n; p++) if (inDegree[p] === 0) current.push(p);
  let rounds = 0;
  let built = 0;
  while (current.length) {
    rounds++;
    built += current.length;
    const next = [];
    for (const p of current) {
      for (const q of graph[p]) if (--inDegree[q] === 0) next.push(q);
    }
    current = next;
  }
  return built === n ? rounds : -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), 3);
  assert.strictEqual(solve(3, []), 1);
  assert.strictEqual(solve(2, [[0, 1], [1, 0]]), -1);
  assert.strictEqual(solve(0, []), 0);
  assert.strictEqual(solve(1, [[0, 0]]), -1);
  assert.strictEqual(solve(3, [[0, 1], [0, 1], [1, 2]]), 3); // duplicate edge
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(5);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 8);
  const deps = [];
  const m = n ? Math.floor(rand() * 10) : 0;
  for (let e = 0; e < m; e++) deps.push([Math.floor(rand() * n), Math.floor(rand() * n)]);
  assert.strictEqual(optimal(n, deps), bruteForce(n, deps));
}
console.log('✓ 05_build_rounds passed');

module.exports = { optimal, bruteForce };
