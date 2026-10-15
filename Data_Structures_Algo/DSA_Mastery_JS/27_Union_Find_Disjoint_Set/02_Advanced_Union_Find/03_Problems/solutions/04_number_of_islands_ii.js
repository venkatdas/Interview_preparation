/**
 * 04. Number of Islands II   (LeetCode 305 — Hard)
 *
 * PROBLEM
 * An m x n grid starts all water. positions[i] = [row, col] turns that cell into land,
 * one at a time. After each operation return the number of islands (4-directionally
 * connected land groups).
 *
 * EXAMPLES
 * Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]   Output: [1,1,2,3]
 *   (0,0) -> 1 island; (0,1) joins it -> 1; (1,2) separate -> 2; (2,1) separate -> 3
 * Input: m = 1, n = 1, positions = [[0,0]]   Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the same cell be added twice? (yes -> the count must not change)
 * - Up to 10^4 operations on a 10^4 x 10^4 grid -> cannot re-scan the grid each time,
 *   and cannot even allocate m*n cells eagerly in some variants (use a Map)
 *
 * APPROACH 1 — Brute force   O(k * m * n) time
 * After each addition, flood-fill the whole grid and count components.
 *
 * APPROACH 2 — Optimal (Online union-find)   O(k * alpha) time, O(m * n) space
 * Each land cell is a node id = row * n + col. When a cell becomes land:
 *   count++ (it is a new island by itself)
 *   for each of its 4 neighbours that is land: if union succeeds, count--
 * Union-find is perfect because we only ever ADD connections, never remove them.
 *
 * Dry run on the example:
 *   (0,0): count 1; no land neighbours                                -> 1
 *   (0,1): count 2; neighbour (0,0) is land, union -> count 1          -> 1
 *   (1,2): count 2; neighbours (0,2),(2,2),(1,1) water                 -> 2
 *   (2,1): count 3; neighbours (1,1),(2,0),(2,2) water                 -> 3
 *
 * EDGE CASES
 * - duplicate positions -> same count as before
 * - a cell that joins two or more islands -> count drops by the number of successful unions
 * - 1x1 grid
 */

function bruteForce(m, n, positions) {
  const grid = Array.from({ length: m }, () => new Array(n).fill(false));
  const result = [];
  for (const [r, c] of positions) {
    grid[r][c] = true;
    const seen = Array.from({ length: m }, () => new Array(n).fill(false));
    let count = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (!grid[i][j] || seen[i][j]) continue;
        count++;
        const stack = [[i, j]];
        seen[i][j] = true;
        while (stack.length) {
          const [x, y] = stack.pop();
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < m && ny < n && grid[nx][ny] && !seen[nx][ny]) {
              seen[nx][ny] = true;
              stack.push([nx, ny]);
            }
          }
        }
      }
    }
    result.push(count);
  }
  return result;
}

function optimal(m, n, positions) {
  const parent = new Map();    // only land cells are stored
  function find(x) {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  }
  let count = 0;
  const result = [];
  for (const [r, c] of positions) {
    const id = r * n + c;
    if (parent.has(id)) {          // duplicate: nothing changes
      result.push(count);
      continue;
    }
    parent.set(id, id);
    count++;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
      const nid = nr * n + nc;
      if (!parent.has(nid)) continue;            // water
      const ra = find(id);
      const rb = find(nid);
      if (ra !== rb) {
        parent.set(ra, rb);
        count--;                                 // two islands merged into one
      }
    }
    result.push(count);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]), [1, 1, 2, 3]);
  assert.deepStrictEqual(solve(1, 1, [[0, 0]]), [1]);
  assert.deepStrictEqual(solve(2, 2, [[0, 0], [1, 1], [0, 1]]), [1, 2, 1]);      // bridge joins two
  assert.deepStrictEqual(solve(2, 2, [[0, 0], [0, 0]]), [1, 1]);                 // duplicate
  assert.deepStrictEqual(solve(3, 3, [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]), [1, 1, 1, 1, 1]);
}
for (let trial = 0; trial < 50; trial++) {
  const m = 1 + Math.floor(Math.random() * 5);
  const n = 1 + Math.floor(Math.random() * 5);
  const positions = Array.from({ length: 1 + Math.floor(Math.random() * 15) }, () => [
    Math.floor(Math.random() * m),
    Math.floor(Math.random() * n),
  ]);
  assert.deepStrictEqual(optimal(m, n, positions), bruteForce(m, n, positions));
}
console.log('✓ 04-number-of-islands-ii passed');

module.exports = { optimal, bruteForce };
