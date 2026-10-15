# Grid DP — Interview Questions

Answer out loud first, then open the model answer. Back to the [sub-topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [DP overview](../../01_Concepts/OVERVIEW.md).

### 1. Why is "right/down only" movement so important for grid DP?

<details><summary>Model answer</summary>

It makes the grid a DAG: every cell's parents (top and left) come earlier in row-major order, so a simple double loop fills the table in a valid order. With moves in all directions there can be cycles and you need BFS/Dijkstra instead.
</details>

### 2. State and recurrence for Unique Paths?

<details><summary>Model answer</summary>

`dp[i][j]` = number of ways to reach `(i, j)`. `dp[i][j] = dp[i-1][j] + dp[i][j-1]`, with the first row and column equal to 1. Answer `dp[m-1][n-1]`, which also equals `C(m+n-2, m-1)`.
</details>

### 3. How do obstacles change the recurrence?

<details><summary>Model answer</summary>

An obstacle cell has 0 ways. Every other cell sums its parents as before. Consequence: in the first row/column, everything after an obstacle stays 0. If the start or end is blocked the answer is 0.
</details>

### 4. How do you reduce grid DP to O(n) space?

<details><summary>Model answer</summary>

Keep one row. When processing `(i, j)` left to right, `row[j]` still holds the value from the row above (top) and `row[j-1]` already holds the current row (left). For problems needing the top-left diagonal, save it in a variable before overwriting.
</details>

### 5. How would you return the actual minimum path, not just its cost?

<details><summary>Model answer</summary>

Keep the full table. Start at the bottom-right and repeatedly step to whichever parent (top or left) has the smaller dp value, then reverse the list. One-row DP loses the information, so this costs O(m·n) space.
</details>

### 6. Why must Dungeon Game be solved from the bottom-right?

<details><summary>Model answer</summary>

The minimum health needed at a cell depends on what comes AFTER it. Going forward you would need both current health and the minimum seen so far, which does not fit one number. Backwards, `need[i][j] = max(1, min(need below, need right) - dungeon[i][j])` is a clean one-value state.
</details>

### 7. Explain the "largest square ending at (i, j)" recurrence.

<details><summary>Model answer</summary>

If the cell is 1, `dp[i][j] = 1 + min(top, left, top-left)`. A square of side k ending here needs squares of side k-1 ending at all three neighbours; the smallest of them limits it. The maximum value is the largest side; the sum of all values counts all squares.
</details>

### 8. Longest Increasing Path in a Matrix moves in four directions. Why is it still DP?

<details><summary>Model answer</summary>

Because each move must go to a strictly larger value, no cycle is possible: the cells form a DAG ordered by value. Memoized DFS from each cell computes `1 + max(neighbours with larger values)` once per cell: O(m·n). Alternatively sort cells by value or run Kahn's topological sort.
</details>

### 9. Cherry Pickup: why can't you do two separate best paths?

<details><summary>Model answer</summary>

The first path's greedy choice removes cherries the second path needed; the combined optimum may use two paths that are each suboptimal. Instead move two walkers simultaneously from the start; after t steps both are on the anti-diagonal `r + c = t`, so the state is `(t, r1, r2)`: O(n^3). Count a shared cell only once.
</details>

### 10. Triangle: why is bottom-up nicer than top-down?

<details><summary>Model answer</summary>

Bottom-up, each cell takes `min` of its two children below, which always exist, and the answer ends up at the apex — no edge cases and no final min over the last row. One array of length n suffices.
</details>

### 11. When does a grid problem need Dijkstra instead of DP?

<details><summary>Model answer</summary>

When you can move in all four directions with non-negative weights (e.g. Path With Minimum Effort, Minimum Cost to Make at Least One Valid Path): cycles mean there is no topological fill order. Use Dijkstra, or 0-1 BFS for 0/1 weights.
</details>

### 12. What edge cases do you test for grid DP?

<details><summary>Model answer</summary>

1x1 grid, single row, single column, blocked start or end, all obstacles, negative values (min falling path), very large counts (Unique Paths fits up to about 2·10^9 for LeetCode's limits; check 2^53 for bigger), and input given as strings ("0"/"1").
</details>
