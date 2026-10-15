# Matrix & Multidimensional Arrays — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Predict the output

```js
const g = new Array(2).fill(new Array(2).fill(0));
g[0][0] = 1;
console.log(JSON.stringify(g));
```

<details><summary>Answer</summary>

`[[1,0],[1,0]]`. Both rows are the same array.

</details>

### Q2. Multiple choice — rotate 90° clockwise in place is

A) reverse rows, then reverse each row  B) transpose, then reverse each row  C) transpose twice  D) reverse each column only

<details><summary>Answer</summary>

**B.**

</details>

### Q3. Predict the output

Spiral order of `[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]`?

<details><summary>Answer</summary>

`1 2 3 4 8 12 11 10 9 5 6 7`.

</details>

### Q4. Spot the bug (transpose in place)

```js
for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
```

<details><summary>Answer</summary>

Every pair is swapped twice, so the matrix ends unchanged. Start `j` at `i + 1`.

</details>

### Q5. Complexity — staircase search in a 1000 × 1000 matrix sorted by rows and columns

<details><summary>Answer</summary>

O(m + n) = at most about 2000 steps. O(1) space.

</details>

### Q6. Multiple choice — which corner can you start a staircase search from?

A) top-left  B) top-right  C) bottom-right  D) any corner

<details><summary>Answer</summary>

**B** (or bottom-left). From top-left both moves increase the value, so you cannot eliminate anything.

</details>

### Q7. Spot the bug (number of islands)

```js
function dfs(r, c) {
  if (grid[r][c] !== '1') return;
  grid[r][c] = '0';
  dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
}
```

<details><summary>Answer</summary>

No bounds check: `grid[-1]` is `undefined`, so `grid[-1][c]` throws. Check `r >= 0 && r < rows && c >= 0 && c < cols` first.

</details>

### Q8. Predict the output

```js
const cols = 4;
const id = 2 * cols + 3;
console.log(id, Math.floor(id / cols), id % cols);
```

<details><summary>Answer</summary>

`11 2 3`.

</details>

### Q9. Complexity — Set Matrix Zeroes with row and column marker sets

<details><summary>Answer</summary>

O(m·n) time, O(m + n) space. The first-row/first-column trick reduces space to O(1).

</details>

### Q10. Multiple choice — shortest path from a cell to the nearest exit in an unweighted grid uses

A) DFS  B) BFS  C) binary search  D) prefix sums

<details><summary>Answer</summary>

**B.**

</details>

### Q11. Spot the bug (game of life)

```js
for (let r...) for (let c...) {
  const live = countLiveNeighbours(board, r, c);
  board[r][c] = live === 3 || (board[r][c] === 1 && live === 2) ? 1 : 0;
}
```

<details><summary>Answer</summary>

Cells are overwritten while neighbours still need their old values. Encode old and new states (for example 2 and 3) or use a copy, then finalize in a second pass.

</details>

### Q12. Multiple choice — Valid Sudoku box index for cell (r, c) is

A) `r * 3 + c`  B) `Math.floor(r / 3) * 3 + Math.floor(c / 3)`  C) `(r + c) % 9`  D) `r % 3 + c % 3`

<details><summary>Answer</summary>

**B.**

</details>

## Mastery checklist

- [ ] I create grids without the shared-row trap and can convert between (r, c) and a flat index.
- [ ] I can write transpose, rotate, spiral and diagonal traversal from memory.
- [ ] I can explain in-place marking tricks (Set Matrix Zeroes, Game of Life).
- [ ] I can solve Number of Islands with DFS and BFS and explain the stack-depth risk.
- [ ] I scored at least 10/12 on this quiz.
