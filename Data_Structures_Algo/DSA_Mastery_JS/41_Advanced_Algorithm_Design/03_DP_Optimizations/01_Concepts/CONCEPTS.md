# DP Optimizations

> **Level: Advanced.** Interview frequency: prefix-sum transitions, monotonic-deque DP and
> binary search inside DP show up **occasionally** in hard rounds at top-tier companies;
> space optimization is a **common** follow-up; divide & conquer optimization, Knuth,
> convex hull trick and bitsets are **rare** (competitive programming). Sections below are
> tagged **Essential** (learn to code it) or **Advanced (rare)** (learn to recognise it).

---

## 1. Prerequisites

- [1D Dynamic Programming](../../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) and the [DP overview](../../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md) — states, transitions, base cases.
- [Interval DP](../../../29_Dynamic_Programming/05_Interval_DP/README.md) — needed for Knuth.
- [Monotonic Stacks and Queues](../../../18_Monotonic_Stacks_And_Queues/README.md) — the sliding-window-maximum deque.
- [Prefix Sums](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) and [binary search](../../../10_Searching/README.md).
- [Bit Manipulation](../../../14_Bit_Manipulation/README.md) — for bitmask and bitset tricks.

---

## 2. Intuition

A DP has two costs: **how many states** there are, and **how much work each transition
does**. Most slow DPs have a fine number of states (say n) but a fat transition (look at
k, or n, earlier states). Total: O(n·k) or O(n²).

The trick is to notice that the inner loop is asking a question we already know how to
answer fast:

```
inner loop asks...                         answer it with...                  cost per state
"sum of dp over a range of j"              a prefix sum of dp                 O(1)
"max/min of dp over the last k states"     a monotonic deque                  O(1) amortized
"the last state that is compatible"        binary search (data is sorted)     O(log n)
"min over j of dp[j] + cost(j, i)",        the best j only moves forward ->   O(log n) / O(1)
   and the best j is monotone              D&C optimization / Knuth
"min over j of (m_j · x_i + b_j)"          lower envelope of lines (CHT)      O(1) / O(log C)
"OR over many booleans"                    pack 64 booleans per word (bitset) 64x fewer steps
```

You never change **what** the DP computes, only **how fast** the transition is evaluated.
So the slow DP is always your correctness reference.

---

## 3. Mental model / analogy + ASCII visual

Think of filling a row of boxes dp[0..n-1] from left to right. To fill box i you must
"look back" at some earlier boxes. The optimizations are different pairs of glasses:

```
            look-back window for dp[i]
            <---------- k ---------->
dp:  [ . . | x  x  x  x  x  x  x  x | i ]  . . .
                                      ^
 naive:      read all k boxes each time                 O(k)  per i
 prefix sum: pre[i] - pre[i-k]  (one subtraction)        O(1)  per i  (sums)
 deque:      a "leaderboard" that already knows the max  O(1)  per i  (max / min)

 D&C / Knuth: the arrow showing the best j never goes backwards
    i:      1  2  3  4  5  6  7  8
    opt(i): 0  0  1  1  1  3  4  4      <- monotone, so search ranges shrink

 CHT: each earlier state j is a LINE; dp[i] reads the lowest line at x = x_i
      \        /
       \  ____/      lower envelope = what we keep
        \/
```

---

## 4. Why it exists (what problem it solves)

Constraints like `n <= 1e5` with a natural O(n·k) or O(n²) DP are the signal. 1e10 steps
time out; 1e5–1e7 steps pass. The optimizations take a DP that is *correct but too slow*
to one that fits the limit without changing the recurrence, so your proof of correctness
(the recurrence) stays valid. In interviews the follow-up "n is now 10^5, can you do
better?" after an O(n·k) DP is exactly this topic.

---

## 5. How it works, step by step

### 5.1 Prefix-sum transition — **Essential**

Recurrence shape: `dp[i] = sum of dp[j] for j in [i-R, i-L]`.
1. Keep `pre[x] = dp[0] + ... + dp[x-1]`, extended right after each dp[i] is final.
2. `dp[i] = pre[i-L+1] - pre[max(0, i-R)]` (clip the left end at 0, skip if i-L < 0).
3. Under a modulus, add MOD before `%` so the difference is never negative.
Example: [02_number_of_ways_prefix_sum](../03_Problems/02_Medium/02_number_of_ways_prefix_sum.md), LeetCode 1871 Jump Game VII, 1977.

