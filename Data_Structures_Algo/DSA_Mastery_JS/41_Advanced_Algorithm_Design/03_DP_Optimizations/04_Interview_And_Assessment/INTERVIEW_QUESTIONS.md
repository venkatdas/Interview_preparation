# DP Optimizations — Interview Questions

**Level: Advanced.** Questions 1–8 are the kind you can realistically be asked at a
top-tier company (deque, prefix sums, binary search, space). Questions 9–13 are rare in
interviews; knowing them well signals depth. Answer out loud first, then open the model answer.

---

**1. Your DP is correct but too slow. How do you decide what to optimize?**

<details><summary>Model answer</summary>

Split the cost into (number of states) × (work per transition). If the states are fine but
each transition loops over many earlier states, look at *what* the loop computes: a range
sum → prefix sums; a max/min over a sliding window → monotonic deque; "last compatible
item" in sorted data → binary search; a min over expressions linear in the current point →
convex hull trick; a min whose argmin is monotone → D&C / Knuth. If the number of states is
the problem, you need a different state, not a faster transition.
</details>

**2. Why does the monotonic deque give the sliding-window maximum in amortized O(1)?**

<details><summary>Model answer</summary>

The deque holds indices with decreasing values. When a new value arrives we pop every back
element that is ≤ it: those are older (they leave the window first) and not better, so they
can never be the maximum again. The front is the maximum of what is left once we pop
out-of-window indices. Each index is pushed once and popped at most once, so n steps cost
O(n) in total.
</details>

**3. In Jump Game VI, what is the recurrence and how does the deque plug in?**

<details><summary>Model answer</summary>

`dp[i] = nums[i] + max(dp[i-k..i-1])`, `dp[0] = nums[0]`. The max is over a window of
the dp array that slides by one, so we run sliding-window maximum on dp *while* building
dp: pop expired front, read front, compute dp[i], pop dominated back, push i. O(n) time.
</details>

**4. What changes in Constrained Subsequence Sum compared to Jump Game VI?**

<details><summary>Model answer</summary>

Two things: the subsequence may start anywhere, so `dp[i] = nums[i] + max(0, windowMax)`;
and it may end anywhere, so the answer is `max(dp)` instead of `dp[n-1]`. The deque part
is identical.
</details>

**5. How do prefix sums speed up a counting DP? Give an example.**

<details><summary>Model answer</summary>

If `dp[i] = dp[i-R] + ... + dp[i-L]`, keep `pre[x] = dp[0] + ... + dp[x-1]` as you go;
then `dp[i] = pre[i-L+1] - pre[max(0, i-R)]`. Example: count ways to reach a tile when each
jump length is in [L, R] (Jump Game VII is the boolean version). With a modulus, add MOD
before `%` after subtracting.
</details>

**6. Explain the O(n log n) LIS algorithm. What does `tails` contain?**

<details><summary>Model answer</summary>

`tails[L]` is the smallest possible last value of a strictly increasing subsequence of
length L+1 seen so far. It is sorted. For each x, binary search the first tail ≥ x and
replace it (or append if x is larger than all). The length of `tails` is the LIS length.
`tails` itself is generally not a valid subsequence; to recover one, store parent indices.
</details>

**7. Weighted job scheduling: why sort by end time, and what do you binary search for?**

<details><summary>Model answer</summary>

Sorting by end makes "jobs compatible with job i" a prefix of the array (all jobs ending ≤
start_i). dp over that prefix order is then `max(skip, profit_i + dp[p])` where p = count
of jobs with end ≤ start_i, found by an upper-bound binary search on the sorted ends.
O(n log n) total.
</details>

**8. How do you reduce memory in a 2D DP like 0/1 knapsack? What is the trap?**

<details><summary>Model answer</summary>

Row i only reads row i-1, so keep one 1D array. The trap is the loop direction: iterate
capacity from high to low so `dp[c - w]` still holds the previous row's value. Iterating
upward lets an item be reused, which is unbounded knapsack.
</details>

**9. What is the divide & conquer optimization and when is it valid?**

<details><summary>Model answer</summary>

For layered DPs `dp[g][i] = min_j dp[g-1][j] + cost(j, i)`, if the best j (opt) is
non-decreasing in i, compute dp for the middle i by scanning its allowed j range, then
recurse on the left half with j ≤ opt(mid) and the right half with j ≥ opt(mid). That is
O(n log n) per layer instead of O(n²). It is valid when cost satisfies the quadrangle
inequality (e.g. squared sums of non-negative numbers). Verify with brute force.
</details>

**10. What does Knuth optimization exploit?**

<details><summary>Model answer</summary>

In interval DPs `dp[i][j] = min_m dp[i][m] + dp[m+1][j] + w(i,j)` where w satisfies the
quadrangle inequality and monotonicity, the best split satisfies
`opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j]`. Limiting m to that range makes the work along
each diagonal telescope to O(n), giving O(n²) instead of O(n³). Example: optimal merge of
adjacent piles (Merge Stones with K = 2), optimal BST.
</details>

**11. When does the convex hull trick apply? Walk me through recognising it.**

<details><summary>Model answer</summary>

When the transition is `dp[j] = A(j) + min_i (m_i · x_j + b_i)` with m_i, b_i depending
only on i. You usually get there by expanding a square, e.g. `(x_j - x_i)²` gives slope
`-2x_i` and intercept `dp[i] + x_i²`. If slopes arrive sorted and queries are sorted, a
deque with a moving pointer is O(1) amortized; otherwise use a Li Chao tree (O(log C)).
</details>

**12. What is a Li Chao tree in one paragraph?**

<details><summary>Model answer</summary>

A segment tree over the x-domain where each node stores one line: the one that is best at
the node's midpoint. Inserting a new line compares it with the stored line at the midpoint
(swap so the winner stays) and at the left end; the loser can only win on one side, so it
is pushed down that side only. A query walks root to leaf taking the min of all lines on
the path. Both operations are O(log C) and no ordering of slopes or queries is needed.
</details>

**13. What are bitset and bitmask DP speed-ups?**

<details><summary>Model answer</summary>

Bitset: a boolean DP whose update is "shift and OR" (subset sum: `bits |= bits << a`)
processes 64 states per machine word, a 64x constant-factor win (BigInt in JS). Bitmask
DP: represent a subset of up to ~20 items as an integer and DP over subsets, turning n!
orderings into 2^n · n states-transitions (assignment, TSP).
</details>

**14. An interviewer asks for an O(n) solution and you only see O(n log n) with a heap. What do you say?**

<details><summary>Model answer</summary>

Present the heap solution (lazy deletion of out-of-window indices) with its complexity,
then point out that because the window only slides forward, a monotonic deque achieves
amortized O(1) per step. Explain the dominance argument and code the deque. Showing both
and the trade-off is better than silently jumping to the fancy one.
</details>
