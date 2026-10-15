# 1D Dynamic Programming

**1D DP** is dynamic programming where the state is a single number: an index `i`, an amount, a
step count. You walk a line from left to right, and at every position you make **one decision**
("take this or skip it", "jump 1 or jump 2", "buy, sell, or wait") and remember the best result
so far. Think of climbing a staircase and writing on every step how many ways you had to get there.
The number on step 10 is just the number on step 9 plus the number on step 8. You never re-count.

This is the first DP family to learn because every other family (knapsack, grids, strings) is
this idea with a bigger state. Read the [DP overview](../../01_Concepts/OVERVIEW.md) first for the 5-step framework; this folder
applies it to the simplest shape.

## Prerequisites

- [Backtracking](../../../13_Backtracking/README.md) - you must be able to write the plain recursion first; DP is that recursion plus a cache.
- [Hashing](../../../05_Hashing/README.md) - memoization uses a `Map` keyed by the state.
- [Complexity Analysis](../../../01_Complexity_Analysis) - "number of states x work per state".
- The [DP overview](../../01_Concepts/OVERVIEW.md) - the 5-step framework used on every page here.

**Levels in this guide.** *Essential* (every interview): take-or-skip, the three question types,
rolling variables, Fibonacci / House Robber / Coin Change / Kadane patterns. *Advanced*: state
machines with several states, DP on bits, proving a greedy shortcut (Jump Game) is safe.

---

## Why it matters / when to use

Reach for 1D DP when the problem has these signals:

- "How many ways to reach / build / decode ..." (**count** variant)
- "Minimum cost / maximum profit to reach the end" (**min/max** variant)
- "Can you reach the last index / segment the string?" (**can we** variant)
- Each step depends on **a few previous steps** (`i-1`, `i-2`, or "all `j < i`")
- There is a **choice at each element**: take it or skip it, with a rule like "no two adjacent"
- The input is a **row** of things: stairs, houses, days, digits, characters
- A greedy idea *almost* works but breaks on some inputs (House Robber, Decode Ways)

---

## How it works

### The "take or skip" decision

House Robber is the model problem. At each house you either rob it (and then you could **not**
have robbed the previous one) or you skip it (and keep whatever the previous best was).

```
nums = [2, 7, 9, 3, 1]

dp[i] = best money using the first i houses

      i:   0    1    2    3    4    5
 houses:  (none) [2] [2,7] [2,7,9] [..3] [..1]
   dp :    0    2    7    11   11   12
                 ^    ^     ^
                 |    |     dp[3] = max( dp[2]=7 (skip 9),  dp[1]+9 = 11 (take 9) )
                 |    dp[2] = max( dp[1]=2 (skip 7),  dp[0]+7 = 7 (take 7) )
                 dp[1] = 2
```

The recurrence `dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])` reads as
"**skip** this house or **take** it on top of the best from two houses back".

### Direction: forward table or backward recursion

```
Top-down (memo):  solve(0) asks solve(1) and solve(2), which ask solve(2), solve(3) ...
                  -> recursion goes RIGHT, answers come back LEFT, cache stops repeats

Bottom-up (tab):  dp[0], dp[1] are known. Fill dp[2], dp[3], ... dp[n] in a loop.
                  -> each cell only needs cells already filled
```

Both give the same table. Tabulation is usually faster (no call stack); memo is usually easier
to write first.

### The three question types

| Question wording | Combine sub-answers with | Base case | Example |
|------------------|---------------------------|-----------|---------|
| "How many ways" | `+` | `dp[0] = 1` (one way to do nothing) | Climbing Stairs, Decode Ways |
| "Min / max" | `Math.min` / `Math.max` | `dp[0] = 0` | House Robber, Coin Change |
| "Can we / is it possible" | `||` (OR) | `dp[0] = true` | Jump Game, Word Break |

Only the combine operator and the base case change. The loop is identical.

### State machine DP (when "index" is not enough) - Advanced

Sometimes knowing where you are is not enough; you also need **what state you are in**.
Stock with cooldown: on day `i` are you holding a share, in cooldown, or free to buy?
Draw the states and the arrows between them, then write one `dp` array per state.

```
   HOLDING --sell--> COOLDOWN --wait--> FREE --buy--> HOLDING
      ^ (hold)                           ^ (wait)
```

```
holding[i]  = max(holding[i-1], free[i-1] - price[i])
cooldown[i] = holding[i-1] + price[i]
free[i]     = max(free[i-1], cooldown[i-1])
```

Paint House is the same idea with three "colour" states.

### Rolling the table down to two variables

When `dp[i]` only reads `dp[i-1]` and `dp[i-2]`, you do not need the whole array:

