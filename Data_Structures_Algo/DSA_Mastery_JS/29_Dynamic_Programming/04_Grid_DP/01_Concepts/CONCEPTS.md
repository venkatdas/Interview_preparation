# Grid DP

**Grid DP** is dynamic programming where the state is a cell `(row, col)` of a 2D grid and
the moves are restricted (usually **right** and **down**). Think of walking through a city
laid out as a grid: at every corner you can only go east or south. The number of ways to reach
a corner, or the cheapest way to reach it, depends only on the two corners you could have come
from. That "depends only on a couple of neighbours" is exactly what makes a problem DP.

## Prerequisites

- [DP overview](../../01_Concepts/OVERVIEW.md) — the 5-step framework; shared helpers in [dp_framework.js](../../02_Implementations/dp_framework.js).
- [1D DP](../../01_One_Dimensional_DP/README.md) — grid DP is 1D DP with two indices.
- [Matrix and multidimensional arrays](../../../09_Matrix_And_Multidimensional_Arrays/README.md) — grids as a data structure (BFS flood fill, rotations, spiral).
- [Graph Traversal](../../../24_Graph_Traversal/README.md) — for memoized DFS on grids and for recognising when it is really a shortest-path problem.

**Essential vs Advanced:** counting paths, min/max path sums, obstacles, the one-row space trick and "square ending at (i, j)" are **Essential**. Reverse DP (Dungeon Game), memoized DFS over a value-DAG and the two-walker 3D state (Cherry Pickup) are **Advanced**.

---

## Why it matters / when to use

Reach for grid DP when the problem says:

- "Count the number of paths from top-left to bottom-right" (moves: right / down only)
- "Minimum / maximum path sum" through a grid with restricted moves
- "Obstacles": some cells are blocked
- "Triangle", "falling path": each row depends on the previous row only
- "Largest square / count squares of 1s": the answer at `(i, j)` is built from 3 neighbours
- "Minimum initial health to survive": the answer depends on the **future**, so DP runs backwards
- "Two people walking at the same time": one DP with a combined state
- "Longest increasing path in a matrix" with 4-direction moves: memoized DFS over a DAG

Grid DP is one of the most common DP shapes in interviews because it is easy to draw and
easy to check by hand.

---

## How it works

### Unique Paths on a 3x3 grid (moves: right, down)

State: `dp[i][j]` = number of ways to reach cell `(i, j)`.
You can only arrive from above `(i-1, j)` or from the left `(i, j-1)`, so:

```
dp[i][j] = dp[i-1][j] + dp[i][j-1]
base: first row and first column = 1 (only one straight path)

        col0  col1  col2
row0 |   1  |  1  |  1  |
row1 |   1  |  2  |  3  |
row2 |   1  |  3  |  6  |     answer = dp[2][2] = 6
```

Read it like this: `dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2`, then
`dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6`.

### Minimum Path Sum on a 3x3 grid

```
grid               dp (cheapest cost to reach each cell)
1 3 1              1  4  5
1 5 1      ->      2  7  6
4 2 1              6  8  7      answer = 7  (path 1 -> 3 -> 1 -> 1 -> 1)

dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
```

### Obstacles

If a cell is blocked, nobody can stand on it, so `dp[i][j] = 0` (counting) or `Infinity`
(minimising). The first row / column is no longer all 1s: once you hit an obstacle, every
cell after it in that row / column is also unreachable.

```
grid        dp
0 0 0       1 1 1
0 1 0  ->   1 0 1
0 0 0       1 1 2      answer = 2
```

### Path reconstruction

The table tells you the *value*, not the *path*. To get the path, start at the bottom-right
and walk backwards: at each cell pick the neighbour (above or left) whose dp value produced
the current value, then prepend the cell. See `reconstructPath` in `03_Problems/solutions/03_minimum_path_sum.js`.

### Space optimisation: one row is enough

`dp[i][j]` only reads `dp[i-1][j]` (the same column, previous row) and `dp[i][j-1]` (the
cell just written in the current row). So when you process rows top to bottom and columns
left to right, a **single array** works:

```js
row[j] = row[j] + row[j - 1]   // row[j] still holds the previous row's value (above),
                               // row[j-1] already holds the current row's value (left)
```

O(m*n) -> O(n) space. This works for every "right / down" grid problem.

### Reverse DP (Dungeon Game)

Sometimes the value of a cell depends on what happens **after** it, not before. In Dungeon
Game the health you need at a cell depends on the rooms still ahead. Then define
`dp[i][j]` = "minimum health needed when ENTERING `(i, j)` to reach the goal", fill the table
from the bottom-right corner backwards, and the answer sits at `dp[0][0]`.

Rule of thumb: if the answer is "what do I need at the start so that the end works out", go
backwards.

### The "square ending at (i, j)" trick

For Maximal Square / Count Square Submatrices, let `dp[i][j]` = side length of the largest
all-ones square whose **bottom-right** corner is `(i, j)`:

```
dp[i][j] = grid[i][j] === 1 ? 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) : 0
```

A square of side k at `(i, j)` needs squares of side k-1 above, to the left and diagonally.
The minimum of the three is the bottleneck.

### When grid DP is really a DAG shortest path

Right / down moves never let you return to a cell, so the grid is a **DAG** (directed acyclic
graph). Filling the table row by row is just topological order. That is why plain DP works.

With **4-direction** moves you can cycle, so the table has no valid fill order:
- minimum cost with 4 moves -> Dijkstra / 0-1 BFS (see [Graphs](../../../23_Graphs/README.md) and [Graph Algorithms](../../../25_Graph_Algorithms/README.md))
- unless the moves are restricted by **values**: Longest Increasing Path only moves to a
  strictly larger cell, which again gives a DAG, so memoized DFS over cells works.

---

## Pseudocode (Essential)

```
# Best path with moves right / down, one row of memory.
minPathSum(grid):
  row = array of n Infinity
  row[0] = 0                                   # "parent" of the start
  for i in 0..m-1:
    for j in 0..n-1:
      fromTop  = row[j]                         # still holds the value of the row above
      fromLeft = j > 0 ? row[j-1] : Infinity    # already updated in this row
      row[j] = grid[i][j] + min(fromTop, fromLeft)
  return row[n-1]

# Counting paths: same loops, "+" instead of "min", start = 1, obstacle cells = 0.
# Reverse DP (Dungeon): same loops from bottom-right to top-left, reading below / right.
```

---

## Dry run (Essential) - one-row Minimum Path Sum on [[1,3,1],[1,5,1],[4,2,1]]

| i | j | fromTop | fromLeft | grid[i][j] | row after the update |
|---|---|---|---|---|---|
| 0 | 0 | 0 (start) | ∞ | 1 | [1, ∞, ∞] |
| 0 | 1 | ∞ | 1 | 3 | [1, 4, ∞] |
| 0 | 2 | ∞ | 4 | 1 | [1, 4, 5] |
| 1 | 0 | 1 | ∞ | 1 | [2, 4, 5] |
| 1 | 1 | 4 | 2 | 5 | [2, 7, 5] |
| 1 | 2 | 5 | 7 | 1 | [2, 7, 6] |
| 2 | 0 | 2 | ∞ | 4 | [6, 7, 6] |
| 2 | 1 | 7 | 6 | 2 | [6, 8, 6] |
| 2 | 2 | 6 | 8 | 1 | [6, 8, **7**] |

Answer `row[2] = 7` (path 1 → 3 → 1 → 1 → 1).

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| fill m x n table, O(1) transition | O(m*n) | O(m*n) | Unique Paths, Min Path Sum |
| one-row optimisation | O(m*n) | O(n) | only when each row depends on the previous row |
| reconstruct a path | O(m+n) | O(m+n) | walk back from the corner |
| memo DFS over cells | O(m*n) | O(m*n) | each cell computed once; recursion depth up to m*n |
| two walkers (Cherry Pickup) | O(n^3) | O(n^3) or O(n^2) | state (step, row1, row2) |
| brute-force recursion | O(2^(m+n)) | O(m+n) | every path explored, used only for learning |

---

## JavaScript implementation

