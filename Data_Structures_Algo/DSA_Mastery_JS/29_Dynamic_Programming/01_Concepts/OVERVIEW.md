# Dynamic Programming (DP)

**Dynamic programming** is a way to solve a problem by breaking it into smaller versions of
itself, solving each small version **once**, and remembering the answers so you never redo work.
Think of climbing a staircase and writing on each step "number of ways to get here". When you
stand on step 10 you do not recount from the ground: you just read the numbers on steps 9 and 8
and add them. DP is "recursion + a notebook".

It is the topic most people fear in interviews, and the topic with the most predictable
structure once you know the recipe. This folder teaches the recipe first, then the classic
families, one sub-folder each.

---

## Why it matters / when to use

A problem is a DP problem when it has **both** of these properties:

1. **Overlapping subproblems** - the naive recursion solves the *same* smaller input many times.
2. **Optimal substructure** - the best answer for the big input can be built from the best
   answers of smaller inputs (you never need to "undo" a sub-answer).

Wording that signals DP:

- "**How many ways** to ..." (count)
- "**Minimum / maximum** cost, path, profit, length ..." (optimize)
- "**Can we** reach / make / partition ..." (yes/no)
- "**Longest / shortest** subsequence, path, run ..." where you make a **choice** at each step
- A brute force that is exponential (2^n, n!) over a small-ish input (n <= 1000, 2^20)
- You feel like writing recursion with 2-3 parameters that keep getting smaller

Wording that signals **not** DP: "all permutations / all subsets" (you need the actual lists ->
backtracking), "sorted and pick greedily" (greedy), "distinct elements, any order" (hashing).

---

## How it works

### The repeated work, drawn

Fibonacci: `fib(n) = fib(n-1) + fib(n-2)`. The naive call tree for `fib(5)`:

```
                        fib(5)
                   /             \
              fib(4)             fib(3)
             /      \           /      \
        fib(3)     fib(2)    fib(2)   fib(1)
        /    \     /    \    /    \
    fib(2) fib(1) fib(1) fib(0) fib(1) fib(0)
    /    \
 fib(1) fib(0)

 fib(3) computed 2 times, fib(2) 3 times, fib(1) 5 times.
 For fib(50) the tree has ~ 40 billion nodes.  There are only 51 DIFFERENT inputs.
```

Fifty-one different questions, forty billion times asked. DP asks each question once.

Two ways to do that:

```
 TOP-DOWN (memoization)                     BOTTOM-UP (tabulation)
 keep the recursion, add a cache            drop the recursion, fill a table in order

 function fib(n, memo = {}) {               function fib(n) {
   if (n <= 1) return n;                      const dp = [0, 1];
   if (n in memo) return memo[n];             for (let i = 2; i <= n; i++) {
   memo[n] = fib(n-1, memo)                     dp[i] = dp[i-1] + dp[i-2];
           + fib(n-2, memo);                  }
   return memo[n];                            return dp[n];
 }                                          }

 + easy to write from the recursion         + no recursion depth limit, usually faster
 + only visits states that are needed       + easy to space-optimise (rolling array)
 - recursion depth can overflow (~10k)      - you must figure out the fill ORDER
 - Map/object overhead                      - visits every state even if unneeded
```

Both are O(n) time for Fibonacci. In interviews: **write memo first** (it is the recursion you
already have, plus three lines), then convert to a table if asked about space or recursion depth.

### The 5-step framework (use it for every DP problem)

| Step | Question to answer | Fibonacci example |
|------|--------------------|-------------------|
| 1. **State** | What is the minimal info that describes a subproblem? What does `dp[...]` *mean* in one sentence? | `dp[i]` = the i-th Fibonacci number |
| 2. **Recurrence / transition** | How do I get `dp[state]` from smaller states? What are the *choices*? | `dp[i] = dp[i-1] + dp[i-2]` |
| 3. **Base cases** | Which states are known without any computation? | `dp[0] = 0`, `dp[1] = 1` |
| 4. **Order / memo** | Bottom-up: in what order are dependencies ready? Top-down: what is the cache key? | `i` increasing; key = `i` |
| 5. **Answer + space** | Which cell holds the answer? Which old cells can I throw away? | `dp[n]`; only the last two cells are needed -> O(1) |