```
          twoBack  oneBack   current
step i:   dp[i-2]  dp[i-1]   dp[i]
step i+1:          dp[i-1]   dp[i]      <- slide: twoBack = oneBack, oneBack = current
```

O(n) space becomes O(1). Do this **last**, after the full table works.

---

## Pseudocode (Essential)

The same skeleton solves every 1D DP. Only the four marked lines change between problems.

```
function solve(input):
    n  <- size of the line (houses, stairs, days, amount ...)
    dp <- array of n + 1 cells filled with NEUTRAL        # 0 for max/count, Infinity for min, false for "can we"
    dp[0] <- BASE                                         # 1 for count, 0 for min/max, true for "can we"
    for i from 1 to n:
        for each allowed previous state j of i:          # i-1 and i-2, or every j < i, or i - coin ...
            dp[i] <- COMBINE(dp[i], dp[j] (+ cost of the move j -> i))
    return ANSWER                                          # usually dp[n]; max(dp) for Kadane
```

---

## Dry run (Essential) - Min Cost Climbing Stairs, `cost = [10, 15, 20]`

`dp[i]` = cheapest way to stand on step `i` (the top is step 3). You may start on step 0 or 1 for free,
so `dp[0] = dp[1] = 0`. Recurrence: `dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])`.

| i | from i-1: dp[i-1] + cost[i-1] | from i-2: dp[i-2] + cost[i-2] | dp[i] | rolled vars after step (twoBack, oneBack) |
|---|-------------------------------|-------------------------------|-------|-------------------------------------------|
| 0 | - | - | 0 | (-, 0) |
| 1 | - | - | 0 | (0, 0) |
| 2 | 0 + 15 = 15 | 0 + 10 = 10 | **10** | (0, 10) |
| 3 | 10 + 20 = 30 | 0 + 15 = 15 | **15** | (10, 15) |

Answer `dp[3] = 15`: start on step 1, pay 15, jump two steps to the top. Notice each row only read
the two rows above it - that is why two variables are enough.

---

## Operations & complexity

| Pattern | Time | Space | Note |
|---------|------|-------|------|
| Fibonacci-style (`i-1`, `i-2`) | O(n) | O(n) -> O(1) | roll to two variables |
| Look back at all `j < i` (Word Break, LIS) | O(n^2) | O(n) | cannot roll |
| Amount DP with k coins (Coin Change) | O(amount * k) | O(amount) | unbounded knapsack view in [Knapsack DP](../../02_Knapsack/01_Concepts/CONCEPTS.md) |
| State machine with s states | O(n * s) | O(s) | one variable per state |
| Plain recursion without memo | O(2^n) or worse | O(n) stack | only for learning |

Total cost is always **(number of states) x (work per transition)**.

---

## JavaScript implementation

There is no data structure here, only the four stages. Every problem file has them:

```js
// 1. bruteForce: plain recursion straight from the recurrence
function bruteForce(nums) {
  function robFrom(index) {
    if (index >= nums.length) return 0;
    return Math.max(robFrom(index + 1), nums[index] + robFrom(index + 2));
  }
  return robFrom(0);
}

// 2. memo: same recursion + a Map so each index is solved once
// 3. tabulation: dp array filled left to right
function tabulation(nums) {
  const dp = new Array(nums.length + 1).fill(0);
  dp[1] = nums[0];
  for (let i = 2; i <= nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
  }
  return dp[nums.length];
}

// 4. optimized: two rolling variables
function optimized(nums) {
  let twoBack = 0, oneBack = 0;
  for (const money of nums) {
    const current = Math.max(oneBack, twoBack + money);
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}
```

See [dp_framework.js](../../02_Implementations/dp_framework.js) for the same four stages on Fibonacci with timings.
Every solution in [03_Problems/solutions](../03_Problems/solutions) exports `bruteForce`, `memo`,
`tabulation` and (usually) `optimized`, so you can compare them side by side.

---

## Patterns / variations

### 1. Fibonacci family (count ways with fixed step sizes)

```js
// Climbing Stairs: dp[i] = dp[i-1] + dp[i-2]
function climbStairs(n) {
  let twoBack = 1, oneBack = 1;
  for (let step = 2; step <= n; step++) {
    [twoBack, oneBack] = [oneBack, oneBack + twoBack];
  }
  return oneBack;
}
```
Use when: steps of size 1/2/3, tribonacci, tiling problems.

### 2. House Robber family (take or skip, no two adjacent)

```js
dp[i] = Math.max(dp[i - 1], dp[i - 2] + value[i]);
```
Use when: "cannot pick adjacent", "picking x deletes x-1 and x+1" (Delete and Earn),
circular versions (run twice: without first house, without last house).

### 3. Reach the end (min cost / can reach / fewest moves)

