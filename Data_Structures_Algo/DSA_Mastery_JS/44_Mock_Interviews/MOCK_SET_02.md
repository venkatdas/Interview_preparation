# Mock Interview Set 02 — Sliding Window & Backtracking

**Time:** 60 minutes total. Problem 1: 25 min. Problem 2: 30 min. 5 min to review.
**Covers:** [`07_Sliding_Window`](../07_Sliding_Window/README.md), [`13_Backtracking`](../13_Backtracking/README.md)
**When:** end of week 4 (12-week plan) or end of week 2 (4-week plan)

**Rules**

- Timer on. Explain the approach out loud before coding.
- Brute force first, then name the pattern.
- Open the Hints only when the problem's time is half gone and you have nothing.

---

## Problem 1 — Minimum Size Subarray Sum (LeetCode 209, Medium) — 25 min

**Links:** [LeetCode #209](https://leetcode.com/problems/minimum-size-subarray-sum/) · [curriculum statement + hints](../07_Sliding_Window/03_Problems/02_Medium/05_minimum_size_subarray_sum.md) (open after the mock)

Given an array of **positive** integers `nums` and a positive integer `target`, return the length of the
**shortest contiguous subarray** whose sum is `>= target`. Return `0` if none exists.

```
Input: target = 7,  nums = [2, 3, 1, 2, 4, 3]   Output: 2   Explanation: [4, 3]
Input: target = 4,  nums = [1, 4, 4]            Output: 1
Input: target = 11, nums = [1, 1, 1, 1, 1]      Output: 0
```

**Clarifying questions you should ask**

- Are all numbers positive? (yes; this is what makes sliding window valid)
- Contiguous, not subsequence? (contiguous)
- Can the array be empty? (return 0)

<details>
<summary>Hints</summary>

1. Brute force: every start index, extend until sum >= target. O(n^2).
2. "Contiguous" + "shortest" + positive numbers -> variable-size sliding window.
3. Expand `right` and add to `windowSum`. While `windowSum >= target`: record `right - left + 1`, then subtract `nums[left]` and move `left`.
4. Why do positives matter? Shrinking from the left always decreases the sum, so the window logic is monotonic.

</details>

**Expected complexity:** O(n) time (each index enters and leaves the window once), O(1) space.

**Follow-up questions an interviewer may ask**

- What if numbers can be negative? (sliding window breaks; use prefix sums + monotonic deque, O(n), or prefix sums + binary search for positive-only in O(n log n))
- Can you give an O(n log n) solution with prefix sums and binary search? (yes; shows you know [`10_Searching`](../10_Searching/README.md))
- How would you return the subarray itself, not just the length? (store `bestLeft` when updating the best)

---

## Problem 2 — Combination Sum (LeetCode 39, Medium) — 30 min

**Links:** [LeetCode #39](https://leetcode.com/problems/combination-sum/) · [curriculum statement + hints](../13_Backtracking/03_Problems/02_Medium/06_combination_sum.md) (open after the mock)

Given an array of **distinct** positive integers `candidates` and a `target`, return all **unique combinations**
where the chosen numbers sum to `target`. The same number may be chosen **unlimited** times.

```
Input: candidates = [2, 3, 6, 7], target = 7   Output: [[2, 2, 3], [7]]
Input: candidates = [2, 3, 5],    target = 8   Output: [[2,2,2,2], [2,3,3], [3,5]]
Input: candidates = [2],          target = 1   Output: []
```

**Clarifying questions you should ask**

- Are candidates distinct? (yes; if not, you need to sort and skip duplicates)
- Does order inside a combination matter? ([2,3] and [3,2] are the same; return each once)
- How big can the answer be? (small enough to enumerate; up to 150 combinations)

<details>
<summary>Hints</summary>

1. "Return all combinations" -> backtracking. The output is exponential, so there is no polynomial trick.
2. Template: `backtrack(startIndex, remaining, path)`. If `remaining === 0` push a copy of `path`. If `remaining < 0` return.
3. To avoid duplicates like [2,3] and [3,2], only consider candidates from `startIndex` onwards. Because reuse is allowed, recurse with the **same** index `i`, not `i + 1`.
4. Sort candidates first so you can `break` as soon as `candidates[i] > remaining` (pruning).

</details>

**Expected complexity:** O(k * 2^t) upper bound where `t = target / min(candidates)` (depth of recursion) and `k` = average path length; space O(t) for the recursion stack (plus output).
Say "exponential in the worst case, pruned by sorting" and you are fine.

**Follow-up questions an interviewer may ask**

- What changes if each candidate can be used at most once? (Combination Sum II, 40: recurse with `i + 1`, sort, skip `candidates[i] === candidates[i - 1]` at the same depth)
- What if you only need the **count** of combinations, not the list? (DP: unbounded knapsack, Coin Change II 518, O(n * target))
- What if order matters, so [2,3] and [3,2] both count? (Combination Sum IV, 377; it becomes a 1-D DP over target)

---

## Self-review (5 min)

- [ ] I explained why positive numbers make sliding window valid.
- [ ] I wrote the backtracking skeleton (choose, recurse, un-choose) without hesitation.
- [ ] I pushed a **copy** of `path` into the result, not the reference.
- [ ] I finished both problems within time.

Write 3 lines: what went well, what went wrong, what to review next.
