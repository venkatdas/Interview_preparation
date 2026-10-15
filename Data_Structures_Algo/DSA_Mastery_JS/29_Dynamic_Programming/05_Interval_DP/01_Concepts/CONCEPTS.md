# Interval DP (DP on ranges `[l, r]`)

**Interval DP** is dynamic programming where the state is a **contiguous range** of the input,
written `dp[l][r]` = "the best answer for the piece from index `l` to index `r`".
Think of cutting a wooden plank: the cost of cutting the whole plank depends on where you
make the **last** cut, and each side of that cut is a smaller plank you can solve on its own.
Small planks first, then bigger ones built from them.

Read the [DP overview](../../01_Concepts/OVERVIEW.md) first for the 5-step DP framework. This folder assumes you know what a
state, a recurrence and a base case are.

---

## Prerequisites

- [DP overview and 5-step framework](../../01_Concepts/OVERVIEW.md) — state, recurrence, base case, order, answer.
- [Strings & Sequences DP](../../03_Strings_And_Sequences/README.md) — 2D tables over two indices; the palindrome table `isPal[l][r]` is already interval DP.
- [Divide and Conquer](../../../30_Divide_And_Conquer/README.md) — "split into a left part and a right part" is the same picture, but here the parts overlap across choices.

**Essential vs Advanced:** the length-ordered loop skeleton, game DP on two ends and min-cost split (matrix chain / cut stick) are **Essential**. The "last operation" trick (Burst Balloons) is **Essential for top-tier interviews**. Strange Printer and the 3D state of Remove Boxes are **Advanced**.

---

## Why it matters / when to use

Reach for interval DP when the problem has any of these signals:

- The input is a **sequence** (array / string) and you combine or remove **contiguous** pieces
- "Burst", "merge", "cut", "remove", "multiply in some order", "triangulate"
- The cost of an operation depends on its **neighbours**, so the order of operations matters
- "Minimum cost to ..." or "maximum coins from ..." over a whole range
- Two players take from **either end** of an array (game DP)
- Palindromes on a range (is `s[l..r]` a palindrome?) — see [Strings & Sequences DP](../../03_Strings_And_Sequences/01_Concepts/CONCEPTS.md)
- Constraints are small: `n <= 500` is the classic hint, because the solution is O(n^3)

---

## How it works

### The mental model

The answer for a range `[l, r]` is built from answers of **strictly smaller** ranges inside it.
So we must compute short ranges before long ranges. The order of computation is **by length**:

```
length 1:  [0,0] [1,1] [2,2] [3,3]        (base cases, usually 0)
length 2:  [0,1] [1,2] [2,3]              (built from length 1)
length 3:  [0,2] [1,3]                    (built from length 1 and 2)
length 4:  [0,3]                          (the final answer)
```

In the 2D table this means we fill **diagonal by diagonal**, moving away from the main
diagonal toward the top-right corner:

```
        r=0   r=1   r=2   r=3
  l=0 [  0  ][len2][len3][len4]  <- answer is dp[0][n-1], top-right
  l=1 [  -  ][  0 ][len2][len3]
  l=2 [  -  ][  - ][  0 ][len2]
  l=3 [  -  ][  - ][  - ][  0 ]
```

Only the upper triangle (`l <= r`) is used.

### The loop skeleton (memorize this)

```js
for (let len = 2; len <= n; len++) {          // 1. by increasing length
  for (let l = 0; l + len - 1 < n; l++) {     // 2. every start
    const r = l + len - 1;                     //    -> fixed end
    dp[l][r] = Infinity;                       //    (or -Infinity / 0)
    for (let k = l; k < r; k++) {              // 3. every split / "last operation"
      dp[l][r] = Math.min(dp[l][r], dp[l][k] + dp[k + 1][r] + cost(l, k, r));
    }
  }
}
```

### The "last operation" trick

This is the key insight of the whole folder. When operations change the neighbours
(Burst Balloons: bursting a balloon makes two other balloons adjacent), picking the **first**
operation does NOT split the problem into independent parts — the left side and right side
still interact after the burst.

