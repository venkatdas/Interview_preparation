# Matrix & Multidimensional Arrays — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. How do you safely create an m × n grid in JavaScript?

<details><summary>Model answer</summary>

`Array.from({ length: m }, () => new Array(n).fill(0))`. The callback creates a new row for each index. `new Array(m).fill(new Array(n).fill(0))` puts one shared row in every slot, so writing to one row changes all of them.

</details>

### 2. How do you rotate a square matrix 90° clockwise in place?

<details><summary>Model answer</summary>

Transpose (swap `m[i][j]` with `m[j][i]` for `j > i`), then reverse each row. O(n²) time, O(1) extra space. Counter-clockwise: transpose then reverse each column (or reverse rows first, then transpose). Alternatively rotate four cells at a time layer by layer.

</details>

### 3. How does spiral traversal avoid duplicates on non-square matrices?

<details><summary>Model answer</summary>

Keep four boundaries (`top`, `bottom`, `left`, `right`). After reading the top row and right column, re-check `top <= bottom` before reading the bottom row and `left <= right` before reading the left column. Without those guards, a single remaining row or column is read twice.

</details>

### 4. What is a directions array and why use it?

<details><summary>Model answer</summary>

A list of `[dr, dc]` offsets such as `[[-1,0],[1,0],[0,-1],[0,1]]` (4-neighbourhood) or with diagonals (8-neighbourhood). Looping over it replaces four copy-pasted blocks, keeps bounds checks in one place, and makes switching between 4- and 8-connectivity trivial.

</details>

### 5. Set Matrix Zeroes in O(1) extra space: how?

<details><summary>Model answer</summary>

Use the first row and first column as marker storage: if `m[i][j] = 0`, set `m[i][0] = 0` and `m[0][j] = 0`. Track separately whether row 0 or column 0 originally had a zero (they share `m[0][0]`). Zero inner cells based on the markers, then handle row 0 and column 0 last so the markers are not destroyed early.

</details>

### 6. How do you search a matrix whose rows and columns are both sorted?

<details><summary>Model answer</summary>

Start at the top-right corner (or bottom-left). If the value is too big, move left; if too small, move down. Each step eliminates a row or a column: O(m + n). If the matrix is fully sorted row after row, treat it as one array of length m·n and binary search with `row = mid / n | 0`, `col = mid % n`: O(log(m·n)).

</details>

### 7. How is a grid a graph, and what algorithms apply?

<details><summary>Model answer</summary>

Each cell is a node, edges connect neighbouring cells (4 or 8 directions) that satisfy a rule. Flood fill / connected components use DFS or BFS (Number of Islands). Shortest paths in unweighted grids use BFS; multi-source BFS starts from all sources at once (Rotting Oranges). Weighted grids use Dijkstra.

</details>

### 8. Why might recursive DFS fail on a large grid, and what is the fix?

<details><summary>Model answer</summary>

A 1000 × 1000 grid of land can recurse a million levels deep, far beyond Node's default stack (around 10k frames). Use an explicit stack array or BFS with a queue, or mark visited cells before pushing so each cell is processed once.

</details>

### 9. Game of Life in place: how do you keep the old state while writing the new one?

<details><summary>Model answer</summary>

Encode both states in one cell, for example use bit 0 for the current state and bit 1 for the next state, or special values like 2 = "alive → dead" and 3 = "dead → alive". Count neighbours using only the old bit, then do a second pass to shift to the new state.

</details>

### 10. How do you index a 2D grid as a 1D array, and why would you?

<details><summary>Model answer</summary>

`id = r * cols + c`, and back with `r = Math.floor(id / cols)`, `c = id % cols`. Useful for binary search over a sorted matrix, for `Set` keys of visited cells (a number is cheaper than a string `"r,c"`), and for Union-Find over cells.

</details>

### 11. What is the complexity of BFS/DFS on an m × n grid?

<details><summary>Model answer</summary>

O(m·n) time (each cell visited once, each checks a constant number of neighbours) and O(m·n) space in the worst case for the visited set and the queue or stack.

</details>
