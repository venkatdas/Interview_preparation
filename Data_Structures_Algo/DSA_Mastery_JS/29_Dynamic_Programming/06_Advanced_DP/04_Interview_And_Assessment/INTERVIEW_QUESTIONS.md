# Advanced DP — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. What is bitmask DP and when is it feasible?

<details><summary>Model answer</summary>

The state includes a subset of n items packed into an integer (bit i = item i used). There are 2^n subsets, so it is feasible for n up to about 20 (2^20 ≈ 10^6 states; with an extra "last" index, n ≤ ~16). Signals: "assign / order / partition a small set of items", n ≤ 20.
</details>

### 2. Explain the TSP / Shortest Superstring state.

<details><summary>Model answer</summary>

`dp[mask][last]` = the best cost of visiting exactly the items in `mask`, ending at `last`. Transition: add an unvisited item j: `dp[mask | 1<<j][j] = best(dp[mask][last] + cost(last, j))`. O(2^n · n^2) time, O(2^n · n) space. For superstring, cost = length of j minus its overlap with last; keep parent pointers to rebuild the string.
</details>

### 3. How does tree DP work?

<details><summary>Model answer</summary>

Do a post-order DFS. Each node returns a small tuple describing its subtree under each possible state of the node (e.g. [best if robbed, best if not robbed]). The parent combines its children's tuples. Each node is processed once: O(n) time, O(h) recursion stack.
</details>

### 4. Walk through House Robber III.

<details><summary>Model answer</summary>

`dfs(node)` returns `[take, skip]`. `take = node.val + left.skip + right.skip` (children cannot be robbed). `skip = max(left) + max(right)` (each child chooses freely). Answer `max(dfs(root))`. Plain recursion over grandchildren without caching is exponential; the tuple makes it O(n).
</details>

### 5. Binary Tree Cameras: what are the three states?

<details><summary>Model answer</summary>

For each node: 0 = not covered (needs its parent to have a camera), 1 = has a camera, 2 = covered without a camera. Greedy post-order: null children count as covered; if any child is not covered, put a camera here; else if any child has a camera, this node is covered; else it is not covered. If the root ends uncovered, add one camera.
</details>

### 6. How do you model stock problems as a state machine?

<details><summary>Model answer</summary>

States describe what you hold and how many transactions remain: `buy[t]` (holding, t-th transaction open) and `sell[t]` (not holding, t transactions done). Each day: `buy[t] = max(buy[t], sell[t-1] - price)`, `sell[t] = max(sell[t], buy[t] + price)`. Cooldown and fees are extra states or adjustments. O(n·k) time, O(k) space.
</details>

### 7. Stock IV with k = 10^9 — what changes?

<details><summary>Model answer</summary>

With n days you can make at most n/2 useful transactions. If `k >= n/2`, the limit does not bind: sum every positive difference `prices[i] - prices[i-1]` in O(n). Otherwise run the O(n·k) state machine.
</details>

### 8. How does Maximum Profit in Job Scheduling use binary search?

<details><summary>Model answer</summary>

Sort jobs by end time. `dp[i]` = best profit using the first i jobs. For job i, either skip it (`dp[i-1]`) or take it plus `dp[p]`, where p is the number of jobs ending at or before its start — found by binary search over sorted end times. O(n log n).
</details>

### 9. Constrained Subsequence Sum: why a monotonic deque?

<details><summary>Model answer</summary>

`dp[i] = nums[i] + max(0, max(dp[i-k..i-1]))`. The inner max over a sliding window is the bottleneck (O(k) each). A deque of indices with decreasing dp values gives the window max in amortised O(1): pop expired indices from the front and smaller values from the back. O(n) total.
</details>

### 10. What is digit DP?

<details><summary>Model answer</summary>

Counting numbers up to N with a digit property. Walk the digits from most significant, with state (position, tight = still equal to N's prefix, plus property info such as used digits mask or running sum, and "started" to handle leading zeros). Each position tries digits 0..9 (or up to N's digit when tight). Count Numbers with Unique Digits is the simple combinatorial version.
</details>

### 11. Partition to K Equal Sum Subsets — DP or backtracking?

<details><summary>Model answer</summary>

Both. Bitmask DP: `dp[mask]` = can the used items be arranged into full buckets plus one partial bucket; the partial sum is `sum(mask) % target`, so the mask alone is enough. O(2^n · n). Backtracking with descending sort and pruning is often faster in practice, but its worst case is exponential with no memo.
</details>

### 12. How do you choose a memo key in JavaScript for multi-dimensional states?

<details><summary>Model answer</summary>

Encode into one number when bounds are known (`(mask * n + last)`), which is fastest with typed arrays. Otherwise use a string key like `` `${i},${j},${k}` `` in a Map, or nested arrays. Avoid using arrays as Map keys (they compare by reference).
</details>

### 13. When should you NOT use DP?

<details><summary>Model answer</summary>

When subproblems do not overlap (divide and conquer is enough), when a greedy choice is provably safe, when the state space is too large for the constraints, or when you must enumerate all solutions (backtracking).
</details>
