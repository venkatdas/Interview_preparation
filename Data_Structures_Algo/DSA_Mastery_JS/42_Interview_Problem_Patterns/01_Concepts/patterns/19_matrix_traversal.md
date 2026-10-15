# 19. Matrix Traversal

A matrix (grid) problem is either about **moving through cells** (spiral, diagonals, rotate,
search a sorted matrix) or about the grid as a **graph** where each cell connects to its 4 (or 8)
neighbors (islands, flood fill, shortest path). For the first kind you need clean index
arithmetic and boundaries; for the second you need BFS/DFS with a `visited` grid and a
`DIRECTIONS` array.

**Teaches in depth:** [Matrix & Multidimensional Arrays](../../../09_Matrix_And_Multidimensional_Arrays/README.md), [Graph Traversal](../../../24_Graph_Traversal/README.md), [Grid DP](../../../29_Dynamic_Programming/04_Grid_DP/README.md)

---

## 1. Recognition clues

| Words in the problem | Approach |
|---|---|
| "spiral order", "layer by layer" | four shrinking boundaries |
| "rotate 90 degrees in place" | transpose + reverse rows |
| "diagonal", "anti-diagonal" | `r - c` or `r + c` is constant |
| "rows and columns sorted, find target" | staircase search from top-right |
| "islands", "regions", "flood fill", "enclaves" | DFS/BFS on 4-neighbors |
| "shortest path in a grid", "minimum steps" | BFS |
| "nearest 0 / gate / rotten orange for every cell" | multi-source BFS |
| "set zeroes / game of life in place" | encode extra state in the cells or first row/column |
| "number of paths moving right/down" | grid DP ([17](17_dynamic_programming_families.md)) |

**Constraint hints**

- R, C up to 300 -> 9 * 10^4 cells; O(R*C) traversal is expected, O((R*C)^2) is not.
- "In place" -> O(1) extra space: reuse the matrix itself for markers.

## 2. When it applies (preconditions)

- Data is laid out in rows and columns, and adjacency is by position.
- You can index `grid[r][c]` in O(1) and test bounds cheaply.

## 3. When it does NOT apply

- **Grid BFS for weighted moves.** If entering a cell costs its value (Minimum Path Sum with any moves, Swim in Rising Water), plain BFS is wrong: a path with fewer steps can cost more. Use Dijkstra or DP.
  *Counterexample:* `[[1, 9], [1, 1]]` from top-left to bottom-right: BFS sees two 2-step paths and may take the one through 9 (cost 1+9+1 = 11), while the cheapest is 1+1+1 = 3.
- **Right/down only movement.** If moves are restricted to right/down, the grid is a DAG; DP is simpler and O(R*C) without a queue.
- **Sparse huge grids** (10^9 x 10^9 with a few obstacles): you cannot allocate a visited grid; use a `Set` of `"r,c"` keys and bounded search.

## 4. The template

