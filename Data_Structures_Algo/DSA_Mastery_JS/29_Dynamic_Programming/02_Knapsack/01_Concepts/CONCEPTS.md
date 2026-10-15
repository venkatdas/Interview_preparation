# Knapsack DP

The **knapsack** family is every problem where you pick items under a **budget**.
Picture packing for a flight: each item has a weight and a "how much I want it" score,
the bag holds 20 kg, and you want the most happiness that fits. You cannot take half a
laptop, so at each item the only decision is **take it or leave it**. Dynamic programming
answers that question for every item and every remaining budget exactly once.

Read the [DP overview](../../01_Concepts/OVERVIEW.md) first for the general 5-step DP framework. This folder applies it to
the "index + capacity" state shape.

## Prerequisites

- [1D Dynamic Programming](../../01_One_Dimensional_DP/README.md) - take-or-skip, base cases, rolling arrays.
- The [DP overview](../../01_Concepts/OVERVIEW.md) - the 5-step framework.
- [Backtracking](../../../13_Backtracking/README.md) - the "try every subset" brute force that knapsack DP speeds up.

**Levels in this guide.** *Essential*: 0/1 knapsack (2D and 1D), the loop-direction rule, unbounded
knapsack, subset sum / partition, target-sum transformation, combinations vs permutations.
*Advanced*: bounded knapsack by binary splitting, two-capacity knapsack, reconstructing the chosen items.

---

## Why it matters / when to use

Reach for knapsack when the problem has any of these signals:

- A list of items with a **cost** (weight, size, count) and a **budget / capacity / target**
- "Maximum value you can fit", "minimum coins to reach", "number of ways to make amount"
- "Can the array be split into two parts with equal sum?" (subset sum)
- "Assign + or - to each number so they sum to target" (target sum)
- "Choose a subset of strings/jobs/stones" with a limit on how many resources they use
- Items used **once** -> 0/1 knapsack. Items **reusable** -> unbounded knapsack.
- Capacity is a smallish integer (<= ~10^4). If it is huge, DP on capacity is out.

---

## How it works

### 0/1 knapsack (each item at most once)

State: `dp[i][c]` = best value using only the **first i items** with capacity **c**.
For item i you either skip it (answer is the row above) or take it (its value plus the
best you could do with the leftover room, **using only earlier items**).

```
dp[i][c] = max( dp[i-1][c],                           // skip
                value[i] + dp[i-1][c - weight[i]] )   // take, only if weight[i] <= c
```

Table for weights = [1, 3, 4], values = [1, 4, 5], capacity = 5:

```
                 capacity c ->
                 0    1    2    3    4    5
 no items   i=0  0    0    0    0    0    0
 w1 v1      i=1  0    1    1    1    1    1
 w3 v4      i=2  0    1    1    4    5    5     dp[2][4] = max(dp[1][4]=1, 4 + dp[1][1]=1) = 5
 w4 v5      i=3  0    1    1    4    5    6     dp[3][5] = max(dp[2][5]=5, 5 + dp[2][1]=1) = 6
                                          ^
                                       answer
```

Every cell looks only at the row **directly above** it: straight up (skip) or up-and-left by
`weight` (take). That is why one row is enough.

### The 1D reversed-loop trick

Keep a single row `dp[c]`. For each item, update capacities from **high to low**:

```js
for (const item of items)
  for (let c = capacity; c >= item.weight; c--)       // DOWNWARD
    dp[c] = Math.max(dp[c], item.value + dp[c - item.weight]);
```

Why downward? When we compute `dp[c]` we read `dp[c - weight]`, a **smaller** index.
Walking down means the smaller indexes have **not been touched yet** for this item, so
`dp[c - weight]` is still "the previous row" = the answer *without* the current item.
The item is therefore counted at most once.

```
item w=2 v=3, capacity 4, dp before = [0 0 0 0 0]

walking DOWN:  c=4: dp[4] = max(0, 3 + dp[2]=0) = 3
               c=3: dp[3] = max(0, 3 + dp[1]=0) = 3
               c=2: dp[2] = max(0, 3 + dp[0]=0) = 3      -> [0 0 3 3 3]  correct (one copy)

walking UP:    c=2: dp[2] = 3
               c=3: dp[3] = 3
               c=4: dp[4] = max(0, 3 + dp[2]=3) = 6      -> [0 0 3 3 6]  item used TWICE
```

