# Mock Interview Set 08 — Dynamic Programming

**Time:** 75 minutes total. Problem 1: 30 min. Problem 2: 35 min. 10 min to review.
**Covers:** [`29_Dynamic_Programming/01_One_Dimensional_DP`](../29_Dynamic_Programming/01_One_Dimensional_DP/README.md), [`29_Dynamic_Programming/03_Strings_And_Sequences`](../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) (and [`10_Searching`](../10_Searching/README.md) for the follow-up)
**When:** after finishing [Mixed Set 06](../43_Mixed_Problem_Sets/03_Problems/set_06/README.md)

**Rules**

- Timer on. For each problem, write the **state**, the **recurrence** and the **base cases** in words before any code.
- Show the recursive (memoized) version first if that is how you think; convert to a table only if asked.
- Open the Hints only when the problem's time is half gone and you have nothing.
- Score yourself afterwards with the [rubric](RUBRIC.md).

---

## Problem 1 — Longest Increasing Subsequence (LeetCode 300, Medium) — 30 min

**Links:** [LeetCode #300](https://leetcode.com/problems/longest-increasing-subsequence/) · [curriculum statement + hints](../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/03_longest_increasing_subsequence.md) (open after the mock)

Given an integer array `nums`, return the length of the longest **strictly** increasing subsequence
(elements in order, not necessarily adjacent).

```
Input: [10, 9, 2, 5, 3, 7, 101, 18]   Output: 4   Explanation: [2, 3, 7, 101]
Input: [0, 1, 0, 3, 2, 3]             Output: 4
Input: [7, 7, 7, 7]                   Output: 1
```

**Clarifying questions you should ask**

- Strictly increasing? (yes; equal values do not extend)
- Length only, or the subsequence itself? (length; the sequence is a follow-up)
- n up to? (2500 -> O(n^2) passes; then "can you do O(n log n)?")

<details>
<summary>Hints</summary>

1. Brute force: every subsequence, O(2^n). What subproblem repeats?
2. `dp[i]` = length of the longest increasing subsequence **ending at** `i`. `dp[i] = 1 + max(dp[j])` for `j < i` with `nums[j] < nums[i]`. Answer = `max(dp)`. O(n^2).
3. O(n log n): keep `tails[len]` = the smallest possible tail of an increasing subsequence of length `len + 1`. For each number, binary search the first tail `>= x` and replace it (or append).
4. `tails` is not an actual subsequence; only its length is meaningful. Say that before the interviewer asks.

</details>

**Expected complexity:** O(n^2) time / O(n) space with the DP; O(n log n) time / O(n) space with patience sorting.

**Follow-up questions an interviewer may ask**

- Return one actual LIS. (store parent indices in the O(n^2) DP, or index-tracking in the tails version)
- Count the number of LIS (673). (second array `count[i]`)
- Non-decreasing instead of strictly increasing? (binary search for the first tail `> x`)
- Russian Doll Envelopes (354). (sort by width asc, height desc, then LIS on heights)

---

## Problem 2 — Edit Distance (LeetCode 72, Medium) — 35 min

**Links:** [LeetCode #72](https://leetcode.com/problems/edit-distance/) · [curriculum statement + hints](../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/10_edit_distance.md) (open after the mock)

Given two strings `a` and `b`, return the minimum number of operations to turn `a` into `b`. Allowed
operations: insert a character, delete a character, replace a character.

```
Input: a = "horse",     b = "ros"         Output: 3   Explanation: horse -> rorse -> rose -> ros
Input: a = "intention", b = "execution"   Output: 5
Input: a = "",          b = "abc"         Output: 3
```

**Clarifying questions you should ask**

- All three operations cost 1? (yes)
- Character set? (lowercase; does not matter for the DP)
- Lengths up to? (500 each -> O(n·m) = 250k cells is fine)

<details>
<summary>Hints</summary>

1. State: `dp[i][j]` = edit distance between the first `i` chars of `a` and the first `j` chars of `b`.
2. Base cases: `dp[i][0] = i` (delete everything), `dp[0][j] = j` (insert everything).
3. If `a[i-1] === b[j-1]`: `dp[i][j] = dp[i-1][j-1]`. Else `1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace))`.
4. Space: each row depends only on the previous row -> two rows, O(min(n, m)) space.

</details>

**Expected complexity:** O(n · m) time, O(n · m) space (or O(min(n, m)) with rolling rows).

**Follow-up questions an interviewer may ask**

- Return the sequence of operations. (walk back from `dp[n][m]` choosing the move that produced each value)
- Different costs per operation? (same recurrence with weights)
- Only insert and delete allowed? (n + m − 2·LCS)
- "Is the edit distance at most 1?" (One Edit Distance, 161 — O(n) two-pointer, no table)

---

## Self-review (10 min)

- [ ] I wrote the state in one sentence before writing code.
- [ ] I got the base cases right on the first try (empty prefix rows/columns).
- [ ] I mentioned the O(n log n) LIS idea and explained why `tails` is not the subsequence.
- [ ] I explained what each of the three moves in the edit-distance recurrence means.
- [ ] I finished both problems within time.

Fill in the [self-review template](SELF_REVIEW_TEMPLATE.md) and score yourself with the [rubric](RUBRIC.md).
