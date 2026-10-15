# Matrix / Grid

A **matrix** (or **grid**) is a 2D table of values: `rows` x `cols` cells, addressed as
`grid[row][col]`. Think of a spreadsheet, a chessboard, pixels on a screen, or a map of
islands. In JavaScript a matrix is simply an **array of arrays**. Most grid problems are
really one of three things in disguise: careful index bookkeeping (rotate, spiral), a graph
walk over neighbouring cells (islands, word search), or a search exploiting sorted order.

---

## Prerequisites

- [Arrays](../../03_Arrays/README.md): a matrix is an array of row arrays.
- [JavaScript For DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md): the `Array.from` vs `fill` shared-row trap.
- Helpful later: [Graph Traversal](../../24_Graph_Traversal/README.md) for BFS/DFS on grids.

---

## Why it matters / when to use

Reach for grid techniques when the problem has any of these signals:

- Input is `m x n`, "board", "grid", "image", "matrix", "2D array"
- "Rotate", "transpose", "spiral", "diagonal", "zigzag" → index manipulation
- "Islands", "regions", "connected", "flood fill", "shortest path in a maze" → grid as a graph
  (BFS/DFS, see `23_Graphs/`)
- "Sorted rows and columns", "k-th smallest in matrix" → binary search / staircase search
- "In place", "O(1) extra space" → use the matrix itself as storage (flags, sign bits, extra states)
- "Sum of a sub-rectangle" many times → 2D prefix sums (see `08_Prefix_Sums_And_Difference_Arrays/`)

---

## How it works

### 2D arrays in JavaScript (and the shared-row trap)

```js
// WRONG: fill([]) puts the SAME array object in every row
const bad = new Array(3).fill([]);
bad[0].push(1);          // bad is now [[1],[1],[1]]  -- all three rows are one array!

// RIGHT: build each row separately
const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
// or
const grid2 = [];
for (let r = 0; r < rows; r++) grid2.push(new Array(cols).fill(0));
```

`fill(value)` copies the *reference* for objects/arrays. `Array.from` with a callback runs the
callback once per row, so each row is a fresh array. Same trap when copying: `grid.slice()`
is a shallow copy (rows shared); use `grid.map((row) => row.slice())` for a true 2D copy.

### Row / column iteration

```js
const rows = grid.length;
const cols = grid[0].length;          // guard: rows > 0 first
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    // grid[r][c]
  }
}
```
Row-major (outer loop rows) is the natural order. For column-major, swap the loops. For
"each column" operations (Sudoku, Set Zeroes) you will need both.

### Directions array + bounds helper

```js
const DIRS4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];                       // up, down, left, right
const DIRS8 = [...DIRS4, [-1, -1], [-1, 1], [1, -1], [1, 1]];            // plus diagonals

function inBounds(r, c, rows, cols) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

for (const [dr, dc] of DIRS4) {
  const nr = r + dr, nc = c + dc;
  if (!inBounds(nr, nc, rows, cols)) continue;
  // visit grid[nr][nc]
}
```
Writing four `if`s by hand is the classic source of typos. Always use the array.

### In-place marking tricks

- **First row / column as flags** (Set Matrix Zeroes): instead of an extra `rowHasZero[]`,
  store the flag in `grid[r][0]` and `grid[0][c]`; keep one extra boolean for column 0.
- **Sign flipping** (Find All Duplicates style, or marking visited): negate `grid[r][c]` to
  say "visited" when values are positive; `Math.abs` to read the real value.
- **Extra states** (Game of Life): encode "was alive, now dead" as 2 and "was dead, now
  alive" as 3, then normalise in a second pass. Works whenever old and new state both fit
  in the cell.
- **Sentinel character** (Word Search): overwrite `board[r][c] = '#'` while exploring, restore
  after backtracking.

### Rotation and transpose

```
transpose: grid[r][c] <-> grid[c][r]     (flip over the main diagonal)
rotate 90 clockwise     = transpose, then reverse each row
rotate 90 anticlockwise = transpose, then reverse each column (or reverse rows, then transpose)
rotate 180              = reverse rows, reverse each row
```
Transposing in place needs a square matrix and `c > r` in the loop (otherwise you swap twice).

