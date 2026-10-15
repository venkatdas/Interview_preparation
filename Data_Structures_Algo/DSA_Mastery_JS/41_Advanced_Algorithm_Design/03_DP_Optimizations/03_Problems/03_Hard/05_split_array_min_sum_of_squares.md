# Split Array into K Parts Minimizing the Sum of Squares

| | |
|---|---|
| **Topic** | DP Optimizations (Advanced) |
| **Difficulty** | Hard |
| **Pattern** | divide & conquer optimization |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [05_split_array_min_sum_of_squares.js](../solutions/05_split_array_min_sum_of_squares.js) — open only after a real attempt |
| **Interview frequency** | Rare in interviews (competitive-programming technique). The O(k·n²) DP is the interview answer; D&C optimization is a strong bonus. |

## Problem

You are given an array of **non-negative** integers `nums` and an integer `k` (1 <= k <= n).
Cut `nums` into exactly k contiguous, non-empty parts. The cost of a part is the square of
its sum, and the cost of the whole split is the sum of the part costs. Return the minimum
possible cost.

Story: k servers each process one contiguous batch of requests; a server's penalty grows
with the square of its load, so you want the batches balanced.

## Examples

```
Input: nums = [1,2,3,4,5], k = 2   Output: 117   ([1,2,3] [4,5] -> 36 + 81)
Input: nums = [1,2,3,4,5], k = 3   Output: 77    ([1,2,3] [4] [5] -> 36 + 16 + 25)
Input: nums = [4,0,4,0], k = 2     Output: 32    ([4,0] [4,0])
Input: nums = [7], k = 1           Output: 49
```

## Constraints & clarifying questions

```
- 1 <= k <= n <= 2000, 0 <= nums[i] <= 1000
- Non-negative values? (yes - required for the optimization to be valid)
- Every part non-empty? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Layered partition DP `dp[g][i]` ("first i numbers in g parts"). Then look at *where* the best last cut lands. See "Divide & conquer optimization" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** `dp[g][i] = min over j of dp[g-1][j] + (pre[i] - pre[j])^2`. That is O(k·n²) — 8e9 for the limits.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Print the best j (call it opt(i)) for each i on small inputs: it never decreases. So compute the middle i first, then the left half only searches j <= opt(mid) and the right half j >= opt(mid). Each recursion level scans O(n) candidates.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** k = 1, k = n, zeros (ties for opt). j must stay in `[g-1, i-1]` so every part is non-empty.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force DP   O(k·n²) time, O(n) space

```
pre = prefix sums; cost(j, i) = (pre[i] - pre[j])^2
dp[0][0] = 0
dp[g][i] = min over j in [g-1, i-1] of dp[g-1][j] + cost(j, i)
```

### APPROACH 2 — Optimal (divide & conquer optimization)   O(k·n log n) time, O(n) space

```
for each layer g:
  solve(lo=g, hi=n, optLo=g-1, optHi=n-1):
    mid = (lo+hi)/2
    scan j in [optLo, min(mid-1, optHi)] -> cur[mid], opt(mid)
    solve(lo, mid-1, optLo, opt(mid)); solve(mid+1, hi, opt(mid), optHi)
```

Why is opt monotone? For non-negative values, `cost(a,c) + cost(b,d) <= cost(a,d) + cost(b,c)`
for a <= b <= c <= d (the quadrangle inequality: squaring is convex). That guarantees the best
last cut never moves left as the prefix grows.

Dry run on [1,2,3,4,5], k = 2, pre = [0,1,3,6,10,15], layer g = 2:

```
solve(2..5, j in [1,4])  mid=3: j=1 -> 1+25=26, j=2 -> 9+9=18     dp=18,  opt=2
solve(2..2, j in [1,2])  mid=2: j=1 -> 1+4=5                       dp=5
solve(4..5, j in [2,4])  mid=4: j=2 -> 9+49=58, j=3 -> 36+16=52    dp=52,  opt=3
solve(5..5, j in [3,4])  mid=5: j=3 -> 36+81=117, j=4 -> 100+25    dp=117  <- answer
```

### Complexity

Per layer: recursion depth log n, O(n) work per depth → O(n log n); k layers → O(k·n log n).

### Edge cases

```
- k = 1 -> total^2;  k = n -> sum of nums[i]^2
- negative numbers would break the quadrangle inequality -> do not use the optimization
```

### Common mistakes

- Letting j reach mid (empty last part) — the scan is `j <= mid - 1`.
- Passing `[optLo, optHi]` unchanged to both halves (no speed-up) or swapping them (wrong answers).

Full JavaScript solution with tests: [05_split_array_min_sum_of_squares.js](../solutions/05_split_array_min_sum_of_squares.js). Run it with `node 05_split_array_min_sum_of_squares.js` from the solutions folder.

</details>

## Related follow-ups

- Allocate Mailboxes (LeetCode 1478)
- Split Array Largest Sum (LeetCode 410) — min-max version, binary search on the answer
- Minimum Difficulty of a Job Schedule (LeetCode 1335)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