### Unbounded knapsack (unlimited copies) = the same loop, walking UP

```js
for (const item of items)
  for (let c = item.weight; c <= capacity; c++)        // UPWARD
    dp[c] = Math.max(dp[c], item.value + dp[c - item.weight]);
```

Now `dp[c - weight]` **may already contain** the current item, which is exactly what we
want: taking it again is allowed. The "bug" from the box above becomes the feature.

### Bounded knapsack (item i available k_i times) - Advanced

Split each item into pieces of size 1, 2, 4, ..., remainder (binary splitting). Any count
0..k can be built from those pieces, so run plain 0/1 knapsack on the pieces:
O(n * log k * capacity). You will rarely be asked this; just know the trick exists.

### Subset sum / partition = knapsack with weight == value and a yes/no answer

"Can some subset sum to target?" is 0/1 knapsack where the capacity must be filled
**exactly** and we only track reachability:

```js
dp[0] = true;
for (const num of nums)
  for (let s = target; s >= num; s--) dp[s] = dp[s] || dp[s - num];
```

Partition Equal Subset Sum = subset sum with `target = total / 2`.
Minimum Subset Sum Difference / Last Stone Weight II = find the reachable sum closest
to `total / 2`, answer is `total - 2 * thatSum`.

### The "target sum" transformation

Assign + / - to every number so the expression equals `target`. Let P be the sum of the
"+" numbers and N the sum of the "-" numbers:

```
P - N = target
P + N = total          =>  P = (total + target) / 2
```

So "how many sign assignments" becomes "how many subsets sum to P" - counting subset
sum. If `total + target` is odd or negative, the answer is 0.

---

## Pseudocode (Essential)

```
knapsack01(weights, values, W):
    dp <- array of W + 1 zeros            # dp[c] = best value with capacity c, items seen so far
    for each item (w, v):
        for c from W down to w:           # DOWN = each item at most once
            dp[c] <- max(dp[c], v + dp[c - w])
    return dp[W]

knapsackUnbounded(weights, values, W):
    same, but: for c from w UP to W       # UP = item may be reused

subsetCount(nums, S):                     # "how many subsets sum to S"
    dp <- array of S + 1 zeros; dp[0] <- 1
    for each num: for s from S down to num: dp[s] <- dp[s] + dp[s - num]
    return dp[S]
```

---

## Dry run (Essential) - 1D 0/1 knapsack, weights = [1, 3, 4], values = [1, 4, 5], W = 5

Each row shows the single `dp` array **after** processing that item (capacity walked 5 -> w).

| step | item (w, v) | updates made (c: old -> new) | dp[0..5] after |
|------|-------------|------------------------------|----------------|
| start | - | - | [0, 0, 0, 0, 0, 0] |
| 1 | (1, 1) | c=5..1: each becomes max(0, 1 + dp[c-1]=0) = 1 | [0, 1, 1, 1, 1, 1] |
| 2 | (3, 4) | c=5: max(1, 4+dp[2]=1)=5; c=4: max(1, 4+dp[1]=1)=5; c=3: max(1, 4+dp[0]=0)=4 | [0, 1, 1, 4, 5, 5] |
| 3 | (4, 5) | c=5: max(5, 5+dp[1]=1)=6; c=4: max(5, 5+dp[0]=0)=5 | [0, 1, 1, 4, 5, 6] |

Answer `dp[5] = 6` (items of weight 1 and 4). Because `c` walks downward, `dp[c - w]` is always
read before it is overwritten for the same item, so no item is used twice. It matches the 2D table
above row for row.

---

## Operations & complexity

| Variant | Time | Space | Note |
|---------|------|-------|------|
| 0/1 knapsack, 2D table | O(n * W) | O(n * W) | W = capacity; draw this one on the whiteboard |
| 0/1 knapsack, 1D | O(n * W) | O(W) | capacity loop runs downward |
| unbounded knapsack | O(n * W) | O(W) | capacity loop runs upward |
| bounded knapsack (binary split) | O(n * log k * W) | O(W) | rarely asked |
| subset sum / partition | O(n * S) | O(S) | S = target sum, boolean table |
| count subsets / target sum | O(n * S) | O(S) | counting table, dp[0] = 1 |
| 2-capacity knapsack (Ones and Zeroes) | O(n * M * N) | O(M * N) | both capacity loops downward |
| brute force (all subsets) | O(2^n) | O(n) | fine for n <= 20 |