Every file in `problems/` shows the same ladder: plain recursion -> memo -> table -> one row.
The core table fill looks like this:

```js
function minPathSum(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const fromTop = i > 0 ? dp[i - 1][j] : Infinity;
      const fromLeft = j > 0 ? dp[i][j - 1] : Infinity;
      const best = (i === 0 && j === 0) ? 0 : Math.min(fromTop, fromLeft);
      dp[i][j] = grid[i][j] + best;
    }
  }
  return dp[rows - 1][cols - 1];
}
```

Full code with memo / tabulation / optimised versions and tests: `03_Problems/solutions/03_minimum_path_sum.js`.

---

## Patterns / variations

### 1. Count paths (sum of parents)

```js
dp[i][j] = dp[i - 1][j] + dp[i][j - 1];   // Unique Paths I / II
```
Use when: "how many ways to reach the end". Obstacles set the cell to 0.

### 2. Best path (min / max of parents + cell cost)

```js
dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);   // Min Path Sum
```
Use when: "cheapest / most valuable route". Triangle and Falling Path are the same idea with
different parents (`j-1, j, j+1` of the row above).

### 3. Row-by-row with a window of parents

```js
// Minimum Falling Path Sum: parent is one of three cells above
dp[i][j] = matrix[i][j] + Math.min(dp[i-1][j-1] ?? Infinity, dp[i-1][j], dp[i-1][j+1] ?? Infinity);
```
Use when: each row only depends on the previous row -> keep just one row.

### 4. Square / rectangle ending at a cell

```js
dp[i][j] = cell ? 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) : 0;
```
Use when: "largest square", "count squares". The sum of all `dp[i][j]` counts squares,
the max gives the biggest one.

### 5. Reverse DP

```js
// Dungeon Game: dp[i][j] = min health needed when entering (i, j)
dp[i][j] = Math.max(1, Math.min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]);
```
Use when: the requirement at a cell depends on what comes later. Fill from the goal.

### 6. Memoized DFS over a value-DAG

```js
function longest(i, j) {
  if (memoTable[i][j]) return memoTable[i][j];
  let best = 1;
  for (const [di, dj] of DIRS) {
    if (inBounds(i + di, j + dj) && matrix[i + di][j + dj] > matrix[i][j]) {
      best = Math.max(best, 1 + longest(i + di, j + dj));
    }
  }
  return (memoTable[i][j] = best);
}
```
Use when: 4-direction moves, but the move rule (strictly increasing) forbids cycles.

### 7. Two walkers with a shared clock

In Cherry Pickup both walkers take the same number of steps, so `row + col = step` for each.
State `(step, row1, row2)` -> O(n^3) states instead of O(n^4).

---

## Alternatives (Essential)

| Approach | Time | Space | When |
|---|---|---|---|
| Plain recursion over moves | O(2^(m+n)) | O(m+n) | only to explain the recurrence |
| Memoized DFS | O(m·n) | O(m·n) + recursion stack | moves in all four directions but the graph is acyclic (strictly increasing paths); natural to write |
| Bottom-up table | O(m·n) | O(m·n) | when you need to reconstruct the path |
| One row | O(m·n) | O(n) | default for right/down moves when only the value is needed |
| Combinatorics C(m+n-2, m-1) | O(min(m,n)) | O(1) | Unique Paths without obstacles |
| Dijkstra / 0-1 BFS | O(m·n log(m·n)) | O(m·n) | moves in all four directions with cycles (not a DAG) |

---

## When grid DP does NOT apply (Essential)

- **Moves can go back** (up/left, or all four directions) and cells can be revisited — there is no fill order; use BFS (unit cost) or Dijkstra (weighted) ([Graph Algorithms](../../../25_Graph_Algorithms/README.md)).
- **Connected regions / islands / flood fill** — traversal, not optimisation ([Graph Traversal](../../../24_Graph_Traversal/README.md)).
- **Visit every cell exactly once** (Unique Paths III) — the state would need the set of visited cells; use backtracking ([Backtracking](../../../13_Backtracking/README.md)).
- **The grid is huge but sparse** (10^9 x 10^9 with a few obstacles) — use combinatorics with inclusion-exclusion over obstacles.

