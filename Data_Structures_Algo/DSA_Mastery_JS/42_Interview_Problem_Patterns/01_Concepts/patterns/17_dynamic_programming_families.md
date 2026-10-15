# 17. Dynamic Programming (families)

Dynamic programming (DP) is "recursion + memory". If a brute-force recursion solves the same
smaller question many times, store each answer once and reuse it. Two styles:

- **Top-down (memoization):** write the recursion, cache results in a `Map` or array.
- **Bottom-up (tabulation):** fill a table from the smallest subproblems up, in a loop.

Every DP answer has the same five parts. Say them out loud in interviews:

1. **State:** what does `dp[i]` (or `dp[i][j]`) mean, in one sentence?
2. **Transition:** how is a state built from smaller states?
3. **Base cases:** the smallest states you know directly.
4. **Order:** which states must be filled first?
5. **Answer:** which cell holds the final result?

Most interview DP problems belong to a handful of **families**. Recognize the family and the
state almost writes itself.

**Teaches in depth:** [DP overview](../../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md), [1D DP](../../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md), [Knapsack](../../../29_Dynamic_Programming/02_Knapsack/README.md), [Strings & Sequences](../../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md), [Grid DP](../../../29_Dynamic_Programming/04_Grid_DP/README.md), [Interval DP](../../../29_Dynamic_Programming/05_Interval_DP/README.md), [Advanced DP](../../../29_Dynamic_Programming/06_Advanced_DP/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at DP |
|---|---|
| "number of ways", "how many distinct" | counting over choices, overlapping subproblems |
| "minimum / maximum cost / profit / length" | optimization over choices |
| "can you reach / form / partition" (true/false) | feasibility DP |
| "longest common / increasing subsequence", "edit distance" | sequence DP |
| "each item at most once" + capacity / target | 0/1 knapsack |
| "unlimited supply" + target | unbounded knapsack |
| "grid, move right/down" | grid DP |
| "burst", "merge stones", "cut a stick", "split a range" | interval DP |
| "buy/sell with cooldown / fee / k transactions" | state machine DP |
| n <= 20 and "visit all" / "assign each" | bitmask DP |

**Constraint hints**

- n up to 10^3–10^4 with two indices -> an O(n^2) table is fine (keep it near 10^7 cells).
- n up to 10^5 -> you need O(n) or O(n log n) DP (1D, or LIS with binary search).
- n <= 20 -> 2^n states (bitmask). n <= 500 -> O(n^3) interval DP.

## 2. When it applies (preconditions)

- **Optimal substructure:** the best answer is built from best answers of subproblems.
- **Overlapping subproblems:** the same subproblem appears many times in the naive recursion.
- A small set of numbers describes "where you are" (the state). If you need the whole history, it is not DP (or the state is too big).

## 3. When it does NOT apply

- **No overlap.** Merge sort splits into disjoint halves; caching does nothing. That is divide and conquer.
- **A greedy choice is provably optimal.** Interval scheduling by earliest end is O(n log n); a DP over subsets is wasted effort ([07](07_sorting_and_greedy_selection.md)).
- **Listing all solutions.** "Return all palindrome partitions" — the output is exponential; DP can help prune, but the core is backtracking ([12](12_recursion_and_backtracking.md)).
- **State depends on the full path.** "Number of simple paths from A to B" in a graph with cycles cannot be keyed by the current node alone: two partial paths that reach node X with different visited sets have different futures. Cache by node and you get wrong counts. Counterexample: triangle A-B-C plus B-D; caching "paths from B to D" while C is visited vs not visited gives different answers.

## 4. The templates (one per family)

```js
// Linear DP: House Robber, rolled into two variables
function houseRobber(nums) {
  let skip = 0;                                    // best so far if the current house is NOT robbed
  let take = 0;                                    // best so far if the current house IS robbed
  for (const x of nums) [skip, take] = [Math.max(skip, take), skip + x];
  return Math.max(skip, take);
}

// 0/1 knapsack: each item once -> iterate capacity BACKWARD
function knapsack01(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = W; w >= weights[i]; w--) dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  }
  return dp[W];
}

// Unbounded knapsack: reuse allowed -> iterate amount FORWARD
function coinChangeMin(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Two sequences: LCS. dp[i][j] = answer for prefixes a[0..i), b[0..j)
function lcsLength(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// LIS in O(n log n): tails[k] = smallest tail of an increasing subsequence of length k + 1
function lisLength(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < x) lo = mid + 1; else hi = mid; }
    tails[lo] = x;
  }
  return tails.length;
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`houseRobber`, `knapsack01`, `coinChangeMin`, `lcsLength`, `lisLength`; `memoize` in [templates.js](../../02_Implementations/templates.js)) and [tests/patterns.test.js](../../tests/patterns.test.js) — each compared against an exponential brute force on random small inputs.

**Dry run** `coinChangeMin([1, 2, 5], 6)`:

| a | candidates dp[a - c] + 1 | dp[a] |
|---|---|---|
| 0 | base | 0 |
| 1 | c=1: 1 | 1 |
| 2 | c=1: 2, c=2: 1 | 1 |
| 3 | c=1: 2, c=2: 2 | 2 |
| 4 | c=1: 3, c=2: 2 | 2 |
| 5 | c=1: 3, c=2: 3, c=5: 1 | 1 |
| 6 | c=1: 2, c=2: 3, c=5: 2 | 2 |

## 5. The families (variations)

| Family | State | Transition sketch | Examples |
|---|---|---|---|
| **Linear / 1D** | `dp[i]` = best for the prefix up to i | from `i-1`, `i-2`, or a few earlier | Climbing Stairs, House Robber, Decode Ways, Word Break |
| **0/1 knapsack** | `dp[w]` = best with capacity w | `max(dp[w], dp[w - wt] + val)`, w **backward** | Partition Equal Subset Sum, Target Sum, Ones and Zeroes |
| **Unbounded knapsack** | `dp[a]` = best for amount a | same, a **forward** | Coin Change, Coin Change II, Rod Cutting |
| **Two sequences** | `dp[i][j]` for prefixes of both | match -> diagonal; else best of left/up | LCS, Edit Distance, Distinct Subsequences, Interleaving String |
| **LIS family** | `dp[i]` = best ending at i, or patience `tails` | from all `j < i` with `a[j] < a[i]` | LIS, Russian Doll Envelopes, Number of LIS |
| **Grid** | `dp[r][c]` = best to reach the cell | from top and left | Unique Paths, Minimum Path Sum, Maximal Square |
| **Interval** | `dp[i][j]` = best for range i..j | split point k; fill by increasing length | Burst Balloons, Matrix Chain, Palindrome Partitioning II |
| **State machine** | `dp[i][state]` (holding / not holding / cooldown) | allowed state changes per day | Stock with Cooldown / Fee / k transactions |
| **Tree DP** | a tuple returned from each child | combine in post-order | House Robber III, Binary Tree Cameras |
| **Bitmask** | `dp[mask][last]` | add one unused element | Shortest Superstring (TSP), Partition to K Equal Subsets |

## 6. Common pitfalls

1. **Undefined state.** If you cannot say what `dp[i]` means in one sentence, stop and define it.
2. **0/1 vs unbounded loop direction.** Forward iteration in 0/1 knapsack reuses an item many times.
3. **Combinations vs permutations in Coin Change II:** coins in the outer loop counts combinations; amount in the outer loop counts ordered sequences (Combination Sum IV).
4. **`new Array(n).fill(new Array(m).fill(0))`** shares one row across all rows. Use `Array.from({ length: n }, () => new Array(m).fill(0))`.
5. **Memo checks:** `0` and `false` are valid cached values — check `memo.has(key)`, not `if (memo[key])`.
6. **Recursion depth:** top-down DP with n = 10^5 overflows the JS stack. Convert to bottom-up.
7. **Counting overflow:** "return the answer mod 1e9+7" — apply `%` at every addition; products can exceed 2^53, so use `BigInt` for multiplications.

## 7. Representative problems

| # | Problem | Difficulty | Family | Page |
|---|---|---|---|---|
| 1 | Climbing Stairs | Easy | linear | [statement](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/01_Easy/02_climbing_stairs.md) · [solution](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/solutions/02_climbing_stairs.js) |
| 2 | House Robber II | Medium | linear, circular | [statement](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/06_house_robber_ii.md) · [solution](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/solutions/06_house_robber_ii.js) |
| 3 | Word Break | Medium | linear over prefixes | [statement](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/17_word_break.md) · [solution](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/solutions/17_word_break.js) |
| 4 | Partition Equal Subset Sum | Medium | 0/1 knapsack | [statement](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/03_subset_sum_partition_equal.md) · [solution](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/solutions/03_subset_sum_partition_equal.js) |
| 5 | Coin Change II | Medium | unbounded, combinations | [statement](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/05_coin_change_ii.md) · [solution](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/solutions/05_coin_change_ii.js) |
| 6 | Longest Common Subsequence | Medium | two sequences | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/01_longest_common_subsequence.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/01_longest_common_subsequence.js) |
| 7 | Edit Distance | Medium | two sequences | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/10_edit_distance.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/10_edit_distance.js) |
| 8 | Longest Increasing Subsequence | Medium | LIS | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/03_longest_increasing_subsequence.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/03_longest_increasing_subsequence.js) |
| 9 | Unique Paths II | Medium | grid | [statement](../../../29_Dynamic_Programming/04_Grid_DP/03_Problems/02_Medium/02_unique_paths_ii.md) · [solution](../../../29_Dynamic_Programming/04_Grid_DP/03_Problems/solutions/02_unique_paths_ii.js) |
| 10 | Stock with Cooldown | Medium | state machine | [statement](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/18_stock_with_cooldown.md) · [solution](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/solutions/18_stock_with_cooldown.js) |
| 11 | Burst Balloons | Hard | interval | [statement](../../../29_Dynamic_Programming/05_Interval_DP/03_Problems/03_Hard/06_burst_balloons.md) · [solution](../../../29_Dynamic_Programming/05_Interval_DP/03_Problems/solutions/06_burst_balloons.js) |
| 12 | Shortest Superstring | Hard | bitmask | [statement](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/03_Hard/14_shortest_superstring_tsp.md) · [solution](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/solutions/14_shortest_superstring_tsp.js) |

## 8. Self-check

**Q1.** Why does 0/1 knapsack loop the capacity backward in the 1D version?

<details><summary>Answer</summary>

`dp[w - wt]` must still hold the value from the *previous* item. Going backward means `dp[w - wt]` has not been updated for the current item yet, so the item is used at most once. Going forward would let it be added again.

</details>

**Q2.** Coin Change II counts combinations. Which loop is outside, and why?

<details><summary>Answer</summary>

Coins outside, amounts inside. Each coin is considered in a fixed order, so `{1, 2}` and `{2, 1}` are built only once. With amounts outside you count ordered sequences (that is Combination Sum IV).

</details>

**Q3.** State and transition for Edit Distance?

<details><summary>Answer</summary>

`dp[i][j]` = min operations to turn `a[0..i)` into `b[0..j)`. If `a[i-1] === b[j-1]`: `dp[i-1][j-1]`; else `1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace))`. Base: `dp[i][0] = i`, `dp[0][j] = j`.

</details>

---

Previous: [16. Union-Find](16_union_find.md) · Next: [18. Bit Manipulation](18_bit_manipulation.md) · [Pattern index](../../README.md)
