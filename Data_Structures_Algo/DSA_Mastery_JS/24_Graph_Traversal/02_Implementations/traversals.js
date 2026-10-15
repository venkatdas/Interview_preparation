/**
 * Graph traversals in JavaScript.
 *
 * 1. bfs                 - level-order over an adjacency list, returns distance from start
 * 2. dfsRecursive        - depth-first with the call stack
 * 3. dfsIterative        - depth-first with an explicit stack
 * 4. bfsGrid             - BFS on a 2-D grid using the DIRS array
 * 5. multiSourceBfs      - start BFS from MANY cells at once (nearest-source distances)
 * 6. countComponents     - number of connected components (undirected)
 * 7. floodFill           - DFS that recolours a region of a grid
 *
 * All of them are O(V + E) time; on a grid that is O(rows * cols).
 */

const { buildAdjList, DIRS } = require('../../23_Graphs/02_Implementations/graph');

// ---------- 1. BFS ----------
// Returns dist[] where dist[v] = number of edges on the shortest path start -> v,
// or -1 when v is unreachable. Nodes are visited in order of distance.
function bfs(adj, start) {
  const dist = new Array(adj.length).fill(-1);
  dist[start] = 0;                 // marking dist !== -1 doubles as "visited"
  const queue = [start];
  let head = 0;                    // head pointer: O(1) dequeue, no shift()
  while (head < queue.length) {
    const current = queue[head++];
    for (const next of adj[current]) {
      if (dist[next] === -1) {     // first time we see it = shortest way to reach it
        dist[next] = dist[current] + 1;
        queue.push(next);
      }
    }
  }
  return dist;
}

// Level-by-level variant: process one whole "ring" per outer loop.
// Useful when you need "how many steps" without a dist array.
function bfsLevels(adj, start) {
  const levels = [];
  const visited = new Set([start]);
  let frontier = [start];
  while (frontier.length) {
    levels.push(frontier);
    const nextFrontier = [];
    for (const node of frontier) {
      for (const next of adj[node]) {
        if (!visited.has(next)) {
          visited.add(next);
          nextFrontier.push(next);
        }
      }
    }
    frontier = nextFrontier;
  }
  return levels;
}

// ---------- 2. DFS recursive ----------
function dfsRecursive(adj, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  for (const next of adj[start]) {
    if (!visited.has(next)) dfsRecursive(adj, next, visited, order);
  }
  return order;
}

// ---------- 3. DFS iterative ----------
// Pitfall: if you mark visited when PUSHING (like BFS) you still get a valid DFS
// visit set, but the ORDER differs from the recursive one. Marking when POPPING
// (and skipping already-visited pops) reproduces the recursive order exactly.
function dfsIterative(adj, start) {
  const order = [];
  const visited = new Set();
  const stack = [start];
  while (stack.length) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);
    // push in reverse so the FIRST neighbour is on top of the stack
    for (let i = adj[current].length - 1; i >= 0; i--) {
      if (!visited.has(adj[current][i])) stack.push(adj[current][i]);
    }
  }
  return order;
}

// ---------- 4. BFS on a grid ----------
// Shortest number of moves from (sr, sc) to every open cell. Walls are 1, open cells 0.
function bfsGrid(grid, startRow, startCol) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  dist[startRow][startCol] = 0;
  const queue = [[startRow, startCol]];
  let head = 0;
  while (head < queue.length) {
    const [row, col] = queue[head++];
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue; // off grid
      if (grid[r][c] === 1 || dist[r][c] !== -1) continue;     // wall or seen
      dist[r][c] = dist[row][col] + 1;
      queue.push([r, c]);
    }
  }
  return dist;
}

// ---------- 5. Multi-source BFS ----------
// Put ALL sources in the queue at distance 0. The result is the distance from each
// cell to its NEAREST source. Same cost as a single BFS: O(rows * cols).
function multiSourceBfs(grid, sources) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  const queue = [];
  for (const [r, c] of sources) {
    dist[r][c] = 0;
    queue.push([r, c]);
  }
  let head = 0;
  while (head < queue.length) {
    const [row, col] = queue[head++];
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (grid[r][c] === 1 || dist[r][c] !== -1) continue;
      dist[r][c] = dist[row][col] + 1;
      queue.push([r, c]);
    }
  }
  return dist;
}

// ---------- 6. Connected components ----------
function countComponents(n, edges) {
  const adj = buildAdjList(n, edges);
  const visited = new Array(n).fill(false);
  let count = 0;
  for (let node = 0; node < n; node++) {
    if (visited[node]) continue;
    count++;                       // every unvisited start = a brand-new island
    const stack = [node];
    visited[node] = true;
    while (stack.length) {
      const current = stack.pop();
      for (const next of adj[current]) {
        if (!visited[next]) {
          visited[next] = true;
          stack.push(next);
        }
      }
    }
  }
  return count;
}

// ---------- 7. Flood fill ----------
// Recolour every cell connected to (sr, sc) that has the same colour as it.
function floodFill(image, startRow, startCol, newColor) {
  const rows = image.length;
  const cols = image[0].length;
  const oldColor = image[startRow][startCol];
  if (oldColor === newColor) return image; // otherwise we would loop forever

  const fill = (row, col) => {
    if (row < 0 || col < 0 || row >= rows || col >= cols) return;
    if (image[row][col] !== oldColor) return;
    image[row][col] = newColor;              // recolouring IS the visited mark
    for (const [dr, dc] of DIRS) fill(row + dr, col + dc);
  };
  fill(startRow, startCol);
  return image;
}

// ---------- self-test ----------
// (runs only when this file is executed directly, not when required by a problem)
if (require.main === module) {
const assert = require('assert');

//   0 - 1 - 3
//   |       |
//   2       4     5 (isolated)
const adj = buildAdjList(6, [[0, 1], [0, 2], [1, 3], [3, 4]]);
assert.deepStrictEqual(bfs(adj, 0), [0, 1, 1, 2, 3, -1]);
assert.deepStrictEqual(bfsLevels(adj, 0), [[0], [1, 2], [3], [4]]);
assert.deepStrictEqual(dfsRecursive(adj, 0), [0, 1, 3, 4, 2]);
assert.deepStrictEqual(dfsIterative(adj, 0), [0, 1, 3, 4, 2]);
assert.strictEqual(countComponents(6, [[0, 1], [0, 2], [1, 3], [3, 4]]), 2);
assert.strictEqual(countComponents(3, []), 3);

const grid = [
  [0, 0, 1],
  [1, 0, 1],
  [0, 0, 0],
];
assert.deepStrictEqual(bfsGrid(grid, 0, 0), [
  [0, 1, -1],
  [-1, 2, -1],
  [4, 3, 4],
]);
assert.deepStrictEqual(multiSourceBfs(grid, [[0, 0], [2, 2]]), [
  [0, 1, -1],
  [-1, 2, -1],
  [2, 1, 0],
]);

assert.deepStrictEqual(floodFill([[1, 1, 0], [1, 0, 0]], 0, 0, 2), [[2, 2, 0], [2, 0, 0]]);
assert.deepStrictEqual(floodFill([[1, 1]], 0, 0, 1), [[1, 1]]); // same colour -> unchanged

console.log('✓ traversals.js self-test passed');
}

module.exports = {
  bfs, bfsLevels, dfsRecursive, dfsIterative, bfsGrid, multiSourceBfs, countComponents, floodFill,
};