---

## Common mistakes & edge cases

- Starting cell is an obstacle -> answer is 0 immediately. Same for the goal cell.
- Forgetting that an obstacle in the first row blocks everything to its right (do not fill
  the first row with 1s blindly).
- Using `0` as the "impossible" marker in a min problem. Use `Infinity`.
- Dungeon Game: health must stay >= 1 at every cell, so clamp with `Math.max(1, ...)`,
  and the goal cell needs `max(1, 1 - dungeon[goal])`, not 0.
- One-row optimisation with a `j-1` AND `j+1` dependency (Falling Path): you need the
  previous row intact, so copy the row or use two rows. One row in place only works when
  parents are "above" and "left".
- Memo DFS: recursion depth can reach m*n (a snake-shaped increasing path). Node's default
  stack handles a few thousand frames; for huge grids use the sorted-cells tabulation.
- 1x1 grid, single row, single column: make sure your loops and base cases do not index
  `-1`.

---

## Interview tips

- Draw the grid and the dp table side by side, fill 2-3 cells by hand, and say the
  recurrence out loud before coding. Interviewers love this because it is verifiable.
- Say the three ingredients explicitly: "State is dp[i][j] = ..., it comes from (i-1, j) and
  (i, j-1), base case is the first row and column."
- Mention the one-row optimisation as a follow-up: "This is O(m*n) space, but since each row
  only depends on the previous one I can bring it down to O(n)."
- If moves are 4-directional, say "this is now a graph, not a DAG" and switch to BFS /
  Dijkstra, unless the move rule makes it acyclic.
- For "minimum initial X" questions, propose reverse DP and explain why forward DP fails
  (the best forward path can leave you unable to survive later).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Unique Paths | Medium | count paths | [01_unique_paths.js](../03_Problems/solutions/01_unique_paths.js) |
| 02 | Unique Paths II | Medium | count paths + obstacles | [02_unique_paths_ii.js](../03_Problems/solutions/02_unique_paths_ii.js) |
| 03 | Minimum Path Sum | Medium | best path + reconstruction | [03_minimum_path_sum.js](../03_Problems/solutions/03_minimum_path_sum.js) |
| 04 | Triangle | Medium | row-by-row, bottom-up | [04_triangle.js](../03_Problems/solutions/04_triangle.js) |
| 05 | Minimum Falling Path Sum | Medium | row-by-row, 3 parents | [05_minimum_falling_path_sum.js](../03_Problems/solutions/05_minimum_falling_path_sum.js) |
| 06 | Count Square Submatrices with All Ones | Medium | square ending at (i, j) | [06_count_square_submatrices.js](../03_Problems/solutions/06_count_square_submatrices.js) |
| 07 | Maximal Square | Medium | square ending at (i, j) | [07_maximal_square.js](../03_Problems/solutions/07_maximal_square.js) |
| 08 | Longest Increasing Path in a Matrix | Hard | memo DFS over a value-DAG | [08_longest_increasing_path_in_matrix.js](../03_Problems/solutions/08_longest_increasing_path_in_matrix.js) |
| 09 | Dungeon Game | Hard | reverse DP | [09_dungeon_game.js](../03_Problems/solutions/09_dungeon_game.js) |
| 10 | Cherry Pickup | Hard | two walkers, 3D state | [10_cherry_pickup.js](../03_Problems/solutions/10_cherry_pickup.js) |

---

## Practice more

Easy / Medium: Pascal's Triangle (118), Unique Paths III (980, backtracking), Minimum Path Cost
in a Grid (2304), Number of Ways to Reach a Position (bonus), Out of Boundary Paths (576),
Knight Probability in Chessboard (688), Minimum Cost to Make at Least One Valid Path (1368, 0-1 BFS),
Paths in Matrix Whose Sum Is Divisible by K (2435), Maximum Number of Points with Cost (1937)

Hard: Cherry Pickup II (1463), Maximal Rectangle (85), Number of Paths with Max Score (1301),
Minimum Falling Path Sum II (1289), Count All Possible Routes (1575)
