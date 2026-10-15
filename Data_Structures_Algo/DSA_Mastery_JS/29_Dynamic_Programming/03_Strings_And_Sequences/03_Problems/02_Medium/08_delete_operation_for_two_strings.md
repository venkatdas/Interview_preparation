# Delete Operation for Two Strings

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | LCS variant |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #583 — https://leetcode.com/problems/delete-operation-for-two-strings/ |
| **Solution file** | [08_delete_operation_for_two_strings.js](../solutions/08_delete_operation_for_two_strings.js) — open only after a real attempt |

## Problem

Given two strings word1 and word2, return the minimum number of single-character
deletions (from either string) needed to make the two strings equal.

## Examples

```
Input: "sea", "eat"       Output: 2   Explanation: "sea" -> "ea", "eat" -> "ea"
Input: "leetcode", "etco" Output: 4
Input: "abc", "abc"       Output: 0
```

## Constraints & clarifying questions

```
- Empty strings? (then we delete everything from the other -> its length)
- Only deletions allowed? (yes - no insert/replace, that is Edit Distance)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *LCS variant* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space. If the current chars match, keep both and move on.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- both empty -> 0
- one empty -> length of the other
- nothing in common -> m + n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space

```
If the current chars match, keep both and move on. Otherwise delete from word1
OR from word2 (cost 1 each) and take the smaller.
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### DP definition

```
STATE      dp[i][j] = min deletions to make word1[0..i) and word2[0..j) equal

RECURRENCE if word1[i-1] === word2[j-1]: dp[i][j] = dp[i-1][j-1]
else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])
BASE CASES dp[i][0] = i, dp[0][j] = j  (delete every char of the non-empty one)

ANSWER     dp[m][n]
Table for "sea" vs "eat":
           ""  e  a  t
       ""   0  1  2  3
       s    1  2  3  4
       e    2  1  2  3
       a    3  2  1  2      answer 2

SHORTCUT: answer = m + n - 2 * LCS. Everything outside the LCS must be deleted.
`optimized` uses this with a two-row LCS, O(min) space.
```

### Edge cases

```
- both empty -> 0
- one empty -> length of the other
- nothing in common -> m + n
```

Full JavaScript solution with tests: [08_delete_operation_for_two_strings.js](../solutions/08_delete_operation_for_two_strings.js). Run it with `node 08_delete_operation_for_two_strings.js` from the solutions folder.

</details>

## Common mistakes

- Using full edit distance (with replace) — only deletions are allowed here, so a replace costs 2.
- Forgetting that the answer is `m + n - 2 * LCS`, then building a separate, buggier table.
- Base cases: deleting everything from a prefix of length i costs i, not 0.

## Related follow-ups

- [Longest Common Subsequence](01_longest_common_subsequence.md)
- [Edit Distance](10_edit_distance.md)
- Minimum ASCII Delete Sum for Two Strings (LeetCode #712)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
