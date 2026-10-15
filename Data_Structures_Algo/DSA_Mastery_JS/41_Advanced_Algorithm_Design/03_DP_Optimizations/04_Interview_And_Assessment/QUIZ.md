# DP Optimizations — Self-Assessment Quiz

Answer each question before opening the answer. Score yourself honestly.

---

**1. (Multiple choice)** `dp[i] = nums[i] + max(dp[i-k..i-1])`, n = k = 1e5. Best tool?
A) prefix sums  B) monotonic deque  C) binary search  D) Knuth

<details><summary>Answer</summary>B — a max over a sliding window. Prefix sums only work for invertible operations like sum or xor.</details>

**2. (Multiple choice)** `dp[i] = dp[i-5] + dp[i-4] + ... + dp[i-2]` (mod p). Best tool?
A) prefix sums  B) monotonic deque  C) convex hull trick  D) bitmask

<details><summary>Answer</summary>A — a sum over a contiguous range of earlier states: `pre[i-1] - pre[i-5]`.</details>

**3. (Complexity)** What is the time complexity of the monotonic-deque DP, and why is it not O(n·k)?

<details><summary>Answer</summary>O(n). Each index is pushed once and popped at most once; the inner while-loops pay for those pops, so the total over all i is O(n).</details>

**4. (Spot the bug)**
```js
while (dq.length && dq[0] < i - k) dq.shift();
```
The logic is right. What is the problem?

<details><summary>Answer</summary>`Array.prototype.shift` is O(n) in JS (it re-indexes the array), so the "O(n)" algorithm can degrade to O(n·k). Use head/tail pointers on a plain array.</details>

**5. (Predict the output)** LIS patience on `[3, 1, 4, 1, 5, 9, 2, 6]`: what is `tails` at the end, and the LIS length?

<details><summary>Answer</summary>Steps: [3] → [1] → [1,4] → [1,4] → [1,4,5] → [1,4,5,9] → [1,2,5,9] → [1,2,5,6]. Length 4. Note [1,2,5,6] happens to be valid here, but in general tails is not a real subsequence.</details>

**6. (Multiple choice)** In weighted job scheduling, jobs must be sorted by:
A) start  B) end  C) profit  D) length

<details><summary>Answer</summary>B — so that the jobs compatible with job i (end ≤ start_i) form a prefix that a binary search can count.</details>

**7. (True / False)** The divide & conquer optimization is valid for any cost function as long as the DP is layered.

<details><summary>Answer</summary>False. It requires the optimal split point to be monotone, which follows from the quadrangle inequality. With an arbitrary cost it can return wrong answers.</details>

**8. (Complexity)** Partition DP with k layers and n elements: naive vs D&C optimized?

<details><summary>Answer</summary>Naive O(k·n²); D&C optimized O(k·n log n).</details>

**9. (Fill in)** Knuth optimization restricts the split point to `opt[i][j-1] ≤ opt[i][j] ≤ ____`.

<details><summary>Answer</summary>`opt[i+1][j]`. Summed along one diagonal the ranges telescope to O(n), so total O(n²).</details>

**10. (Derive)** `dp[j] = min_i dp[i] + (x_j - x_i)^2 + C`. Write the line for i (slope and intercept).

<details><summary>Answer</summary>Slope `m_i = -2·x_i`, intercept `b_i = dp[i] + x_i²`; then `dp[j] = x_j² + C + min_i(m_i·x_j + b_i)`.</details>

**11. (Multiple choice)** Slopes arrive in random order and queries in random order. Which structure?
A) monotone CHT deque  B) Li Chao tree  C) monotonic deque of dp  D) prefix sums

<details><summary>Answer</summary>B — Li Chao tree needs no ordering, O(log C) per operation. The monotone deque version needs sorted slopes (and a pointer needs sorted queries; with unsorted queries you could binary search on a sorted-slope hull).</details>

**12. (Spot the bug)** 0/1 knapsack in one array:
```js
for (const [w, v] of items) for (let c = w; c <= cap; c++) dp[c] = Math.max(dp[c], dp[c - w] + v);
```

<details><summary>Answer</summary>The capacity loop goes upward, so `dp[c - w]` may already include this item: that is unbounded knapsack. Iterate `c` from `cap` down to `w`.</details>

**13. (Merge Stones)** For stones of length 6 and K = 3, is merging into one pile possible?

<details><summary>Answer</summary>No: each move removes K-1 = 2 piles, so we need (6-1) % 2 == 0, which is false. Return -1.</details>

**14. (Multiple choice)** Constrained Subsequence Sum returns:
A) dp[n-1]  B) max(dp)  C) dp[0]  D) sum of positives

<details><summary>Answer</summary>B — the subsequence can end anywhere.</details>

---

## Mastery checklist

- [ ] I can take an O(n·k) "look back k steps" DP and rewrite it with a monotonic deque from memory, using head/tail pointers.
- [ ] I can turn a range-sum transition into a prefix-sum transition, including the modulus and window clipping.
- [ ] I can code LIS in O(n log n) and weighted job scheduling with binary search without looking.
- [ ] I can explain when D&C optimization, Knuth optimization and the convex hull trick apply, and derive the lines for a squared-cost DP.
- [ ] I always write (or describe) the slow DP first and cross-check the optimized version against it on random inputs.