### Spiral traversal with shrinking bounds

Keep four walls `top, bottom, left, right`. Walk top row left->right, right column top->bottom,
bottom row right->left, left column bottom->top; shrink the wall you just walked. Check
`top <= bottom` / `left <= right` before the bottom and left walks to avoid double counting
on the last row / column.

```
top=0 ->  1  2  3        after top row: top=1
          4  5  6        right col: 6 9, right=1
bottom=2  7  8  9        bottom row: 8 7, bottom=1 ; left col: 4, left=1 ; middle: 5
```

### Diagonal traversal

Cells on the same anti-diagonal share `r + c`. Loop `d = 0 .. rows + cols - 2`, collect cells
with `r + c === d`, and alternate direction for the zigzag. Cells on the same main diagonal
share `r - c`.

### Grid as an implicit graph

Each cell is a node; neighbours are the 4 (or 8) adjacent cells. You never build an adjacency
list - `DIRS4` plus `inBounds` *is* the adjacency function. BFS gives shortest paths in
unweighted grids; DFS / flood fill counts components (islands). Mark visited in place when
allowed, otherwise use a `Set` of `r * cols + c` keys.

### Binary search in a sorted matrix

- **Fully sorted** (row i ends before row i+1 starts): treat as a 1D array of length
  `rows * cols`, index `k` maps to `grid[Math.floor(k / cols)][k % cols]`. One binary search.
- **Rows and columns sorted** (Search a 2D Matrix II): start at the **top-right** corner. If
  the value is too big move left, if too small move down. O(rows + cols) "staircase" search.
- **k-th smallest**: binary search on the *value* range; count how many cells are <= mid with
  a staircase walk in O(rows + cols).

### 2D prefix sums (link)

`P[r+1][c+1] = grid[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]`, then any rectangle sum is four
lookups. Covered in `08_Prefix_Sums_And_Difference_Arrays/`.

---

## Pseudocode

```
SAFE CREATION                         GRID DFS (flood fill)
grid <- Array.from(rows, () =>        dfs(r, c):
          new Array(cols).fill(0))        if out of bounds or grid[r][c] is not land: return
                                          mark grid[r][c] visited
ROTATE 90° CLOCKWISE (square, in place)    for (dr, dc) in DIRS4: dfs(r + dr, c + dc)
transpose: for i, for j > i: swap m[i][j], m[j][i]
reverse each row

SPIRAL ORDER
top, bottom, left, right <- 0, rows-1, 0, cols-1
while top <= bottom and left <= right:
    read top row left->right;      top += 1
    read right column top->bottom; right -= 1
    if top <= bottom: read bottom row right->left; bottom -= 1
    if left <= right: read left column bottom->top; left += 1
```

---

## Dry run on a concrete example

Spiral order of the 3 × 3 matrix `[[1,2,3],[4,5,6],[7,8,9]]`:

| pass | read | top | bottom | left | right | output so far |
|---|---|---|---|---|---|---|
| top row | 1 2 3 | 1 | 2 | 0 | 2 | 1 2 3 |
| right col | 6 9 | 1 | 2 | 0 | 1 | 1 2 3 6 9 |
| bottom row | 8 7 | 1 | 1 | 0 | 1 | 1 2 3 6 9 8 7 |
| left col | 4 | 1 | 1 | 1 | 1 | 1 2 3 6 9 8 7 4 |
| top row | 5 | 2 | 1 | 1 | 1 | 1 2 3 6 9 8 7 4 5 |

The loop stops because `top > bottom`. The two `if` checks matter for non-square inputs such as a single row.

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| visit every cell | O(m n) | O(1) | the floor for almost everything |
| transpose / rotate in place | O(n^2) | O(1) | square only for in place |
| spiral / diagonal traversal | O(m n) | O(m n) output | |
| flood fill / BFS / DFS | O(m n) | O(m n) worst case (stack/queue) | each cell visited once |
| staircase search (sorted rows+cols) | O(m + n) | O(1) | top-right start |
| binary search fully sorted matrix | O(log(m n)) | O(1) | |
| k-th smallest (value binary search) | O((m + n) log(range)) | O(1) | |
| 2D prefix sum build / query | O(m n) / O(1) | O(m n) | |

