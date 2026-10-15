/**
 * 17. Open the Lock   (LeetCode 752 — Medium)
 *
 * PROBLEM
 * A lock has 4 wheels, each showing 0-9 and wrapping around (9 -> 0 and 0 -> 9). It starts
 * at "0000". One move turns ONE wheel one step. Some combinations are "deadends": if the
 * lock ever shows one, it jams. Return the minimum moves to reach `target`, or -1.
 *
 * EXAMPLES
 * Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"   Output: 6
 * Explanation: "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202"
 * Input: deadends = ["8888"], target = "0009"   Output: 1   ("0000" -> "0009")
 * Input: deadends = ["0000"], target = "8888"   Output: -1  (start is a dead end)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is "0000" itself possibly a deadend? (yes -> -1)
 * - target === "0000"? (0 moves)
 *
 * This is an IMPLICIT GRAPH: 10,000 nodes (every combination), each with 8 neighbours
 * (4 wheels x 2 directions). Unweighted, shortest path -> BFS.
 *
 * APPROACH 1 — Brute force (DFS with depth limit / iterative deepening)   very slow
 * Try all sequences of moves of length 1, then 2, ... until one reaches the target.
 * 8^k sequences at depth k. Included as a `dfsDeepening` reference only on tiny inputs.
 *
 * APPROACH 2 — Optimal (BFS over combinations)   O(10^4 * 8) time, O(10^4) space
 *   1. visited = deadends (treat them as already visited so we never enter them)
 *   2. if "0000" is a deadend -> -1
 *   3. BFS level by level; generate 8 neighbours by +1 / -1 on each wheel with wrap-around
 *   4. first time we see target -> current level
 *
 * Dry run (deadends none, target "0002"):
 *   level 0: "0000"
 *   level 1: "1000","9000","0100","0900","0010","0090","0001","0009"
 *   level 2: ... includes "0002" (from "0001") -> answer 2
 *
 * EDGE CASES
 * - start is a deadend -> -1
 * - target === "0000" -> 0
 * - target unreachable (walled in by deadends) -> -1
 */

function neighbors(code) {
  const result = [];
  for (let wheel = 0; wheel < 4; wheel++) {
    const digit = Number(code[wheel]);
    for (const delta of [1, -1]) {
      const turned = (digit + delta + 10) % 10;    // +10 makes -1 wrap to 9
      result.push(code.slice(0, wheel) + turned + code.slice(wheel + 1));
    }
  }
  return result;
}

function bruteForce(deadends, target) {
  // iterative deepening DFS - exponential, only for tiny depths
  const dead = new Set(deadends);
  if (dead.has('0000')) return -1;
  if (target === '0000') return 0;
  const MAX_DEPTH = 6;
  function dfs(code, depth, limit) {
    if (code === target) return true;
    if (depth === limit) return false;
    for (const next of neighbors(code)) {
      if (!dead.has(next) && dfs(next, depth + 1, limit)) return true;
    }
    return false;
  }
  for (let limit = 1; limit <= MAX_DEPTH; limit++) {
    if (dfs('0000', 0, limit)) return limit;
  }
  return -1;
}

function optimal(deadends, target) {
  const visited = new Set(deadends);              // never step on a deadend
  if (visited.has('0000')) return -1;
  if (target === '0000') return 0;
  visited.add('0000');
  let queue = ['0000'];
  let moves = 0;
  while (queue.length) {
    moves++;
    const nextQueue = [];
    for (const code of queue) {
      for (const next of neighbors(code)) {
        if (visited.has(next)) continue;
        if (next === target) return moves;
        visited.add(next);
        nextQueue.push(next);
      }
    }
    queue = nextQueue;
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(optimal(['0201', '0101', '0102', '1212', '2002'], '0202'), 6);
assert.strictEqual(optimal(['8888'], '0009'), 1);
assert.strictEqual(optimal(['8887', '8889', '8878', '8898', '8788', '8988', '7888', '9888'], '8888'), -1);
assert.strictEqual(optimal(['0000'], '8888'), -1);
assert.strictEqual(optimal([], '0000'), 0);
assert.strictEqual(optimal([], '9999'), 4);
// brute force only on small answers
assert.strictEqual(bruteForce(['8888'], '0009'), 1);
assert.strictEqual(bruteForce([], '0002'), 2);
assert.strictEqual(bruteForce(['0000'], '8888'), -1);
assert.strictEqual(bruteForce([], '9999'), 4);
assert.deepStrictEqual(neighbors('0000').sort(), ['0001', '0009', '0010', '0090', '0100', '0900', '1000', '9000']);
console.log('✓ 17-open-the-lock passed');

module.exports = { optimal, bruteForce, neighbors };