```js
// Min Cost Climbing Stairs: dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
// Jump Game:                dp[i] = any dp[j] for j in i+1..i+nums[i]
// Jump Game II:             dp[i] = 1 + min dp[j] for j in i+1..i+nums[i]
```
Use when: you move along an array with allowed moves. Jump Game I and II also have **greedy**
O(n) solutions; know both and explain why greedy is safe (reachability is monotone).

### 4. Split-the-prefix (look back at every j < i)

```js
// Word Break: dp[end] = some start < end where dp[start] && dict.has(s.slice(start, end))
for (let end = 1; end <= n; end++) {
  for (let start = 0; start < end; start++) {
    if (dp[start] && words.has(s.slice(start, end))) { dp[end] = true; break; }
  }
}
```
Use when: "can the string be segmented", Decode Ways (look back 1 and 2), Perfect Squares
(look back by every square), Integer Break (every first part).

### 5. Amount DP (Coin Change shape)

```js
// dp[a] = fewest coins to make amount a
for (let a = 1; a <= amount; a++)
  for (const coin of coins)
    if (coin <= a) dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
```
Use when: unlimited items, target amount. This is **unbounded knapsack**; the 2D view and the
"count ways" variant live in [Knapsack DP](../../02_Knapsack/01_Concepts/CONCEPTS.md).

### 6. State machine (index + what state I am in) (Advanced)

```js
// Stock with fee: two states
holding = Math.max(holding, free - price);
free    = Math.max(free, holding + price - fee);   // careful: use the OLD holding
```
Use when: buy/sell/cooldown, paint house (colour = state), "last action was X" constraints.

### 7. Kadane (best subarray ending here)

```js
bestEndingHere = Math.max(nums[i], bestEndingHere + nums[i]);
best = Math.max(best, bestEndingHere);
```
Use when: contiguous subarray max sum / product. Note the answer is the **max over all cells**,
not the last cell.

### 8. DP on bits (Advanced)

```js
dp[i] = dp[i >> 1] + (i & 1);   // Counting Bits
```
Use when: a number's answer depends on a smaller number obtained by shifting or clearing a bit.

---

## Alternatives (Essential)

| Approach | Time | Space | When to use it |
|----------|------|-------|----------------|
| Plain recursion (brute force) | O(2^n) or worse | O(n) stack | only to discover the recurrence; say it out loud, then improve |
| Memoization (top-down) | O(states x transitions) | O(n) table + O(n) stack | fastest to write; natural when only some states are reachable |
| Tabulation (bottom-up) | same | O(n) | no recursion depth limit (JS stack overflows near ~10^4 frames) |
| Rolling variables | same | O(1) | when `dp[i]` reads a fixed number of previous cells |
| Greedy | often O(n) | O(1) | only when you can prove the local choice is safe (Jump Game, Kadane); otherwise it fails (House Robber, Coin Change) |
| BFS on states | O(states + edges) | O(states) | "fewest moves" with all moves costing 1 (Jump Game II, Perfect Squares) |

---

## When 1D DP does NOT apply (Essential)

- **The choice depends on more than the position.** If you need "how much capacity is left" or
  "which items are already used", the state is 2D (knapsack) or a bitmask (Advanced DP).
- **Two sequences are compared** (edit distance, LCS) - that is [Strings and Sequences DP](../../03_Strings_And_Sequences/01_Concepts/CONCEPTS.md).
- **No overlapping sub-problems.** If every sub-problem is visited once (e.g. merge sort), a cache
  buys nothing - it is divide and conquer.
- **You must list every solution** (all decodings, all partitions). The output itself is exponential,
  so use backtracking; DP can only count them.
- **A simple greedy is provably correct** (Best Time to Buy and Sell Stock I, Jump Game). DP still
  works but is not the expected answer.
- **The "line" has cycles** (moves can go back and forth). Then it is a graph shortest-path problem.

---

## Common mistakes & edge cases

- **Off-by-one between "first i items" and "index i".** Decide once: `dp[i]` = answer for the
  first `i` elements (so `dp[0]` is the empty case) and `nums[i-1]` is the i-th element.
- **Wrong base case for counting.** "Ways to make 0" is **1**, not 0. Otherwise every count is 0.
- **Returning the last cell when the answer is the max over all cells** (Maximum Subarray).
- **Using `0` as "impossible" in a min problem.** Use `Infinity` in the table and convert to `-1`
  at the end (Coin Change).
- **Rolling variables in the wrong order.** Compute every new value from the OLD values first,
  then assign (use temporaries, or destructuring).
- **Memo key collisions** when the state has two parts. Pack as `day * 2 + holding` or use a
  string key `${day},${holding}`.