"Pseudo-polynomial": the running time depends on the **numeric value** of the capacity,
not just the number of items. That is why the capacity must be a small integer.

---

## JavaScript implementation

Full code with tests: [knapsack.js](../02_Implementations/knapsack.js). Core idea:

```js
function knapsack01(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++)
    for (let c = capacity; c >= weights[i]; c--)              // down: use once
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
  return dp[capacity];
}

function knapsackUnbounded(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++)
    for (let c = weights[i]; c <= capacity; c++)              // up: reuse
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
  return dp[capacity];
}
```

[knapsack.js](../02_Implementations/knapsack.js) also contains the 2D `knapsack01Table`, `subsetSum` and `countSubsets`.
Run it with `node 02_Implementations/knapsack.js`; the topic tests compare every function against a brute force
that tries all subsets.

---

## Patterns / variations

### 1. Boolean vs counting vs min/max - what goes in `dp[0]`?

The same loop solves three different questions. Only the **initial value** and the
**combine operation** change:

| Question | dp init | dp[0] | combine |
|----------|---------|-------|---------|
| Can we make sum s? | `false` | `true` | `dp[s] = dp[s] \|\| dp[s-num]` |
| How many ways to make s? | `0` | `1` | `dp[s] += dp[s-num]` |
| Max value with capacity c? | `0` | `0` | `dp[c] = max(dp[c], v + dp[c-w])` |
| Min coins to make s? | `Infinity` | `0` | `dp[s] = min(dp[s], 1 + dp[s-coin])` |

For min problems, the `Infinity` init is what marks "impossible"; check for it at the end.

### 2. Combinations vs permutations - order of the two loops

```js
// Coin Change II: {1,2} and {2,1} are the SAME -> coins OUTER
for (const coin of coins)
  for (let a = coin; a <= amount; a++) dp[a] += dp[a - coin];

// Combination Sum IV: [1,2] and [2,1] are DIFFERENT -> amount OUTER
for (let a = 1; a <= amount; a++)
  for (const num of nums) if (num <= a) dp[a] += dp[a - num];
```

Coins outer means each coin is "introduced" once, so every multiset is counted in one
fixed coin order. Amount outer asks "what is the last element?" for every total, so
every ordering counts separately.

### 3. Exact fill vs at-most fill

"At most capacity" -> init everything to 0, answer `dp[capacity]`.
"Exactly capacity" -> init to `-Infinity` except `dp[0] = 0`, so unreachable sums stay
impossible and cannot be built upon.

### 4. Two capacities (Advanced)

Ones and Zeroes has a budget of zeros AND ones. The table becomes `dp[z][o]` and **both**
loops run downward for the 0/1 rule. Same idea, one more dimension.

### 5. Reconstructing which items were taken (Advanced)

Keep the 2D table. Start at `dp[n][capacity]`; if `dp[i][c] !== dp[i-1][c]` item i was
taken, subtract its weight and move up a row; otherwise just move up.

---

## Alternatives (Essential)

| Approach | Time | Space | When it wins |
|----------|------|-------|--------------|
| Try every subset (bitmask / recursion) | O(2^n * n) | O(n) | n <= 20; any weights, even huge or negative |
| Memoized recursion on (i, capacity) | O(n * W) | O(n * W) + stack | quick to write; only visits reachable states |
| 2D table | O(n * W) | O(n * W) | you must reconstruct which items were taken |
| 1D table | O(n * W) | O(W) | default answer in interviews |
| Meet in the middle | O(2^(n/2) * n) | O(2^(n/2)) | n around 30-40 with huge weights (see [Classic Techniques](../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/README.md)) |
| Greedy by value/weight | O(n log n) | O(1) | ONLY fractional knapsack (items can be split); wrong for 0/1 |
| Bitset subset sum | O(n * S / 32) | O(S / 32) | boolean subset sum with big S; shift-or trick |

---

## When knapsack does NOT apply (Essential)

- **Capacity is huge** (10^9) or not an integer: the table cannot be indexed by capacity. Try
  meet in the middle, greedy (if fractional), or swap roles (DP over value instead of weight).
- **Items can be split** - that is fractional knapsack, solved greedily by value/weight ratio.
- **Order matters AND items interact beyond the budget** (e.g. "no two adjacent", deadlines):
  you need a different state (House Robber, job scheduling with sorting + binary search).