### 5.2 Monotonic deque optimization — **Essential**

Recurrence shape: `dp[i] = val[i] + max(dp[i-k .. i-1])` (or min).
1. Deque of indices whose dp values are **decreasing** from front to back.
2. For each i: pop the front while it is out of the window (`front < i-k`).
3. The front is the best predecessor: compute dp[i].
4. Pop the back while `dp[back] <= dp[i]`: those are older *and* not better, so they
   can never win again. Push i.
Each index enters and leaves once → O(n) total.

### 5.3 Binary-search optimization — **Essential**

**LIS (patience sorting).** `tails[L]` = smallest tail of an increasing subsequence of
length L+1. tails is sorted, so each number binary-searches its slot and replaces it.
O(n²) → O(n log n). (It gives the length; recovering the sequence needs parent pointers.)

**Weighted job scheduling.** Sort jobs by end. `dp[i] = max(dp[i-1], profit_i + dp[p])`,
where p = number of jobs that end ≤ start_i. Since ends are sorted, p is an upper-bound
binary search. O(n²) → O(n log n).

### 5.4 Divide & conquer optimization — **Advanced (rare)**

Recurrence shape (layered partition DP):
`dp[g][i] = min over j < i of dp[g-1][j] + cost(j, i)`, with `opt(i) <= opt(i+1)`.
1. For one layer, call `solve(lo, hi, optLo, optHi)`.
2. Compute `mid`, scan j only in `[optLo, min(mid-1, optHi)]`, record `opt(mid)`.
3. Recurse: left half with `[optLo, opt(mid)]`, right half with `[opt(mid), optHi]`.
Each recursion depth scans O(n) j's in total; depth is log n → O(n log n) per layer.
When is opt monotone? When cost satisfies the **quadrangle inequality**
`cost(a,c) + cost(b,d) <= cost(a,d) + cost(b,c)` for a ≤ b ≤ c ≤ d. Squares of sums of
non-negative numbers do; so do many "cost grows faster than linearly" functions.

### 5.5 Knuth optimization — **Advanced (rare)**

Recurrence shape (interval DP):
`dp[i][j] = min over i <= m < j of dp[i][m] + dp[m+1][j] + w(i, j)`.
If w satisfies the quadrangle inequality and is monotone on inclusion, then
`opt[i][j-1] <= opt[i][j] <= opt[i+1][j]`. Loop m only in that range. Summed over one
diagonal, the ranges telescope to O(n), so the total is O(n²) instead of O(n³).
Classic: optimal merging of adjacent piles (Merge Stones with K = 2), optimal BST.

### 5.6 Convex hull trick (CHT) — **Advanced (rare)**

Recurrence shape: `dp[i] = A(i) + min over j of (m_j · x_i + b_j)` where m_j, b_j depend only
on j (often after expanding a square). Each j is a line; we need the lowest line at x_i.
- **Monotone CHT:** slopes added in sorted order and queries sorted → deque + pointer, O(1)
  amortized. Drop the middle line l2 of (l1, l2, l3) when
  `(b3-b1)(m1-m2) <= (b2-b1)(m1-m3)` (l1 and l3 cross before l1 and l2 do).
- **Li Chao tree (brief):** no ordering needed. A segment tree over the x-range; each node
  keeps the line that wins at its midpoint and pushes the loser into the one half where it
  can still win. O(log C) insert and query.

### 5.7 Bitset / bitmask speed-ups — **Advanced (rare)** / bitmask **Essential-ish**

- **Bitset:** a boolean DP like subset sum `can[s] |= can[s-a]` is one shift-or on a big
  integer: `bits |= bits << a`. 64 sums per machine word. In JS use `BigInt`.
- **Bitmask DP:** when n <= 20, the set of used items is a mask; `dp[mask]` replaces
  "try every permutation" (n!) by 2^n · n.

### 5.8 Space optimization recap — **Essential**

If row i only reads row i-1, keep one or two rows. 0/1 knapsack in one array: loop the
capacity **downward** so each item is used once. LCS / edit distance: two rows (or one row
plus a saved diagonal). Memory O(n·W) → O(W).

---

## 6. Pseudocode