Step 1 is 80 % of the work. If you can say *"dp[i][j] is the length of the longest common
subsequence of the first i letters of A and the first j letters of B"* out loud, the rest follows.

### From brute force to O(1) space, the full ladder

Every problem file in this folder walks this ladder with four functions:

```
 bruteForce   plain recursion with the choices written out        exponential
      |       "add a cache keyed by the state"
 memo         top-down, same recursion + Map/array cache           #states x work per state
      |       "replace the recursion with loops that fill the table from base cases"
 tabulation   bottom-up table                                      same time, no call stack
      |       "dp[i] only reads dp[i-1] and dp[i-2]  ->  keep two variables"
 optimized    rolling variables / one row of a 2D table            same time, less space
```

`dp-framework.js` at this level runs Fibonacci and Climbing Stairs through all four stages and
prints timings. Run it: `node dp-framework.js`.

### Common state shapes

| Shape | `dp` meaning | Typical problems | Sub-folder |
|-------|-------------|------------------|-----------|
| 1D index `dp[i]` | best answer using the first `i` items / standing at `i` | Climbing Stairs, House Robber, Word Break | `29_Dynamic_Programming/01_One_Dimensional_DP` |
| index + capacity `dp[i][c]` | best using first `i` items with budget `c` | Knapsack, Coin Change, Partition Equal Subset | `29_Dynamic_Programming/02_Knapsack` |
| two indices `dp[i][j]` (two sequences) | answer for prefix `i` of A and prefix `j` of B | LCS, Edit Distance, Regex Matching | `29_Dynamic_Programming/03_Strings_And_Sequences` |
| grid `dp[r][c]` | best way to reach cell (r, c) | Unique Paths, Min Path Sum, Dungeon Game | `29_Dynamic_Programming/04_Grid_DP` |
| interval `dp[l][r]` | answer for the sub-array / substring `l..r` | Burst Balloons, Palindromic Subsequence, Matrix Chain | `29_Dynamic_Programming/05_Interval_DP` |
| index + mask `dp[mask]` / `dp[i][mask]` | answer for the *set* of items in `mask` | TSP, Partition to K Subsets | `29_Dynamic_Programming/06_Advanced_DP` |
| index + extra flag `dp[i][holding]` | state machine | Stock problems with cooldown / fee / k transactions | `29_Dynamic_Programming/01_One_Dimensional_DP`, `29_Dynamic_Programming/06_Advanced_DP` |
| tree node `dp[node][state]` | best for the subtree rooted here | House Robber III, Tree Cameras | `29_Dynamic_Programming/06_Advanced_DP` |

---

## Operations & complexity

There is one formula to remember:

```
 time  =  (number of states)  x  (work per transition)
 space =  (number of states)   ... minus whatever you can roll away
```

| Pattern | States | Work per state | Time | Space (naive -> optimised) |
|---------|--------|----------------|------|----------------------------|
| 1D linear | n | O(1) | O(n) | O(n) -> O(1) |
| 1D with "try every previous" (LIS, Word Break) | n | O(n) | O(n^2) | O(n) |
| Knapsack | n x W | O(1) | O(nW) | O(nW) -> O(W) |
| Unbounded knapsack / coin change | W x coins | O(1) | O(W x coins) | O(W) |
| Two sequences (LCS, edit distance) | m x n | O(1) | O(mn) | O(mn) -> O(min(m, n)) |
| Grid | r x c | O(1) | O(rc) | O(rc) -> O(c) |
| Interval | n^2 | O(n) splits | O(n^3) | O(n^2) |
| Bitmask | 2^n | O(n) | O(2^n x n) | O(2^n) |
| Tree | n nodes | O(children) | O(n) | O(height) call stack |