```js
const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// DFS flood fill: count islands of 1s
function countIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== 1 || seen[r][c]) return;
    seen[r][c] = true;
    for (const [dr, dc] of DIRECTIONS) dfs(r + dr, c + dc);
  }
  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !seen[r][c]) { islands++; dfs(r, c); }
    }
  }
  return islands;
}

// Spiral order with four shrinking boundaries
function spiralOrder(matrix) {
  const out = [];
  if (!matrix.length || !matrix[0].length) return out;
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(matrix[r][right]);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) out.push(matrix[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) out.push(matrix[r][left]); left++; }
  }
  return out;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`countIslands`, `bfsGrid`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`spiralOrder`, `rotateClockwise`) and [tests/patterns.test.js](../../tests/patterns.test.js) (spiral and rotation checked against simple reference implementations on random matrices).

**Dry run** `spiralOrder([[1, 2, 3], [4, 5, 6]])`:

| step | boundaries (t, b, l, r) | pushed |
|---|---|---|
| top row | 0, 1, 0, 2 | 1 2 3 |
| right column | 1, 1, 0, 2 | 6 |
| bottom row | 1, 1, 0, 1 | 5 4 |
| left column | top 1 > bottom 0 | — |

Result `[1, 2, 3, 6, 5, 4]`.

## 5. Variations

- **Rotate in place:** transpose (`swap m[i][j], m[j][i]` for `j > i`), then reverse each row. Counter-clockwise: reverse rows first or transpose + reverse columns.
- **8 directions:** add the 4 diagonals to `DIRECTIONS` (Shortest Path in Binary Matrix).
- **Border-connected regions:** start DFS/BFS from the border (Surrounded Regions, Number of Enclaves, Pacific Atlantic).
- **Staircase search:** start top-right; go left if too big, down if too small: O(R + C).
- **In-place state encoding:** Game of Life uses 2 = "alive -> dead", 3 = "dead -> alive".
- **Flatten an index:** `id = r * cols + c` for union-find or visited arrays.

## 6. Common pitfalls

1. `new Array(rows).fill(new Array(cols).fill(false))` — every row is the **same** array. Use `Array.from`.
2. Mixing up `rows`/`cols` (`grid.length` vs `grid[0].length`) on non-square grids.
3. `grid[0].length` on an empty grid throws. Guard `if (!grid.length) return ...`.
4. Recursive DFS on a 1000 x 1000 grid of land is 10^6 deep: stack overflow in JS. Use BFS or an explicit stack.
5. Spiral: forgetting the `top <= bottom` / `left <= right` checks before the last two sides duplicates elements on single rows/columns.
6. Mutating the input grid to mark visited without asking the interviewer.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Flood Fill | Easy | DFS from one cell | [statement](../../../24_Graph_Traversal/03_Problems/01_Easy/01_flood_fill.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/01_flood_fill.js) |
| 2 | Island Perimeter | Easy | count edges to water | [statement](../../../24_Graph_Traversal/03_Problems/01_Easy/02_island_perimeter.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/02_island_perimeter.js) |
| 3 | Rotate Image | Medium | transpose + reverse | [statement](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/06_rotate_image.md) · [solution](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/solutions/06_rotate_image.js) |
| 4 | Spiral Matrix | Medium | four boundaries | [statement](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/07_spiral_matrix.md) · [solution](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/solutions/07_spiral_matrix.js) |
| 5 | Set Matrix Zeroes | Medium | first row/col as markers | [statement](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/09_set_matrix_zeroes.md) · [solution](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/solutions/09_set_matrix_zeroes.js) |
| 6 | Search a 2D Matrix II | Medium | staircase | [statement](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/10_search_2d_matrix_ii.md) · [solution](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/solutions/10_search_2d_matrix_ii.js) |
| 7 | Game of Life | Medium | in-place encoding | [statement](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/13_game_of_life.md) · [solution](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/solutions/13_game_of_life.js) |
| 8 | Number of Islands | Medium | DFS components | [statement](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/14_number_of_islands.md) · [solution](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/solutions/14_number_of_islands.js) |
| 9 | Surrounded Regions | Medium | border DFS | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/13_surrounded_regions.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/13_surrounded_regions.js) |
| 10 | 01 Matrix | Medium | multi-source BFS | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/12_01_matrix.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/12_01_matrix.js) |

## 8. Self-check

**Q1.** How do you rotate a square matrix 90 degrees clockwise in place?

<details><summary>Answer</summary>

Transpose it (swap `m[i][j]` with `m[j][i]` for `j > i`), then reverse every row. O(n^2) time, O(1) extra space.

</details>

**Q2.** Which value is constant along a "/" anti-diagonal?

<details><summary>Answer</summary>

`r + c`. Along a "\" diagonal, `r - c` is constant. These are also the keys used for N-Queens diagonal checks.

</details>

**Q3.** Why is the staircase search in a row- and column-sorted matrix O(R + C)?

<details><summary>Answer</summary>

From the top-right corner, each comparison eliminates a whole row (move down) or a whole column (move left). You can move down at most R times and left at most C times.

</details>

---

Previous: [18. Bit Manipulation](18_bit_manipulation.md) · Next: [20. Subarray vs Subsequence](20_subarray_vs_subsequence.md) · [Pattern index](../../README.md)