```
PREFIX-SUM TRANSITION
pre[0] = 0; dp[0] = base; pre[1] = dp[0]
for i in 1..n:
    r = i - L; l = max(0, i - R)
    dp[i] = (r >= 0) ? pre[r+1] - pre[l] : 0
    pre[i+1] = pre[i] + dp[i]

DEQUE TRANSITION
for i in 0..n-1:
    while deque.front < i - k: pop front
    dp[i] = val[i] + (deque empty ? 0 : dp[deque.front])
    while deque not empty and dp[deque.back] <= dp[i]: pop back
    push back i

D&C OPTIMIZATION (one layer)
solve(lo, hi, optLo, optHi):
    if lo > hi: return
    mid = (lo + hi) / 2
    best = +inf; bestJ = optLo
    for j in optLo .. min(mid-1, optHi):
        if prev[j] + cost(j, mid) < best: best = ..., bestJ = j
    cur[mid] = best
    solve(lo, mid-1, optLo, bestJ); solve(mid+1, hi, bestJ, optHi)

KNUTH
for len in 2..n: for i: j = i+len-1
    for m in opt[i][j-1] .. opt[i+1][j]: try dp[i][m] + dp[m+1][j]
    dp[i][j] += w(i, j)

MONOTONE CHT (min, slopes decreasing, queries increasing)
add(m, b): while size >= 2 and middle-of-last-two-and-new is useless: pop back; push
query(x):  while next line is <= current at x: advance pointer; return value
```

---

## 7. JavaScript implementation

All techniques live in [02_Implementations/dp_optimizations.js](../02_Implementations/dp_optimizations.js),
each paired with its slow twin and checked on hundreds of random inputs. The deque core:

```js
function windowMaxDP(nums, k, restart = false) {
  const dp = new Array(nums.length);
  const dq = new Array(nums.length); let head = 0, tail = 0;  // O(1) pops at both ends
  for (let i = 0; i < nums.length; i++) {
    while (head < tail && dq[head] < i - k) head++;          // out of window
    let best = head < tail ? dp[dq[head]] : -Infinity;
    if (restart) best = Math.max(best, 0);
    dp[i] = nums[i] + (best === -Infinity ? 0 : best);
    while (head < tail && dp[dq[tail - 1]] <= dp[i]) tail--; // dominated
    dq[tail++] = i;
  }
  return dp;
}
```

Note `head/tail` pointers instead of `Array.prototype.shift()`: `shift` is O(n) and would
quietly turn your O(n) algorithm back into O(n·k).

---

## 8. Dry run on a concrete example

Jump Game VI style: `nums = [1, -1, -2, 4, -7, 3]`, k = 2, `dp[i] = nums[i] + max(dp[i-2..i-1])`.

| i | nums[i] | pop front? | best (front) | dp[i] | pop back | deque after (idx:dp) |
|---|---|---|---|---|---|---|
| 0 | 1 | - | none | 1 | - | [0:1] |
| 1 | -1 | no | 1 | 0 | no | [0:1, 1:0] |
| 2 | -2 | no | 1 | -1 | no | [0:1, 1:0, 2:-1] |
| 3 | 4 | 0 (0 < 1) | 0 | 4 | 2, 1 | [3:4] |
| 4 | -7 | no | 4 | -3 | no | [3:4, 4:-3] |
| 5 | 3 | no | 4 | 7 | 4, 3 | [5:7] |

Answer dp[5] = 7. Notice each index is pushed once and popped at most once.

---

## 9. Edge cases

- **Empty window** at the start (i < L for prefix sums, i = 0 for the deque): handle "no
  predecessor" explicitly — `-Infinity` or a base case, not 0 by accident.
- **Window clipping:** `max(0, i - R)`; forgetting it reads `pre[-3]` → `undefined` → NaN.
- **Modulus subtraction:** `(a - b + MOD) % MOD`.
- **Ties** in deque / CHT: use `<=` when popping so equal values do not pile up (both are
  correct, `<=` keeps the deque smaller). For parallel lines keep only the lower one.
- **Large numbers:** CHT compares products like `(b3-b1)(m1-m2)`; check they stay below
  2^53 ≈ 9e15 or switch to BigInt / a division-based comparison.
- **Monotonicity assumption broken** (negative numbers in D&C cost, unsorted slopes in
  monotone CHT): the optimized code silently returns wrong answers. Verify with brute force.

---

## 10. Complexity analysis table