"Pseudo-polynomial": O(nW) looks polynomial but `W` is a *value*, not a count. If W = 10^9 the
knapsack table does not fit. Mention this in interviews.

---

## JavaScript implementation

Full code: `dp-framework.js`. The two helpers you will write again and again:

```js
// Top-down with a Map cache (works for any number of parameters)
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = args.join(',');          // "i,j" style key
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Bottom-up 2D table, 1-indexed padding so dp[0][*] and dp[*][0] are the empty cases
function make2D(rows, cols, fill = 0) {
  return Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(fill));
}
```

Cache key tips for JavaScript:

- Single integer state -> plain array `cache[i]`, check `cache[i] !== undefined`.
- Two small integers -> 2D array, or encode `i * cols + j` into one integer key (fast).
- Strings / many params -> `Map` with `args.join(',')`. Never use an object as a Map key
  by reference unless it is the same object every time.
- Use `-1` or `undefined` as "not computed", **not** `0`, because `0` can be a real answer.
- Use `Infinity` for "impossible" in min problems and check `=== Infinity` before returning.

---

## Patterns / variations

### 1. Take or skip (1D)

```js
// House Robber: dp[i] = max money from houses 0..i
dp[i] = Math.max(dp[i - 1],            // skip house i
                 dp[i - 2] + nums[i]); // take house i (cannot take i-1)
```
Use when: each element is either used or not, and using one restricts its neighbours.

### 2. Count ways vs min cost vs can-we

Same recurrence shape, three different "combine" operations:

```js
dp[i] = dp[i-1] + dp[i-2];              // count:  ADD the ways,  base dp[0] = 1
dp[i] = Math.min(dp[i-1], dp[i-2]) + c; // min:    MIN of options, base dp[0] = 0, others Infinity
dp[i] = dp[i-1] || dp[i-2];             // can-we: OR of options,  base dp[0] = true
```

### 3. Knapsack (index + capacity)

```js
for (let i = 0; i < n; i++)
  for (let c = capacity; c >= weight[i]; c--)   // backwards = each item at most once
    dp[c] = Math.max(dp[c], dp[c - weight[i]] + value[i]);
```
Forward loop on `c` = unlimited copies of each item (coin change).

### 4. Two sequences (LCS shape)

```js
if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
else                   dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
```

### 5. Interval (try every split / "what happens last")

```js
for (let len = 2; len <= n; len++)
  for (let l = 0; l + len - 1 < n; l++) {
    const r = l + len - 1;
    for (let k = l; k <= r; k++)        // k = the last thing done in [l, r]
      dp[l][r] = Math.max(dp[l][r], dp[l][k-1] + dp[k+1][r] + cost(l, k, r));
  }
```

### 6. Bitmask (which items are used)

```js
for (let mask = 0; mask < (1 << n); mask++)
  for (let i = 0; i < n; i++)
    if (!(mask & (1 << i)))                 // item i not yet used
      dp[mask | (1 << i)] = best(dp[mask | (1 << i)], dp[mask] + cost(mask, i));
```

### 7. State machine (an extra small dimension)

```js
hold[i]  = Math.max(hold[i-1],  free[i-1] - price[i]);
free[i]  = Math.max(free[i-1],  hold[i-1] + price[i]);
```
Use when: "cooldown", "at most k transactions", "with fee", "last colour used".

### 8. Space optimisation (rolling)

If `dp[i]` depends only on `dp[i-1]` (one row / two cells), keep only those.
Knapsack 1D, LCS two rows, grid DP one row. Always say "I can reduce this to O(W) space"
even if you don't write it.

---

## Common mistakes & edge cases

- **Wrong state meaning.** `dp[i]` = "answer for first i items" vs "answer ending exactly at i"
  are different problems (Maximum Subarray needs "ending at i"). Write the meaning as a comment.
