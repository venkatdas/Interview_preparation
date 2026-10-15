# Advanced DP

You already know the classic shapes: 1D index, 2D grid, knapsack, strings, intervals
(see the [DP overview](../../01_Concepts/OVERVIEW.md) for the 5-step framework). **Advanced DP** is not a new idea. It is
the same "state + recurrence + base case" recipe applied to states that look scary at
first: a **subset** packed into an integer, a **node of a tree**, the **digits** of a
number, a **finite state machine** glued onto an index. Think of it like learning to cook:
once you know how to fry, bake and boil, "advanced" recipes are just those three steps
with unusual ingredients.

---

## Prerequisites

- [1D DP](../../01_One_Dimensional_DP/README.md) and [Knapsack](../../02_Knapsack/README.md) — the basic recipe and the subset-sum idea behind bitmask partitions.
- [Bit Manipulation](../../../14_Bit_Manipulation/README.md) — `mask & (1 << i)`, `mask | (1 << i)`, iterating subsets.
- [Binary trees](../../../20_Trees/01_Binary_Trees/README.md) — post-order DFS for tree DP.
- [Monotonic deque](../../../18_Monotonic_Stacks_And_Queues/README.md) and [binary search](../../../10_Searching/README.md) — the two speed-ups used here.

**Essential vs Advanced:** tree DP (return a tuple from post-order) and state-machine DP (stock problems) are **Essential** for top-tier interviews. DP + binary search (job scheduling) is **Essential** too. Bitmask DP, digit DP and DP + monotonic deque are **Advanced** — expect them in hard rounds only.

---

## Why it matters / when to use

Reach for one of these patterns when you see:

- `n <= 15` or `n <= 20` in the constraints, with "every subset / assign / order / visit all"
  -> **bitmask DP** (2^n states fit in memory)
- A tree where the answer for a node depends only on its **children's answers**
  -> **tree DP** (post-order, return a tuple per node)
- "Count numbers in [L, R] whose digits satisfy ..." -> **digit DP**
- "Buy / sell / cooldown / at most k transactions", "hold or not hold", "last action was ..."
  -> **state machine DP**
- "Pick non-overlapping jobs/intervals with weights" with big coordinates
  -> **DP + binary search** (sort by end, jump to the last compatible one)
- "dp[i] depends on max/min of dp[i-k..i-1]" with n up to 10^5
  -> **DP + monotonic deque** (sliding window max over the dp array)
- "Maximum subarray" -> **Kadane**, which is a 1-state DP in disguise

---

## How it works

### 1. Bitmask DP: a subset is an integer

With n <= ~20 items, every subset can be written as an n-bit integer. Bit i is 1 if item i
is "in". The subset becomes the DP **state index**.

```
items:  A B C D      (n = 4)
mask 0b1010 = 10  -> {B, D}    bit 1 and bit 3 set

check bit i   :  (mask >> i) & 1      or   mask & (1 << i)
set bit i     :  mask | (1 << i)
clear bit i   :  mask & ~(1 << i)
all items     :  (1 << n) - 1
count of bits :  popcount loop, or cache it
```

Typical recurrence: `dp[mask] = best over i in mask of dp[mask without i] + cost(i)`.
There are `2^n` states and each does `O(n)` work -> **O(2^n * n)**. For
Travelling-Salesman style problems the state is `dp[mask][last]` -> `O(2^n * n^2)`.

Iterating all **submasks** of a mask (needed for "split this set into two groups"):

```js
for (let sub = mask; sub; sub = (sub - 1) & mask) {
  // sub is a non-empty submask of mask; the trick (sub - 1) & mask
  // "counts down" inside the bits of mask only
}
```
Over all masks this totals 3^n steps, still fine for n <= 15.

See [Bit Manipulation](../../../14_Bit_Manipulation/README.md) for bit tricks.

### 2. DP on trees: post-order returns a tuple

A tree is already a DAG, so the "order of computation" is simply **children before
parent** (post-order DFS). Each node returns a small tuple of answers under different
conditions, and the parent combines its children's tuples.