- **Negative weights**: shift the sums by an offset or use a Map keyed by sum.
- **You must output every subset** - backtracking, because the output itself is exponential.

---

## Common mistakes & edge cases

- **Wrong loop direction.** Downward = each item once, upward = unlimited. Mixing these up
  is the number one knapsack bug and tests often will not catch it.
- Forgetting `dp[0] = 1` for counting problems or `dp[0] = true` for boolean ones. With
  `dp[0] = 0`/`false` every answer is 0.
- Min problems: initialising with `0` instead of `Infinity`, which makes every sum "free".
- Off-by-one: the table has `capacity + 1` columns (0..capacity) and `n + 1` rows.
- Target Sum: `(total + target)` odd, or `|target| > total` -> 0, not a crash.
- Zeros in the input double the number of subsets (`+0` and `-0` are different choices).
- Partition: an odd total can be rejected instantly.
- Capacity huge (10^9) -> knapsack DP will not work; look for greedy or a different state.

---

## Interview tips

- Name the variant out loud: "This is 0/1 knapsack because each item is used once" or
  "unbounded, because coins are unlimited". Interviewers want to hear the classification.
- Write the recurrence BEFORE the code: `dp[i][c] = max(skip, take)`. Then say "row i
  depends only on row i-1, so I can drop to one row if I iterate capacity backwards."
- For subset sum / partition / target sum, show the transformation to knapsack explicitly;
  that transformation IS the interview.
- Say "pseudo-polynomial, O(n * capacity)" and point out it is fine because capacity is small.
- If asked "which items?", mention you would keep the 2D table and walk back from the end.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | 0/1 Knapsack (basic) | Medium | 0/1 knapsack, max value | [01_knapsack_01_basic.js](../03_Problems/solutions/01_knapsack_01_basic.js) |
| 02 | Unbounded Knapsack (basic) | Medium | unbounded, forward loop | [02_unbounded_knapsack_basic.js](../03_Problems/solutions/02_unbounded_knapsack_basic.js) |
| 03 | Partition Equal Subset Sum (416) | Medium | subset sum (boolean) | [03_subset_sum_partition_equal.js](../03_Problems/solutions/03_subset_sum_partition_equal.js) |
| 04 | Coin Change (322) | Medium | unbounded, min variant | [04_coin_change_min_coins.js](../03_Problems/solutions/04_coin_change_min_coins.js) |
| 05 | Coin Change II (518) | Medium | unbounded, count combinations | [05_coin_change_ii.js](../03_Problems/solutions/05_coin_change_ii.js) |
| 06 | Combination Sum IV (377) | Medium | unbounded, count permutations | [06_combination_sum_iv.js](../03_Problems/solutions/06_combination_sum_iv.js) |
| 07 | Target Sum (494) | Medium | transform to count subsets | [07_target_sum.js](../03_Problems/solutions/07_target_sum.js) |
| 08 | Last Stone Weight II (1049) | Medium | subset sum closest to half | [08_last_stone_weight_ii.js](../03_Problems/solutions/08_last_stone_weight_ii.js) |
| 09 | Minimum Subset Sum Difference | Medium | subset sum closest to half | [09_minimum_subset_sum_difference.js](../03_Problems/solutions/09_minimum_subset_sum_difference.js) |
| 10 | Rod Cutting | Medium | unbounded knapsack | [10_rod_cutting.js](../03_Problems/solutions/10_rod_cutting.js) |
| 11 | Ones and Zeroes (474) | Medium | 0/1 knapsack, 2 capacities | [11_ones_and_zeroes.js](../03_Problems/solutions/11_ones_and_zeroes.js) |

Suggested order: 01 -> 02 -> 03 -> 04 -> 05 -> 06 (loop-order lesson) -> 07 -> 08/09 -> 10 -> 11.

---

## Practice more

Medium: Perfect Squares (279), Minimum Cost For Tickets (983), Partition Equal Subset Sum (416),
Coin Change (322), Coin Change II (518), Combination Sum IV (377), Target Sum (494),
Last Stone Weight II (1049), Ones and Zeroes (474), Number of Dice Rolls With Target Sum (1155),
Minimum Number of Refueling Stops (871)

Hard: Profitable Schemes (879), Tallest Billboard (956), Form Largest Integer With Digits
That Add up to Target (1449), Partition Array Into Two Arrays to Minimize Sum Difference (2035),
Number of Ways to Earn Points (2585)