Instead ask: **which element is handled LAST in `[l, r]`?**
If balloon `k` is the last one burst in `(l, r)`, then when it bursts its neighbours are
exactly `l` and `r` (everything else between is already gone). The ranges `(l, k)` and
`(k, r)` were fully cleared **before** that, and they never touched each other.
So they are independent subproblems:

```
dp[l][r] = max over k in (l, r) of:
           dp[l][k] + dp[k][r] + nums[l] * nums[k] * nums[r]
```

### Padding with sentinels

Many interval problems become cleaner when you add a fake element on each end
(`1` for Burst Balloons, `0` and `n` for Cut Stick). Then the "real" range is always
strictly between two boundaries that never disappear, and you avoid `if (l - 1 < 0)` checks.

```
nums = [3, 1, 5]   ->  padded = [1, 3, 1, 5, 1]
                                 ^           ^  sentinels never burst
```

### Matrix-chain style splits

When the operation combines two neighbouring blocks (multiply matrices, merge stones,
triangulate a polygon) the split point `k` separates the range into `[l, k]` and `[k+1, r]`,
and the cost of the final combine is a function of the boundary values only.

### Game DP on intervals

Two players alternately take from either end. Instead of tracking both scores, track the
**score difference** `dp[l][r]` = (current player's best total) − (opponent's best total)
on `[l, r]`:

```
dp[l][r] = max( nums[l] - dp[l+1][r],      // take left, opponent then plays optimally
                nums[r] - dp[l][r-1] )     // take right
answer: dp[0][n-1] >= 0  -> first player can win
```

### Interval + 1D combo (Palindrome Partitioning II)

Precompute a boolean interval table `isPal[l][r]` (interval DP), then run a normal 1D DP
`cuts[i]` on prefixes that *reads* that table. Two DPs, one feeding the other.

### A tiny worked table: Matrix Chain, dims = [2, 3, 4, 5]

Matrices: A (2x3), B (3x4), C (4x5). `dp[l][r]` = min multiplications for matrices l..r.

```
length 1: dp[0][0] = dp[1][1] = dp[2][2] = 0

length 2:
  dp[0][1] = A*B = 2*3*4 = 24
  dp[1][2] = B*C = 3*4*5 = 60

length 3: dp[0][2]
  k=0: (A)(BC)  = dp[0][0] + dp[1][2] + 2*3*5 = 0 + 60 + 30 = 90
  k=1: (AB)(C)  = dp[0][1] + dp[2][2] + 2*4*5 = 24 + 0 + 40 = 64   <- min
  dp[0][2] = 64

        r=0  r=1  r=2
  l=0 [  0 ][ 24 ][ 64 ]
  l=1 [  - ][  0 ][ 60 ]
  l=2 [  - ][  - ][  0 ]
```

---

## Pseudocode (Essential)

```
intervalDP(n):
  dp[i][i] = base value for one element            # length 1
  for len in 2..n:                                  # small ranges before big ones
    for l in 0..n - len:
      r = l + len - 1
      dp[l][r] = worst possible (Infinity for min, -Infinity for max)
      for k in l..r-1:                              # every split / last operation
        dp[l][r] = best(dp[l][r], dp[l][k] + dp[k+1][r] + cost(l, k, r))
  return dp[0][n-1]

memo version:  solve(l, r) = base if l >= r, else best over k of solve(l, k) + solve(k+1, r) + cost
```

---

## Dry run — Predict the Winner, nums = [1, 5, 2] (Essential)

State: `dp[l][r]` = best score difference (current player − opponent) on `nums[l..r]`.
Recurrence: `dp[l][r] = max(nums[l] − dp[l+1][r], nums[r] − dp[l][r−1])`.

| len | (l, r) | take left | take right | dp[l][r] |
|---|---|---|---|---|
| 1 | (0,0) | — | — | 1 |
| 1 | (1,1) | — | — | 5 |
| 1 | (2,2) | — | — | 2 |
| 2 | (0,1) | 1 − 5 = −4 | 5 − 1 = 4 | 4 |
| 2 | (1,2) | 5 − 2 = 3 | 2 − 5 = −3 | 3 |
| 3 | (0,2) | 1 − dp[1][2] = 1 − 3 = −2 | 2 − dp[0][1] = 2 − 4 = −2 | **−2** |