| Technique | Naive | Optimized time | Extra space | Why |
|---|---|---|---|---|
| Prefix-sum transition | O(n·w) | O(n) | O(n) | range sum = two lookups |
| Monotonic deque | O(n·k) | O(n) | O(k) | each index pushed/popped once |
| LIS patience | O(n²) | O(n log n) | O(n) | tails sorted → binary search |
| Job scheduling | O(n²) | O(n log n) | O(n) | sort + binary search for compatible job |
| D&C optimization | O(k·n²) | O(k·n log n) | O(n) | O(n) per recursion depth, log n depths |
| Knuth optimization | O(n³) | O(n²) | O(n²) | opt ranges telescope along a diagonal |
| Monotone CHT | O(n²) | O(n) | O(n) | deque + forward-only pointer |
| Li Chao tree | O(n²) | O(n log C) | O(n) | one root-to-leaf walk per op |
| Bitset subset sum | O(n·S) | O(n·S/64) | O(S/64) words | 64 booleans per word |
| Bitmask DP | O(n!) | O(2^n · n) | O(2^n) | subsets instead of orders |
| Rolling array | O(n·W) memory | same time | O(W) | only previous row is read |

---

## 11. Alternatives (brute force vs optimized, trade-offs)

- **Segment tree / sparse table over dp** instead of a deque: O(log n) per transition,
  works for arbitrary (non-sliding) ranges. Slower but more general and easier to trust.
- **Heap with lazy deletion** instead of a deque: O(log n), simpler to reason about for
  some people; fine in interviews when the deque feels risky.
- **Li Chao tree** instead of monotone CHT: no ordering assumptions, O(log C), less fiddly
  with ties. Prefer it when slopes or queries are not sorted.
- **D&C opt vs Knuth:** D&C works on layered partition DPs `dp[g][i]`; Knuth on interval DPs
  `dp[i][j]`. Both need monotone opt. If unsure, write the O(n²)/O(n³) DP first and
  print opt values on random inputs to see if they are monotone.
- **When NOT to optimize:** if n ≤ 2000, the plain O(n²) DP is often fine and far less
  error-prone. Always state the slow solution first in an interview.

---

## 12. Common mistakes (and why they happen)

1. **Using `shift()` on a JS array as a deque** → O(n) per pop, hidden quadratic time.
   Happens because Python's `deque.popleft()` habits don't transfer.
2. **Popping the front with the wrong bound** (`< i-k` vs `<= i-k`): off-by-one in "window of
   size k". Write down which j are allowed: `i-k <= j <= i-1`.
3. **Forgetting the restart option** (`max(0, best)`) in "subsequence may start anywhere"
   problems (Constrained Subsequence Sum).
4. **Binary search on unsorted data** — sorting jobs by start but searching ends.
5. **Applying D&C/Knuth without the monotone-opt property** (e.g. negative values make
   the square cost violate the quadrangle inequality). Always cross-check with brute force.
6. **CHT with the wrong envelope** (max vs min, increasing vs decreasing slopes). Negate
   lines to convert a max query into a min query rather than rewriting the code.
7. **Negative results under a modulus** in prefix-sum transitions.
8. **Space optimization loop direction**: iterating knapsack capacity upward turns 0/1
   knapsack into unbounded knapsack.

---

## 13. Patterns / variations with templates

### Pattern A — "jump up to k steps, maximize / minimize" → deque
```js
// dp[i] = val[i] + best(dp[i-k..i-1])
while (head < tail && dq[head] < i - k) head++;
dp[i] = val[i] + dp[dq[head]];
while (head < tail && dp[dq[tail - 1]] <= dp[i]) tail--;   // for min use >=
dq[tail++] = i;
```

### Pattern B — "count ways, jump distance in [L, R]" → prefix sum
```js
const r = i - L, l = Math.max(0, i - R);
dp[i] = r >= 0 ? (pre[r + 1] - pre[l] + MOD) % MOD : 0;
pre[i + 1] = (pre[i] + dp[i]) % MOD;
```

### Pattern C — "pick non-overlapping intervals with weights" → sort by end + binary search
```js
jobs.sort((a, b) => a.end - b.end);
dp[i] = Math.max(dp[i - 1], jobs[i - 1].profit + dp[upperBound(ends, jobs[i - 1].start)]);
```

### Pattern D — "cut into k contiguous groups, convex cost" → D&C optimization
```js
for (let g = 1; g <= k; g++) { solve(g, n, g - 1, n - 1); prev = cur; }
```

### Pattern E — "dp[j] = min (dp[i] + (x_j - x_i)^2 + C)" → expand, CHT
```
m_i = -2·x_i,  b_i = dp[i] + x_i²,  dp[j] = x_j² + C + min_i(m_i·x_j + b_i)
```

