# Uncrossed Lines

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | LCS in disguise |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1035 — https://leetcode.com/problems/uncrossed-lines/ |
| **Solution file** | [09_uncrossed_lines.js](../solutions/09_uncrossed_lines.js) — open only after a real attempt |

## Problem

Two integer arrays nums1 and nums2 are written on two parallel lines. You may
draw a straight line between nums1[i] and nums2[j] only if they are equal, and
lines must not cross (each number is used at most once). Return the maximum
number of lines you can draw.

## Examples

```
Input: nums1 = [1,4,2], nums2 = [1,2,4]       Output: 2
  Explanation: connect 1-1 and 4-4 (or 2-2); you cannot do both 4-4 and 2-2 because
  they would cross.
Input: nums1 = [2,5,1,2,5], nums2 = [10,5,2,1,5,2]   Output: 3
Input: nums1 = [1,3,7,1,7,5], nums2 = [1,9,2,5,1]    Output: 2
```

## Constraints & clarifying questions

```
- Can arrays be empty? (then 0)
- Duplicates? (yes, that is what makes it interesting)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *LCS in disguise* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space. "Lines that don't cross" = the connected pairs keep their relative order on both sides = a common subsequence.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(n) space. Two rows.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array -> 0
- identical arrays -> length
- no equal values -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space

```
"Lines that don't cross" = the connected pairs keep their relative order on both
sides = a common subsequence. So this IS Longest Common Subsequence in disguise.
Recurse: match and advance both, or skip one from either side.
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(n) space

```
Two rows.
```

### DP definition

```
STATE      dp[i][j] = max lines using nums1[0..i) and nums2[0..j)

RECURRENCE if nums1[i-1] === nums2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
BASE CASES dp[0][j] = dp[i][0] = 0

ANSWER     dp[m][n]
Table for [1,4,2] vs [1,2,4]:
           ""  1  2  4
       ""   0  0  0  0
       1    0  1  1  1
       4    0  1  1  2
       2    0  1  2  2     answer 2
```

### Edge cases

```
- empty array -> 0
- identical arrays -> length
- no equal values -> 0
```

Full JavaScript solution with tests: [09_uncrossed_lines.js](../solutions/09_uncrossed_lines.js). Run it with `node 09_uncrossed_lines.js` from the solutions folder.

</details>

## Common mistakes

- Trying a greedy "connect the first match you see"; it is exactly LCS on the two arrays.
- Comparing indices instead of values.
- Allowing one number to be connected twice — the diagonal move uses each element once.

## Related follow-ups

- [Longest Common Subsequence](01_longest_common_subsequence.md)
- [Delete Operation for Two Strings](08_delete_operation_for_two_strings.md)
- Max Dot Product of Two Subsequences (LeetCode #1458)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