`dp[0][2] = −2 < 0`, so player 1 cannot win. Every cell only used cells of a smaller length, which is why we loop by length.

---

## Operations & complexity

| Pattern | States | Work per state | Time | Space |
|---------|--------|----------------|------|-------|
| Split at k (matrix chain, burst balloons, cut stick) | O(n^2) ranges | O(n) splits | O(n^3) | O(n^2) |
| Take from either end (game DP) | O(n^2) | O(1) | O(n^2) | O(n^2) |
| Palindrome table `isPal[l][r]` | O(n^2) | O(1) | O(n^2) | O(n^2) |
| 3D interval (Remove Boxes `dp[l][r][k]`) | O(n^3) | O(n) | O(n^4) | O(n^3) |

Why O(n^3)? There are about n^2 / 2 ranges `[l, r]`, and for each one the split loop tries up
to n values of `k`. (#states) x (work per state) = n^2 x n.

---

## JavaScript implementation

There is no data structure here; the "implementation" is the loop skeleton above.
Every problem file in `03_Problems/solutions/` contains these versions (shared helpers live in [dp_framework.js](../../02_Implementations/dp_framework.js)):

```js
function bruteForce(nums)  // plain recursion on (l, r): exponential, for understanding
function memo(nums)        // same recursion + 2D cache: O(n^3)
function tabulation(nums)  // fill dp[l][r] by increasing length: O(n^3), no recursion
```

The memo version is usually easiest to write in an interview; the tabulation version
shows you understand the order of computation.

---

## Patterns / variations

### 1. Minimum cost split (matrix chain, cut stick, triangulation)

```js
function minCost(values) {                       // values are boundaries
  const n = values.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 3; len <= n; len++) {           // need at least 3 boundaries to do work
    for (let l = 0; l + len - 1 < n; l++) {
      const r = l + len - 1;
      dp[l][r] = Infinity;
      for (let k = l + 1; k < r; k++) {
        dp[l][r] = Math.min(dp[l][r], dp[l][k] + dp[k][r] + values[l] * values[k] * values[r]);
      }
    }
  }
  return dp[0][n - 1];
}
```
Use when: combining two neighbouring blocks has a cost depending on boundary values.

### 2. "Last to be removed" (Burst Balloons)

Same loop, but `k` is the element handled last, and the sub-ranges are `[l, k]` and `[k, r]`
sharing `k` as a boundary (not `k+1`).

### 3. Game / minimax on both ends

```js
dp[l][r] = Math.max(nums[l] - dp[l + 1][r], nums[r] - dp[l][r - 1]);
```
Use when: two players, optimal play, pick from either end, "can player 1 win?".

### 4. Boolean interval table

```js
isPal[l][r] = s[l] === s[r] && (len <= 2 || isPal[l + 1][r - 1]);
```
Use when: "is this substring a palindrome?" is asked many times.

### 5. Extra dimension (Remove Boxes)

When the optimal choice depends on something attached to the range (how many equal boxes
sit right after `r`), add that as a third dimension: `dp[l][r][k]`.

---

## Alternatives (Essential)

| Approach | Time | When it is the right call |
|---|---|---|
| Brute force recursion over every order | O(n!) or O(2^n) | only to understand the problem / tiny n |
| **Memoised recursion on (l, r)** | O(n^3) typical | easiest to write correctly in an interview |
| **Tabulation by increasing length** | O(n^3) typical | no recursion depth issues; shows you understand the order |
| Greedy (e.g. always merge the cheapest pair) | O(n log n) | only when a swap argument proves it — Huffman-style merging of ANY pair works greedily, but merging ADJACENT piles (stones) does not |
| Knuth / quadrangle optimisation | O(n^2) | when the cost satisfies the quadrangle inequality (optimal BST, some merge problems) — see [DP Optimizations](../../../41_Advanced_Algorithm_Design) |

---

## When interval DP does NOT apply (Essential)

- The pieces are **not contiguous** (you may pick any subset) — that is [knapsack](../../02_Knapsack/README.md) or bitmask DP.
- The answer for a range does **not** depend only on the range (outside elements matter and cannot be fixed by padding / an extra dimension).
- n is large (≥ ~2000 for O(n^2) states with O(n) transitions) — look for a greedy, a 1D DP, or an optimisation.
- Only **prefixes** matter (`dp[i]` over the first i elements) — a 1D DP is simpler, e.g. [Word Break](../../01_One_Dimensional_DP/03_Problems/02_Medium/17_word_break.md).

---

## Common mistakes & edge cases

- Filling the table **row by row** instead of **by length**: `dp[l][k+1..r]` would not be
  ready yet. Always loop `len` outermost (or use memoization and let recursion handle order).
- Off-by-one on the split: matrix-chain style uses `[l, k]` + `[k+1, r]`, boundary style
  (cut stick, burst balloons) uses `[l, k]` + `[k, r]`. Decide which one your state means.
- Forgetting the sentinels: Burst Balloons needs `1` on both ends; Cut Stick needs `0` and `n`.
- Initializing `dp[l][r]` to `0` when you take a `min` — it must start at `Infinity`.
- Single element / empty range: usually `dp[i][i] = 0` or `= nums[i]`; empty `l > r` = 0.
- `n = 1` and `n = 2`: test them, the loops often don't even run.
- Memo key: use a 2D array, not string keys `${l},${r}` — it is 10x faster in JS.

---

## Interview tips

- Say: "The state is a range `[l, r]`. I'll solve all shorter ranges first, then build
  longer ones by choosing a split point `k`."
- For burst/remove problems say the magic sentence: "I'll decide which element is handled
  **last**, because then the two sides become independent."
- State the complexity before coding: "O(n^2) states, O(n) transitions, so O(n^3). The
  constraint n <= 500 confirms that's intended."
- Write the memoized recursion first (fewer index bugs), then mention you can convert it to
  a length-ordered table if asked.
- Draw the 3x3 table for a tiny input and fill the diagonal; interviewers love seeing the order.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Predict the Winner / Stone Game | Medium | game DP, score difference | [01_predict_the_winner_stone_game.js](../03_Problems/solutions/01_predict_the_winner_stone_game.js) |
| 02 | Matrix Chain Multiplication | Medium | min-cost split | [02_matrix_chain_multiplication.js](../03_Problems/solutions/02_matrix_chain_multiplication.js) |
| 03 | Minimum Score Triangulation of Polygon | Medium | min-cost split (boundary style) | [03_minimum_score_triangulation.js](../03_Problems/solutions/03_minimum_score_triangulation.js) |
| 04 | Palindrome Partitioning II | Hard | interval table + 1D DP | [04_palindrome_partitioning_ii.js](../03_Problems/solutions/04_palindrome_partitioning_ii.js) |
| 05 | Minimum Cost to Cut a Stick | Hard | sentinels + split on cut | [05_minimum_cost_to_cut_a_stick.js](../03_Problems/solutions/05_minimum_cost_to_cut_a_stick.js) |
| 06 | Burst Balloons | Hard | "last operation" trick | [06_burst_balloons.js](../03_Problems/solutions/06_burst_balloons.js) |
| 07 | Strange Printer | Hard | merge equal ends | [07_strange_printer.js](../03_Problems/solutions/07_strange_printer.js) |
| 08 | Remove Boxes | Hard | 3D interval state (l, r, k) | [08_remove_boxes.js](../03_Problems/solutions/08_remove_boxes.js) |

---

## Practice more

Medium: Stone Game (877), Predict the Winner (486), Minimum Score Triangulation of Polygon (1039),
Longest Palindromic Subsequence (516), Guess Number Higher or Lower II (375),
Minimum Cost Tree From Leaf Values (1130), Stone Game VII (1690)

Hard: Burst Balloons (312), Strange Printer (664), Remove Boxes (546),
Minimum Cost to Cut a Stick (1547), Minimum Cost to Merge Stones (1000),
Palindrome Partitioning II (132), Scramble String (87), Stone Game III (1406),
Number of Ways to Form a Target String (1639), Allocate Mailboxes (1478)
