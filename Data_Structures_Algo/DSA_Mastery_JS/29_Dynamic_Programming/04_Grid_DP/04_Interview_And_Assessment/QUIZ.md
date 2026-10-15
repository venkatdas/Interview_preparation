# Grid DP — Quiz

Try each on paper first, then open the answer. Back to the [sub-topic README](../README.md).

**1. (Compute) Unique Paths for a 3 x 3 grid?**

<details><summary>Answer</summary>

**6** = C(4, 2).
</details>

**2. (Define the state) Minimum Falling Path Sum: what is `dp[i][j]` and which cells are its parents?**

<details><summary>Answer</summary>

The minimum sum of a falling path ending at `(i, j)`. Parents: `(i-1, j-1)`, `(i-1, j)`, `(i-1, j+1)` (the ones inside the grid).
</details>

**3. (Spot the bug) Unique Paths II**

```js
for (let j = 0; j < n; j++) dp[0][j] = 1;
for (let i = 0; i < m; i++) dp[i][0] = 1;
```

<details><summary>Answer</summary>

It ignores obstacles in the first row/column. Once an obstacle appears, every later cell in that row/column must be 0. Also the start itself may be blocked.
</details>

**4. (Compute) Minimum Path Sum of `[[1,2,3],[4,5,6]]`?**

<details><summary>Answer</summary>

**12**: 1 → 2 → 3 → 6.
</details>

**5. (Multiple choice) For "largest square of 1s ending at (i, j)", combine neighbours with:**
a) sum  b) max  c) min  d) product

<details><summary>Answer</summary>

c) `1 + min(top, left, top-left)`.
</details>

**6. (Predict) Maximal Square returns what for `[["1","1"],["1","1"]]`?**

<details><summary>Answer</summary>

**4** — the area, not the side length 2.
</details>

**7. (Spot the bug) Dungeon Game: `dp[i][j] = min(below, right) - dungeon[i][j]`.**

<details><summary>Answer</summary>

Missing `max(1, ...)`. A potion could make the requirement 0 or negative, but the knight must always have at least 1 HP.
</details>

**8. (Complexity) Cherry Pickup with two simultaneous walkers?**

<details><summary>Answer</summary>

O(n^3) time (2n-1 steps x n x n row pairs), O(n^2) space with a rolling layer.
</details>

**9. (Multiple choice) Moves in all four directions, non-negative cell costs, minimize total cost. Best tool?**
a) row-by-row DP  b) Dijkstra  c) Kadane  d) union-find

<details><summary>Answer</summary>

b) Dijkstra — the grid has cycles, so there is no DP fill order.
</details>

**10. (Spot the bug) One-row Maximal Square: `row[j] = 1 + Math.min(row[j], row[j-1], row[j-1])`.**

<details><summary>Answer</summary>

The diagonal (top-left) must be the OLD `row[j-1]`, saved before it was overwritten in this row (`prev`). Using the new `row[j-1]` twice ignores the diagonal.
</details>

**11. (Compute) Triangle `[[2],[3,4],[6,5,7],[4,1,8,3]]` minimum path?**

<details><summary>Answer</summary>

**11**: 2 + 3 + 5 + 1.
</details>

**12. (Complexity) Longest Increasing Path with memoized DFS?**

<details><summary>Answer</summary>

O(m·n) time — each cell is solved once with 4 neighbour checks — and O(m·n) space for the memo and recursion.
</details>

## Mastery checklist

- [ ] I can write Unique Paths (with obstacles) and Minimum Path Sum in one-row form from memory.
- [ ] I can reconstruct the best path from a full table.
- [ ] I can explain why Dungeon Game runs backwards and write its recurrence.
- [ ] I can use the "square ending at (i, j)" trick for both counting and maximal area.
- [ ] I can tell when a grid problem is DP (DAG) versus BFS/Dijkstra (cycles).