---

## JavaScript implementation

Full code with tests: `02_Implementations/matrix_utils.js`. A taste:

```js
function create(rows, cols, fill = 0) {
  return Array.from({ length: rows }, () => new Array(cols).fill(fill));
}

function transpose(grid) {
  const rows = grid.length, cols = grid[0].length;
  const result = create(cols, rows);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) result[c][r] = grid[r][c];
  return result;
}

function rotate90(grid) {                 // clockwise, returns a new matrix
  return transpose(grid).map((row) => row.reverse());
}

function neighbors4(r, c, rows, cols) {
  return DIRS4.map(([dr, dc]) => [r + dr, c + dc])
              .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols);
}
```

---

## Patterns / variations

### 1. Index gymnastics (rotate, transpose, spiral, diagonal)

No algorithmic idea, just discipline. Write the loop bounds down, dry-run a 3x3, and watch
for the last row/column in spirals.

### 2. In-place marking

```js
// Game of Life encoding: bit0 = current state, bit1 = next state
grid[r][c] |= 2;             // mark "will be alive"
const alive = grid[r][c] & 1; // read the ORIGINAL state during the pass
grid[r][c] >>= 1;            // second pass: shift next state into place
```
Use when: "do it in place", "O(1) extra space".

### 3. Flood fill (DFS)

```js
function fill(grid, r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
  if (grid[r][c] !== '1') return;
  grid[r][c] = '0';                      // sink it so we never revisit
  for (const [dr, dc] of DIRS4) fill(grid, r + dr, c + dc);
}
```
Use when: islands, regions, "surrounded", "max area", "number of enclaves". For 10^6 cells
prefer an explicit stack to avoid recursion depth limits.

### 4. BFS for shortest path / multi-source

Push all sources first (rotting oranges, 01 matrix), then expand level by level. See `23_Graphs/`.

### 5. Backtracking on a grid

```js
function dfs(r, c, index) {
  if (index === word.length) return true;
  if (out of bounds || board[r][c] !== word[index]) return false;
  const saved = board[r][c];
  board[r][c] = '#';                     // mark
  const found = DIRS4.some(([dr, dc]) => dfs(r + dr, c + dc, index + 1));
  board[r][c] = saved;                   // unmark
  return found;
}
```
Use when: Word Search, N-Queens, Sudoku solver.

### 6. Staircase search / binary search on value

Covered above. Use when rows and columns are sorted.

### 7. Row / column / box bookkeeping (Sudoku)

Keep `rows[9]`, `cols[9]`, `boxes[9]` as Sets; box index is `Math.floor(r / 3) * 3 + Math.floor(c / 3)`.

---

## Alternatives and trade-offs

| Task | Straightforward | In place / optimised | Trade-off |
|---|---|---|---|
| Rotate image | copy into a new matrix O(n^2) space | transpose + reverse, O(1) space | in place needs a square matrix |
| Set matrix zeroes | row/column sets O(m + n) space | first row/column as markers O(1) | markers need a separate flag for row 0 or column 0 |
| Search sorted rows/cols | scan O(m·n) | staircase O(m + n); binary search O(log(m·n)) if fully sorted | pick based on how the matrix is sorted |
| Count islands | DFS recursion | BFS queue or iterative stack; Union-Find | recursion may overflow the call stack on 10^6 cells |

---

## Common mistakes & edge cases

- `new Array(n).fill([])` or `fill(new Array(m))` - every row is the same array.
- `grid[0].length` on an empty grid throws. Check `grid.length === 0` first.
- Mixing up `r`/`c` with `x`/`y`: `x` is usually the column. Stick to `r, c`.
- Rotating in place with a loop that swaps every pair twice (use `c > r`, or `c >= r` for
  transpose with the diagonal untouched).
- Spiral: forgetting `if (top <= bottom)` / `if (left <= right)` before the last two walks
  (duplicates cells on 1xN or Nx1 matrices).
- Visiting a cell twice in DFS because you mark it *after* pushing its neighbours. Mark on
  entry (or on push for BFS).
- Reading a neighbour that you have already modified in an in-place pass (Game of Life, Set
  Zeroes) - encode the old state so it is still readable.
