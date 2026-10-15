# Classic Techniques — Quiz

Back to the [topic README](../README.md).

**1. (Predict) `kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4])`?**

<details><summary>Answer</summary>

6 — subarray [4, -1, 2, 1].
</details>

**2. (Spot the bug)**

```js
let cur = 0, best = 0;
for (const x of nums) { cur = Math.max(0, cur + x); best = Math.max(best, cur); }
```

<details><summary>Answer</summary>

For an all-negative array it returns 0 (the empty subarray), but the problem requires a non-empty subarray. Initialise `cur` and `best` with `nums[0]` and use `cur = max(x, cur + x)`.
</details>

**3. (Predict) Boyer-Moore on [2, 2, 1, 1, 1, 2, 2] — trace candidate/count at the end.**

<details><summary>Answer</summary>

2(1), 2(2), 1→(1), 1→(0), 1 becomes candidate (1), 2→(0), 2 becomes candidate (1). Final candidate **2**, which is the majority (4 of 7).
</details>

**4. (Multiple choice) How many values can appear more than n/3 times?**
a) 1  b) at most 2  c) at most 3  d) unbounded

<details><summary>Answer</summary>

b) At most 2 — three such values would need more than n elements.
</details>

**5. (Spot the bug) Floyd phase 2 restarts BOTH pointers from `nums[0]`.**

<details><summary>Answer</summary>

Then they move together and meet immediately at `nums[0]`. Only one pointer restarts from the start; the other stays at the meeting point.
</details>

**6. (Spot the bug) Dutch national flag: when `nums[mid] === 2`, the code swaps with `high`, then does `high--; mid++`.**

<details><summary>Answer</summary>

The value swapped in from `high` has not been examined yet; advancing `mid` skips it (it could be a 0). Only decrement `high`.
</details>

**7. (Compute) Reservoir sampling with k = 1: probability that the 3rd item of a 5-item stream is the final answer?**

<details><summary>Answer</summary>

`1/3 · 3/4 · 4/5 = 1/5`.
</details>

**8. (Multiple choice) Which shuffle is uniform?**
a) `arr.sort(() => Math.random() - 0.5)`  b) for each i, swap with random j in [0, n-1]  c) for i from n-1 down, swap with random j in [0, i]  d) all three

<details><summary>Answer</summary>

c) Fisher-Yates.
</details>

**9. (Complexity) Quickselect with a random pivot — expected and worst case?**

<details><summary>Answer</summary>

Expected O(n); worst case O(n^2).
</details>

**10. (Complexity) Meet in the middle for n = 40 subset sums?**

<details><summary>Answer</summary>

Two halves of 2^20 ≈ 10^6 sums each; sorting one side is O(2^20 · 20); combining with binary search is the same order. About 2·10^7 steps instead of 10^12.
</details>

**11. (Define the state) In binary lifting, what is `up[3][v]`?**

<details><summary>Answer</summary>

The 2^3 = 8th ancestor of v (or a sentinel such as the root / -1 if it does not exist).
</details>

**12. (Compute) Kth ancestor with k = 13 uses which jumps?**

<details><summary>Answer</summary>

13 = 1101b → jumps of 1, 4 and 8 (`up[0]`, `up[2]`, `up[3]`), in any order.
</details>

**13. (Complexity) Sqrt decomposition range sum: query and point update?**

<details><summary>Answer</summary>

Query O(√n), update O(1), build O(n).
</details>

## Mastery checklist

- [ ] I can code Kadane, Boyer-Moore (and the n/3 version), Floyd duplicate and the Dutch flag from memory.
- [ ] I can prove reservoir sampling and Fisher-Yates are uniform in a few lines.
- [ ] I can code quickselect with a random pivot and three-way partitioning.
- [ ] I can recognise "n ≤ 40" as meet in the middle and explain the split + combine step.
- [ ] I can build a binary lifting table and answer k-th ancestor and LCA queries.
