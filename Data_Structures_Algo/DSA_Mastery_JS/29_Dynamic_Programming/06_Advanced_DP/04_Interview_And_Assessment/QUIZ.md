# Advanced DP — Quiz

Back to the [topic README](../README.md).

**1. (Complexity) Bitmask + last DP over n = 15 items: about how many states?**

<details><summary>Answer</summary>

2^15 · 15 ≈ 491,520 states, with O(n) transitions each → about 7·10^6 operations.
</details>

**2. (Spot the bug)** `if (mask & 1 << i === 0) { ... }`

<details><summary>Answer</summary>

Operator precedence: `===` binds tighter than `&`, so this is `mask & ((1 << i) === 0)`. Write `(mask & (1 << i)) === 0`.
</details>

**3. (Define the state) House Robber III: what does each node return?**

<details><summary>Answer</summary>

`[take, skip]`: the best sum in its subtree if the node is robbed, and if it is not.
</details>

**4. (Compute) Count Vowels Permutation for n = 2?**

<details><summary>Answer</summary>

**10** (ae, ea, ei, ia, ie, io, iu, oi, ou, ua).
</details>

**5. (Multiple choice) Stock III (at most 2 transactions) needs how many rolling variables?**
a) 1  b) 2  c) 4  d) n

<details><summary>Answer</summary>

c) buy1, sell1, buy2, sell2.
</details>

**6. (Spot the bug) Binary Tree Cameras:** `if (!node) return NOT_COVERED;`

<details><summary>Answer</summary>

Null children must count as COVERED. Otherwise every leaf forces a camera on itself, which is never optimal.
</details>

**7. (Compute) Count Numbers with Unique Digits for n = 2?**

<details><summary>Answer</summary>

**91**: 10 one-digit numbers (including 0) + 9 · 9 = 81 two-digit numbers.
</details>

**8. (Multiple choice) Maximum Profit in Job Scheduling: what do you sort by?**
a) start time  b) profit  c) end time  d) duration

<details><summary>Answer</summary>

c) Sort by end time, then binary search for the last job ending at or before the current start. (Sorting by start time with a suffix DP also works.)
</details>

**9. (Complexity) Constrained Subsequence Sum with a monotonic deque?**

<details><summary>Answer</summary>

O(n) time (each index enters and leaves the deque once), O(n) for dp (or O(k) for the deque alone).
</details>

**10. (Predict) Diameter of the tree [1, 2, 3, 4, 5] (level order)?**

<details><summary>Answer</summary>

**3** edges: 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3).
</details>

**11. (Spot the bug) Frog Jump:** next jump sizes are `k - 1, k, k + 1` with no check.

<details><summary>Answer</summary>

When k = 1, `k - 1 = 0` makes the frog jump in place forever (or revisit the same state). Only try jump sizes > 0.
</details>

**12. (Multiple choice) Which problem is a state machine DP?**
a) Partition to K Equal Sum Subsets  b) Best Time to Buy and Sell Stock IV  c) Shortest Superstring  d) Binary Tree Cameras

<details><summary>Answer</summary>

b) The states are "holding" and "not holding" with a transaction count.
</details>

## Mastery checklist

- [ ] I can write tree DP returning a tuple (House Robber III, Diameter) without looking.
- [ ] I can write the stock state machine for k transactions and explain the k ≥ n/2 shortcut.
- [ ] I can write a bitmask DP over subsets and know when n is small enough.
- [ ] I can combine DP with binary search (job scheduling) or a monotonic deque (constrained subsequence sum).
- [ ] I can explain when NOT to use DP.