- **Base case off by one.** Count problems start at `dp[0] = 1` (the empty way), min problems
  at `dp[0] = 0` with everything else `Infinity`, boolean at `dp[0] = true`.
- **Using `0` as "not computed"** when `0` is a valid answer. Use `undefined` / `-1`.
- **Loop order in tabulation.** Fill in dependency order. In 2D, if `dp[i][j]` reads `dp[i+1][j]`
  you must iterate `i` downwards. In interval DP you iterate by *length*.
- **Knapsack loop direction.** Backwards on capacity = 0/1; forwards = unbounded. Mixing them
  silently gives wrong answers that still "look" plausible.
- **Combinations vs permutations.** Coins outer loop / amount inner loop counts combinations;
  amount outer / coins inner counts ordered sequences (Combination Sum IV).
- **Stack overflow** with memo at n ~ 10^4+. Switch to tabulation.
- **Forgetting to return the right cell.** `dp[n]` vs `dp[n-1]`, `dp[m][n]` vs `max over the table`.
- **Integer overflow** in count problems: LeetCode asks for `% 1_000_000_007`. In JS, numbers
  are exact up to 2^53; apply the modulo at every addition.
- Edge inputs: `n = 0`, `n = 1`, empty strings, all obstacles, single cell grid,
  negative numbers in max problems (initialise with `-Infinity`, not `0`).

### Debugging a DP: print the table

```js
function printTable(dp) {
  for (const row of dp) console.log(row.map(v => String(v).padStart(4)).join(''));
}
```
Fill the table by hand for a 3-4 element input, print yours, compare cell by cell. The first
cell that differs tells you whether the bug is a base case (edges) or the transition (inside).

---

## Interview tips

Talk track that works for every DP question (about 2 minutes before writing code):

1. "Brute force is to try every choice recursively - that is exponential because ... repeats."
2. "The subproblem is ___ (state). I will define `dp[...]` = ___."
3. "At each step the choices are ___, so the recurrence is ___."
4. "Base cases: ___. The answer is in ___."
5. "That is ___ states with O(___) work each, so O(___) time and O(___) space; I can reduce
   space to ___ by keeping only the previous row."
6. Then write **memo** (closest to the brute force you described), test on the example,
   and only convert to a table if asked.

Things to clarify: value ranges (do I need BigInt / modulo?), can values be negative, is `n`
small enough for a bitmask (n <= 20), do they want the *count*, the *best value*, or the
*actual path* (reconstruction needs the full table).

If you get stuck on the state: write the brute force recursion first and look at its parameters.
Whatever changes between calls **is** the state.

---

## Study order and sub-folders

| Order | Folder | What you learn | Problems |
|-------|--------|----------------|----------|
| 1 | `29_Dynamic_Programming/01_One_Dimensional_DP/` | linear index DP, take/skip, House Robber family, state machines | 19 |
| 2 | `29_Dynamic_Programming/02_Knapsack/` | index + capacity, 0/1 vs unbounded, subset sum, target sum | 11 |
| 3 | `29_Dynamic_Programming/03_Strings_And_Sequences/` | two-pointer tables: LCS, LIS, edit distance, palindromes, regex | 16 |
| 4 | `29_Dynamic_Programming/04_Grid_DP/` | 2D movement, obstacles, reverse DP, memo DFS on a grid | 10 |
| 5 | `29_Dynamic_Programming/05_Interval_DP/` | ranges `[l, r]`, iterate by length, "last operation" trick | 8 |
| 6 | `29_Dynamic_Programming/06_Advanced_DP/` | bitmask, tree DP, digit DP, DP + binary search, DP + monotonic queue | 14 |

Each sub-folder has its own README with drawn tables and a `problems/` folder. Do them in order;
each one reuses the shapes from the previous.

Start with `dp-framework.js` here, then `29_Dynamic_Programming/01_One_Dimensional_DP/README.md`.

---

## Problems in this folder