- **Forgetting the empty / single-element input**: `[]`, `[5]`, `n = 0`, `n = 1`.
- **Circular constraints** (House Robber II): solve two linear sub-problems, do not try to
  patch one loop.
- **Brute force is for the explanation only.** Keep its test inputs small (n <= 20) or it never
  finishes.

---

## Interview tips

- Say the state out loud first: "Let dp[i] be the best profit using the first i days."
  If you cannot say it in one sentence, the state is wrong.
- Then the recurrence as a **decision**: "At house i, I either skip it or take it."
- Then base cases, then the answer location (last cell? max over cells? dp[0] for backward DP?).
- Write the memoized recursion first if you are unsure; convert to a table once it passes.
- Finish with: "Each state is O(1) work and there are n states, so O(n). I only read i-1 and
  i-2, so I can drop the array to two variables -> O(1) space."
- If a greedy answer exists (Jump Game), mention it and **explain why it is safe**.
- Dry-run a 4-5 element example on the whiteboard; a tiny table catches most off-by-one errors.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Fibonacci Number | Easy | fibonacci family | [01_fibonacci_number.js](../03_Problems/solutions/01_fibonacci_number.js) |
| 02 | Climbing Stairs | Easy | fibonacci / count ways | [02_climbing_stairs.js](../03_Problems/solutions/02_climbing_stairs.js) |
| 03 | Min Cost Climbing Stairs | Easy | reach the end, min cost | [03_min_cost_climbing_stairs.js](../03_Problems/solutions/03_min_cost_climbing_stairs.js) |
| 04 | N-th Tribonacci Number | Easy | fibonacci (3 back) | [04_nth_tribonacci.js](../03_Problems/solutions/04_nth_tribonacci.js) |
| 05 | House Robber | Medium | take or skip | [05_house_robber.js](../03_Problems/solutions/05_house_robber.js) |
| 06 | House Robber II | Medium | take or skip, circular | [06_house_robber_ii.js](../03_Problems/solutions/06_house_robber_ii.js) |
| 07 | Delete and Earn | Medium | house robber in disguise | [07_delete_and_earn.js](../03_Problems/solutions/07_delete_and_earn.js) |
| 08 | Maximum Subarray | Medium | Kadane / best ending here | [08_maximum_subarray.js](../03_Problems/solutions/08_maximum_subarray.js) |
| 09 | Counting Bits | Easy | DP on bits | [09_counting_bits.js](../03_Problems/solutions/09_counting_bits.js) |
| 10 | Decode Ways | Medium | count ways, look back 1 and 2 | [10_decode_ways.js](../03_Problems/solutions/10_decode_ways.js) |
| 11 | Jump Game | Medium | can reach (DP vs greedy) | [11_jump_game.js](../03_Problems/solutions/11_jump_game.js) |
| 12 | Jump Game II | Medium | fewest moves (DP vs greedy BFS) | [12_jump_game_ii.js](../03_Problems/solutions/12_jump_game_ii.js) |
| 13 | Paint House | Medium | state machine (3 colours) | [13_paint_house.js](../03_Problems/solutions/13_paint_house.js) |
| 14 | Perfect Squares | Medium | amount DP | [14_perfect_squares.js](../03_Problems/solutions/14_perfect_squares.js) |
| 15 | Coin Change | Medium | amount DP (unbounded) | [15_coin_change.js](../03_Problems/solutions/15_coin_change.js) |
| 16 | Integer Break | Medium | split the number | [16_integer_break.js](../03_Problems/solutions/16_integer_break.js) |
| 17 | Word Break | Medium | split the prefix | [17_word_break.js](../03_Problems/solutions/17_word_break.js) |
| 18 | Best Time to Buy and Sell Stock with Cooldown | Medium | state machine | [18_stock_with_cooldown.js](../03_Problems/solutions/18_stock_with_cooldown.js) |
| 19 | Best Time to Buy and Sell Stock with Transaction Fee | Medium | state machine | [19_stock_with_transaction_fee.js](../03_Problems/solutions/19_stock_with_transaction_fee.js) |

---

## Practice more

Easy: Pascal's Triangle (118), Is Subsequence (392), Divisor Game (1025),
Best Time to Buy and Sell Stock (121)

Medium: Longest Increasing Subsequence (300), Maximum Product Subarray (152), Arithmetic Slices (413),
Domino and Tromino Tiling (790), Minimum Cost For Tickets (983), Partition Array for Maximum Sum (1043),
Count Sorted Vowel Strings (1641), Number of Dice Rolls With Target Sum (1155), Combination Sum IV (377),
Best Time to Buy and Sell Stock II (122), Longest Arithmetic Subsequence (1027)

Hard: Best Time to Buy and Sell Stock III (123), Frog Jump (403), Student Attendance Record II (552)