### Pattern F — "merge adjacent things, cost = total" → interval DP (+ Knuth if 2-way)

### Pattern G — "n <= 20, assign / visit all" → bitmask DP; "subset sum reachable" → bitset

---

## 14. Recognition clues: when to use it AND when it does NOT apply

**Use it when:**
- You have a correct DP and the constraints say it is ~100x too slow.
- The transition reads a **contiguous window** of earlier states → prefix sum (sum) or
  deque (max/min).
- The transition needs "the last compatible item" in **sorted** data → binary search.
- Expanding the cost gives a **product of a j-term and an i-term** → CHT.
- Plotting `opt(i)` from the slow DP gives a **non-decreasing** sequence → D&C / Knuth.

**It does NOT apply when:**
- The transition range is not contiguous or not sliding (e.g. "any j with nums[j] < nums[i]")
  → you need a Fenwick/segment tree keyed by value instead.
- The bottleneck is the **number of states**, not the transition (e.g. 2^n states with
  n = 40) → you need a different state design or meet in the middle.
- The cost function is arbitrary (no quadrangle inequality) → D&C/Knuth give wrong answers.
- Deque optimization needs max/min; it cannot do sums or "k-th best". Prefix sums need
  invertible operations (sum, xor), not max.

---

## 15. Interview application (talk track, what to clarify)

1. **State the slow DP first** — recurrence, base case, complexity. ("dp[i] = nums[i] +
   max of the previous k dp values; that's O(n·k), which is 1e10 here.")
2. **Name the bottleneck** — "the inner loop is a sliding window maximum."
3. **Name the tool** — "a monotonic deque gives me the window max in amortized O(1)."
4. **Argue correctness in one sentence** — "an older index with a smaller-or-equal dp can
   never be chosen again, so I can drop it."
5. **Code it, then dry run 4–6 steps** with the deque contents.

Clarify: value ranges (negatives? → restart option, D&C validity), whether the answer is
mod 1e9+7, whether input is sorted (CHT / binary search), and the true limits on n and k
(they tell you which complexity is required).

If you recognise a rare technique (CHT, Knuth, D&C opt) say so, explain the idea, and
offer the O(n²) solution as a fallback — interviewers value the honest trade-off.

---

## 16. Problems in this topic + Practice more

| # | Problem | Difficulty | Technique |
|---|---|---|---|
| 01 | [Jump Game VI](../03_Problems/02_Medium/01_jump_game_vi.md) | Medium | monotonic deque |
| 02 | [Number of Ways to Reach the Target](../03_Problems/02_Medium/02_number_of_ways_prefix_sum.md) | Medium | prefix-sum transition |
| 03 | [Constrained Subsequence Sum](../03_Problems/03_Hard/03_constrained_subsequence_sum.md) | Hard | monotonic deque + restart |
| 04 | [Maximum Profit in Job Scheduling](../03_Problems/03_Hard/04_maximum_profit_job_scheduling.md) | Hard | binary search inside DP |
| 05 | [Split Array into K Parts Minimizing the Sum of Squares](../03_Problems/03_Hard/05_split_array_min_sum_of_squares.md) | Hard | D&C optimization |
| 06 | [Frog Jump with Quadratic Cost](../03_Problems/03_Hard/06_frog_jump_quadratic_cost.md) | Hard | convex hull trick |
| 07 | [Minimum Cost to Merge Stones](../03_Problems/03_Hard/07_minimum_cost_to_merge_stones.md) | Hard | interval DP, Knuth (K = 2) |

**Practice more (LeetCode):**
- 1871 Jump Game VII (prefix sum / sliding window over reachability)
- 1977 Number of Ways to Separate Numbers (prefix-sum transition, hard)
- 239 Sliding Window Maximum (the deque itself)
- 862 Shortest Subarray with Sum at Least K (deque over prefix sums)
- 300 Longest Increasing Subsequence, 354 Russian Doll Envelopes (patience sorting)
- 2008 Maximum Earnings From Taxi, 1751 Maximum Number of Events That Can Be Attended II (binary search DP)
- 410 Split Array Largest Sum (also binary search on the answer)
- 1478 Allocate Mailboxes (partition DP, D&C-optimizable)
- 1547 Minimum Cost to Cut a Stick (interval DP)
- 1723 Find Minimum Time to Finish All Jobs, 1879 Minimum XOR Sum of Two Arrays (bitmask DP)
- 416 Partition Equal Subset Sum (bitset trick)