- Non-rectangular ("jagged") arrays: assume rectangular unless told otherwise, and say so.

---

## When this does NOT apply

- **Sparse matrices** (mostly zeros, huge size): a full 2D array wastes memory. Store only non-zero cells in a `Map` keyed by `r * cols + c`.
- **Jagged arrays** (rows of different length): formulas that assume `cols = grid[0].length` break.
- **Recursion on big grids**: Node's default stack overflows around 10^4 frames; switch to an explicit stack or BFS.
- **Staircase search** needs both rows and columns sorted; binary search on the flattened index needs each row to start after the previous row ends.

---

## Interview tips

- Define `rows`, `cols`, `DIRS4`, and `inBounds` first, every time. It buys thinking time and
  prevents bugs.
- Say "I'll treat the grid as a graph where each cell is a node and neighbours are edges" for
  any connectivity problem; interviewers immediately know you will BFS/DFS.
- For in-place problems, name the encoding before you code: "2 means was-alive-now-dead".
- Dry-run on a 3x3 (or 2x3 to catch non-square bugs) out loud.
- Complexity is almost always O(m n); say it, then say what extra space you use and why.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Transpose Matrix | Easy | index swap | 03_Problems/solutions/01_transpose_matrix.js |
| 02 | Matrix Diagonal Sum | Easy | diagonal indices | 03_Problems/solutions/02_matrix_diagonal_sum.js |
| 03 | Toeplitz Matrix | Easy | compare with up-left neighbour | 03_Problems/solutions/03_toeplitz_matrix.js |
| 04 | Reshape the Matrix | Easy | 1D index <-> 2D index | 03_Problems/solutions/04_reshape_the_matrix.js |
| 05 | Pascal's Triangle | Easy | build row from previous | 03_Problems/solutions/05_pascals_triangle.js |
| 06 | Rotate Image | Medium | transpose + reverse (in place) | 03_Problems/solutions/06_rotate_image.js |
| 07 | Spiral Matrix | Medium | shrinking bounds | 03_Problems/solutions/07_spiral_matrix.js |
| 08 | Spiral Matrix II | Medium | shrinking bounds (fill) | 03_Problems/solutions/08_spiral_matrix_ii.js |
| 09 | Set Matrix Zeroes | Medium | first row/col as flags | 03_Problems/solutions/09_set_matrix_zeroes.js |
| 10 | Search a 2D Matrix II | Medium | staircase search | 03_Problems/solutions/10_search_2d_matrix_ii.js |
| 11 | Diagonal Traverse | Medium | r + c diagonals, alternate | 03_Problems/solutions/11_diagonal_traverse.js |
| 12 | Valid Sudoku | Medium | row/col/box sets | 03_Problems/solutions/12_valid_sudoku.js |
| 13 | Game of Life | Medium | in-place extra states | 03_Problems/solutions/13_game_of_life.js |
| 14 | Number of Islands | Medium | grid DFS / flood fill | 03_Problems/solutions/14_number_of_islands.js |
| 15 | Word Search | Medium | grid backtracking | 03_Problems/solutions/15_word_search.js |
| 16 | Kth Smallest Element in a Sorted Matrix | Medium | binary search on value | 03_Problems/solutions/16_kth_smallest_in_sorted_matrix.js |

---

## Practice more

Easy: Flood Fill (733), Island Perimeter (463), Richest Customer Wealth (1672),
Lucky Numbers in a Matrix (1380), Check if Matrix Is X-Matrix (2319), Image Smoother (661)

Medium: Search a 2D Matrix (74), Rotting Oranges (994), 01 Matrix (542), Max Area of Island (695),
Surrounded Regions (130), Pacific Atlantic Water Flow (417), Minimum Path Sum (64),
Unique Paths (62), Range Sum Query 2D - Immutable (304), Spiral Matrix III (885),
Rotate Function / Rotate Image variants, Sort the Matrix Diagonally (1329), Shift 2D Grid (1260),
Count Negative Numbers in a Sorted Matrix (1351), Max Points on a Line (149)

Hard: Sudoku Solver (37), N-Queens (51), Shortest Path in a Grid with Obstacles Elimination (1293),
Trapping Rain Water II (407), Making A Large Island (827), Maximal Rectangle (85)