This root folder holds the framework only; problem files live in the sub-folders.

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| - | Fibonacci & Climbing Stairs, naive -> memo -> tab -> O(1) | Easy | framework | dp-framework.js |

---

## DP pattern recognition cheat-sheet

| Problem wording | Pattern | Example | Where |
|-----------------|---------|---------|-------|
| "number of ways to reach step / position n" | 1D count | Climbing Stairs, Decode Ways | 01 |
| "max sum, cannot pick two adjacent" | 1D take/skip | House Robber | 01 |
| "min cost to reach the end, each step has a cost" | 1D min | Min Cost Climbing Stairs | 01 |
| "can the string be segmented using the dictionary" | 1D can-we | Word Break | 01 |
| "buy / sell with cooldown / fee / k times" | state machine | Stock problems | 01, 06 |
| "pick items with weights to fit a capacity" | 0/1 knapsack | Knapsack, Partition Equal Subset | 02 |
| "fewest coins / number of combinations to make amount" | unbounded knapsack | Coin Change I & II | 02 |
| "assign + / - to reach a target" | target sum transform | Target Sum | 02 |
| "longest common / shortest super- sequence of two strings" | 2D two sequences | LCS, SCS | 03 |
| "min operations to turn A into B" | edit distance | Edit Distance, Delete Operation | 03 |
| "longest increasing ..." | LIS | LIS, Russian Doll Envelopes | 03 |
| "pattern with `*` / `?` / `.` matches string" | 2D matching | Wildcard, Regex | 03 |
| "palindromic subsequence / min insertions to make palindrome" | interval on one string | Longest Palindromic Subsequence | 03 |
| "paths / min sum from top-left to bottom-right" | grid DP | Unique Paths, Min Path Sum | 04 |
| "min initial health to survive" | reverse grid DP | Dungeon Game | 04 |
| "largest square / count squares of 1s" | grid, min of 3 neighbours | Maximal Square | 04 |
| "burst / cut / merge / remove pieces, cost depends on neighbours" | interval, last operation | Burst Balloons, Cut Stick | 05 |
| "two players pick from either end" | interval game DP | Predict the Winner | 05 |
| "min cuts so every piece is a palindrome" | 1D + interval table | Palindrome Partitioning II | 05 |
| "visit every city / assign all tasks, n <= 20" | bitmask DP | TSP, Partition to K Subsets | 06 |
| "max value on a tree with parent/child restriction" | tree DP | House Robber III, Tree Cameras | 06 |
| "schedule non-overlapping jobs for max profit" | DP + binary search | Job Scheduling | 06 |
| "subsequence sum, adjacent picks at most k apart" | DP + monotonic deque | Constrained Subsequence Sum | 06 |
| "count numbers <= N with digit property" | digit DP | Unique Digits | 06 |
| "max subarray sum" | Kadane (1D ending at i) | Maximum Subarray | 01 |

---

## Practice more

Easy: Climbing Stairs (70), Fibonacci Number (509), Min Cost Climbing Stairs (746),
Pascal's Triangle (118), Best Time to Buy and Sell Stock (121), Is Subsequence (392)

Medium: House Robber (198), Coin Change (322), Longest Increasing Subsequence (300),
Longest Common Subsequence (1143), Unique Paths (62), Word Break (139), Decode Ways (91),
Partition Equal Subset Sum (416), Maximal Square (221), Longest Palindromic Substring (5),
Target Sum (494), Minimum Path Sum (64), Edit Distance (72), Jump Game (55),
Best Time to Buy and Sell Stock with Cooldown (309), Maximum Product Subarray (152)

Hard: Burst Balloons (312), Regular Expression Matching (10), Wildcard Matching (44),
Distinct Subsequences (115), Dungeon Game (174), Cherry Pickup (741),
Best Time to Buy and Sell Stock IV (188), Binary Tree Cameras (968),
Maximum Profit in Job Scheduling (1235), Shortest Superstring (943)