```
            root
           /    \                 dfs(node):
        left    right               leftTuple  = dfs(node.left)
       /   \                        rightTuple = dfs(node.right)
     ...   ...                      return combine(node, leftTuple, rightTuple)
```

House Robber III returns `[skipThisNode, takeThisNode]`. Binary Tree Cameras returns
`[hasCamera, coveredByChild, notCovered]`. Diameter returns one number (longest path
going down) and updates a global best with "left + right" at every node.

**Rerooting** (intro): when the question is "answer for EVERY node as root", do one
post-order pass to get subtree answers, then one pre-order pass where the parent passes
down "the answer for everything that is NOT in your subtree". Two passes -> O(n) instead
of O(n^2). (Sum of Distances in Tree, LC 834, is the classic.)

See [Trees](../../../20_Trees/01_Binary_Trees/README.md) for traversals.

### 3. Digit DP (lite)

To count numbers up to N with a digit property, walk the digits of N from left to right.
State = `(position, tight, extraInfo)` where `tight` says "have I matched N's prefix
exactly so far? (then this digit is limited to N's digit)". `extraInfo` is whatever the
property needs (mask of used digits, last digit, sum so far...).

In this folder we do the gentle version (Count Numbers with Unique Digits) where N is
`999...9`, so `tight` never matters and the state collapses to "digits left".

### 4. State machine DP

Draw the states and the arrows, then write one line per state.

```
Stock with cooldown:
   [free] --buy--> [hold] --sell--> [cooldown] --wait--> [free]
      ^ rest |        ^ rest |
      +------+        +------+
```

With `k` transactions the machine is copied k times: `hold[t]` / `free[t]`. The
recurrence reads straight off the arrows:

```js
free[t] = Math.max(free[t], hold[t] + price);      // sell
hold[t] = Math.max(hold[t], free[t - 1] - price);  // buy (opens transaction t)
```

### 5. DP + binary search

Job Scheduling: sort by start, `dp[i] = max(dp[i+1], profit[i] + dp[next(i)])` where
`next(i)` = first job starting at or after `end[i]`, found with a binary search
([Searching](../../../10_Searching/README.md)). Replaces an O(n) scan with O(log n). The same trick powers
the O(n log n) LIS (patience sorting, see [Strings & Sequences DP](../../03_Strings_And_Sequences/01_Concepts/CONCEPTS.md)).

### 6. DP + monotonic deque

When the transition is `dp[i] = nums[i] + max(dp[i-k..i-1])`, the inner max is a
**sliding window maximum**. Keep a deque of indices with decreasing dp values: the
front is the window max, pop the front when it falls out of the window, pop the back
while it is <= the new value. O(n) total instead of O(n * k).

### 7. Kadane is DP

`best[i] = nums[i] + max(0, best[i-1])` - the state is "best subarray ending here", the
choice is "extend or start over". Space-optimised to one variable it is Kadane.

### 8. Memo keys: Map tricks

```js
// readable, fine for most sizes
cache.set(`${i},${j}`, value);
// faster: encode to a number (no string allocation)
cache.set(i * width + j, value);
// tree DP: the node object itself is a valid Map key
cache.set(node, value);
// best when the state space is small and dense: a plain 2D array
const dp = Array.from({ length: rows }, () => new Array(cols).fill(-1));
```

### 9. When NOT to use DP

- **No overlapping subproblems** (merge sort, binary search, tree height): plain
  recursion / divide and conquer is already optimal; a memo only wastes memory.
- **A greedy choice is provably safe** (Jump Game, interval scheduling by end time,
  activity selection): O(n) greedy beats O(n^2) DP.
- **The state space is too big** (n = 10^5 and the state needs two indices): look for a
  different state, a monotonic structure, or a math shortcut.
- **You need to enumerate every solution**, not count/optimise them: backtracking.

---

## Pseudocode (Essential)

```
# Tree DP: each node returns [best if I take it, best if I skip it]   (House Robber III)
dfs(node):
  if node is null: return [0, 0]
  L = dfs(node.left); R = dfs(node.right)
  take = node.val + L.skip + R.skip
  skip = max(L.take, L.skip) + max(R.take, R.skip)
  return [take, skip]
answer = max(dfs(root))

# State machine: k transactions                        (Stock III / IV)
buy[0..k] = -Infinity; sell[0..k] = 0
for price in prices:
  for t in 1..k:
    buy[t]  = max(buy[t],  sell[t-1] - price)          # open transaction t
    sell[t] = max(sell[t], buy[t] + price)             # close transaction t
answer = sell[k]

# Bitmask DP over subsets
dp[0] = base
for mask in 0..2^n - 1:
  if dp[mask] unreachable: continue
  for i not in mask:
    dp[mask | 1<<i] = best(dp[mask | 1<<i], dp[mask] + cost(mask, i))
```

---

## Dry run — House Robber III on [3, 2, 3, null, 3, null, 1] (Essential)

Tree: root 3 with children 2 (right child 3) and 3 (right child 1). Post-order visits leaves first.

| node (value) | left [take, skip] | right [take, skip] | take = val + L.skip + R.skip | skip = max(L) + max(R) | returns |
|---|---|---|---|---|---|
| leaf 3 (under 2) | [0,0] | [0,0] | 3 | 0 | [3, 0] |
| 2 | [0,0] | [3,0] | 2 + 0 + 0 = 2 | 0 + 3 = 3 | [2, 3] |
| leaf 1 (under 3) | [0,0] | [0,0] | 1 | 0 | [1, 0] |
| 3 (right child of root) | [0,0] | [1,0] | 3 + 0 + 0 = 3 | 0 + 1 = 1 | [3, 1] |
| root 3 | [2,3] | [3,1] | 3 + 3 + 1 = 7 | 3 + 3 = 6 | [7, 6] |

Answer `max(7, 6) = 7`: rob the root and the two grandchildren (3 + 3 + 1).

---

## Operations & complexity

| Pattern | States | Work / state | Total time | Space |
|---------|--------|--------------|------------|-------|
| Bitmask (subset) | 2^n | n | O(2^n * n) | O(2^n) |
| Bitmask + last (TSP) | 2^n * n | n | O(2^n * n^2) | O(2^n * n) |
| Tree DP | n | children | O(n) | O(h) recursion |
| Digit DP | digits * 2 * extra | 10 | O(digits * extra * 10) | same |
| State machine | n * states * k | states | O(n * k) | O(k) rolling |
| DP + binary search | n | log n | O(n log n) | O(n) |
| DP + monotonic deque | n | amortised 1 | O(n) | O(k) |
| Kadane | n | 1 | O(n) | O(1) |

Rule of thumb from the [DP overview](../../01_Concepts/OVERVIEW.md): **time = number of states x work per transition**.

---

## JavaScript implementation

This folder has no separate implementation file; each pattern is small and lives
inside its problem file. The three reusable skeletons:

```js
// bitmask DP skeleton
const full = (1 << n) - 1;
const dp = new Array(1 << n).fill(Infinity);
dp[0] = 0;
for (let mask = 0; mask <= full; mask++) {
  if (dp[mask] === Infinity) continue;          // unreachable
  for (let i = 0; i < n; i++) {
    if (mask & (1 << i)) continue;              // already used
    dp[mask | (1 << i)] = Math.min(dp[mask | (1 << i)], dp[mask] + cost(mask, i));
  }
}

// tree DP skeleton
function dfs(node) {
  if (!node) return BASE_TUPLE;
  const left = dfs(node.left);
  const right = dfs(node.right);
  return combine(node, left, right);
}

// DP + monotonic deque skeleton
const deque = []; let head = 0;
for (let i = 0; i < n; i++) {
  while (head < deque.length && deque[head] < i - k) head++;          // out of window
  dp[i] = nums[i] + (head < deque.length ? Math.max(0, dp[deque[head]]) : 0);
  while (deque.length > head && dp[deque[deque.length - 1]] <= dp[i]) deque.pop();
  deque.push(i);
}
```

---

## Patterns / variations

### 1. Bitmask: "can we partition into k groups" (Partition to K Equal Sum Subsets)

```js
// dp[mask] = can the numbers in mask fill buckets one after another?
dp[0] = true;
for (let mask = 0; mask < (1 << n); mask++) {
  if (!dp[mask]) continue;
  const remainder = sumOf[mask] % target;          // how full the current bucket is
  for (let i = 0; i < n; i++) {
    if (!(mask & (1 << i)) && remainder + nums[i] <= target) dp[mask | (1 << i)] = true;
  }
}
```
Use when: n <= 16 and groups are interchangeable.

### 2. Bitmask + last: ordering problems (TSP, Shortest Superstring)

`dp[mask][last]` = best cost having visited `mask`, standing at `last`. Keep a
`parent[mask][last]` table to rebuild the path.

### 3. Tree DP: take / skip this node

```js
function dfs(node) {
  if (!node) return [0, 0];                      // [skip, take]
  const [ls, lt] = dfs(node.left);
  const [rs, rt] = dfs(node.right);
  return [Math.max(ls, lt) + Math.max(rs, rt), node.val + ls + rs];
}
```
Use when: a constraint links a node to its parent/children (robbery, cameras,
independent set, vertex cover).

### 4. Tree DP: longest path through a node

Return "longest downward path", update `best = max(best, left + right)` on the way up.
Diameter, Longest Univalue Path, Binary Tree Maximum Path Sum.

### 5. State machine: stock problems

One variable per state; iterate prices; update in the right order (or use temps).
Cooldown, transaction fee, k transactions: same machine, more arrows.

### 6. DP over sorted intervals + binary search

Sort by start (or end), `dp[i]` = best using jobs from i on, jump with binary search.

### 7. Window-max DP

`dp[i] = f(nums[i], max(dp[i-k..i-1]))` -> monotonic deque. Constrained Subsequence
Sum, Jump Game VI, Sliding Window Maximum itself.

---

## Alternatives (Essential)

| Problem shape | Brute force | DP version | Other option |
|---|---|---|---|
| Ordering n items (TSP, superstring) | n! permutations | bitmask + last, O(2^n · n^2) | heuristics when n > 20 |
| Partition into k equal groups | try every assignment, k^n | bitmask over used items, O(2^n · n) | backtracking with sorting + pruning (often fast enough) |
| Tree take / skip | try every subset of nodes | tuple per node, O(n) | — |
| Stock with k transactions | try every buy/sell pair set | state machine, O(n · k) | if k ≥ n/2, greedy sum of positive gains, O(n) |
| Weighted interval scheduling | 2^n subsets | sort + binary search, O(n log n) | — |
| Window max inside a DP | O(n · k) scan | monotonic deque, O(n) | max-heap with lazy deletion, O(n log n) |

---

## Common mistakes & edge cases

- **Bit overflow**: `1 << 31` is negative in JS (32-bit ints). Bitmask DP is safe for
  n <= 30; beyond that use `BigInt` or a different algorithm (you should not need to).
- Forgetting `if (dp[mask] === Infinity) continue;` makes unreachable states leak
  garbage into reachable ones.
- Iterating masks in increasing order is the correct topological order because
  adding a bit always increases the mask.
- Tree DP: decide what `null` returns BEFORE writing the recurrence (e.g. `[Inf, 0, 0]`
  for cameras: "cannot hold a camera, needs nothing"). Most bugs live in the base case.
- Deep trees (10^4 nodes in a line) can overflow the recursion stack; write an
  iterative post-order with an explicit stack (every tree problem here has one as
  `tabulation`).
- State machine: when updating several variables in one loop, read "yesterday's" values
  before overwriting them (temps, or update in the order that does not clobber).
- Monotonic deque: use a head index instead of `shift()`, which is O(n).
- Job scheduling: touching intervals (`end === nextStart`) usually do NOT overlap - ask.
- `k` transactions with `k >= n / 2` is the unlimited case: greedy is faster.

---

## Interview tips

- When you see `n <= 16`, say it out loud: "n is tiny, so 2^n subsets fit; I'll use a
  bitmask as the DP state." Interviewers love hearing the constraint drive the choice.
- For tree DP, explain the tuple first: "each node reports [X, Y] to its parent", then
  write the combine step. Name the base case for `null` explicitly.
- For stock problems, draw the state machine with arrows before any code. The code is
  one line per arrow.
- Always state **states x transition cost** for the complexity.
- If a greedy feels right, say why it is safe or why you doubt it; DP is the fallback
  that always works, greedy is the shortcut that needs proof.
- Mention the iterative post-order as a follow-up if the tree can be very deep.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Count Numbers with Unique Digits | Medium | digit DP (lite) | [01_count_numbers_with_unique_digits.js](../03_Problems/solutions/01_count_numbers_with_unique_digits.js) |
| 02 | Count Vowels Permutation | Hard | state machine | [02_count_vowels_permutation.js](../03_Problems/solutions/02_count_vowels_permutation.js) |
| 03 | Number of Ways to Stay in the Same Place | Hard | 2D DP, rolling row | [03_number_of_ways_to_stay_in_same_place.js](../03_Problems/solutions/03_number_of_ways_to_stay_in_same_place.js) |
| 04 | Frog Jump | Hard | memo with Map key `${i},${k}` | [04_frog_jump.js](../03_Problems/solutions/04_frog_jump.js) |
| 05 | House Robber III | Medium | tree DP (take/skip tuple) | [05_house_robber_iii.js](../03_Problems/solutions/05_house_robber_iii.js) |
| 06 | Diameter of Binary Tree / Longest Path | Easy/Medium | tree DP (longest path) | [06_diameter_longest_path_tree_dp.js](../03_Problems/solutions/06_diameter_longest_path_tree_dp.js) |
| 07 | Minimum Difficulty of a Job Schedule | Hard | partition DP (index + days) | [07_minimum_difficulty_job_schedule.js](../03_Problems/solutions/07_minimum_difficulty_job_schedule.js) |
| 08 | Best Time to Buy and Sell Stock III | Hard | state machine (2 transactions) | [08_best_time_to_buy_sell_stock_iii.js](../03_Problems/solutions/08_best_time_to_buy_sell_stock_iii.js) |
| 09 | Best Time to Buy and Sell Stock IV | Hard | state machine (k transactions) | [09_best_time_to_buy_sell_stock_iv.js](../03_Problems/solutions/09_best_time_to_buy_sell_stock_iv.js) |
| 10 | Maximum Profit in Job Scheduling | Hard | DP + binary search | [10_maximum_profit_job_scheduling.js](../03_Problems/solutions/10_maximum_profit_job_scheduling.js) |
| 11 | Partition to K Equal Sum Subsets | Medium | bitmask DP | [11_partition_k_equal_sum_subsets.js](../03_Problems/solutions/11_partition_k_equal_sum_subsets.js) |
| 12 | Binary Tree Cameras | Hard | tree DP (3 states) | [12_binary_tree_cameras.js](../03_Problems/solutions/12_binary_tree_cameras.js) |
| 13 | Constrained Subsequence Sum | Hard | DP + monotonic deque | [13_constrained_subsequence_sum.js](../03_Problems/solutions/13_constrained_subsequence_sum.js) |
| 14 | Shortest Superstring / TSP | Hard | bitmask + last (Held-Karp) | [14_shortest_superstring_tsp.js](../03_Problems/solutions/14_shortest_superstring_tsp.js) |

---

## Practice more

Easy/Medium: Best Time to Buy and Sell Stock with Cooldown (309), Longest Univalue Path (687),
Jump Game VI (1403), Maximum Students Taking Exam (1349), Beautiful Arrangement (526),
Can I Win (464), Sum of Distances in Tree (834, rerooting), Longest ZigZag Path in a Binary Tree (1372)

Hard: Minimum Number of Work Sessions to Finish the Tasks (1986), Smallest Sufficient Team (1125),
Number of Digit One (233), Numbers At Most N Given Digit Set (902), Count Special Integers (2376),
Binary Tree Maximum Path Sum (124), Minimum Cost to Merge Stones (1000),
Maximum Number of Events That Can Be Attended II (1751), Shortest Path Visiting All Nodes (847),
Minimum Incompatibility (1681)
