# Edit Distance

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | three-operation table |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #72 — https://leetcode.com/problems/edit-distance/ |
| **Solution file** | [10_edit_distance.js](../solutions/10_edit_distance.js) — open only after a real attempt |

## Problem

Given two strings word1 and word2, return the minimum number of operations to
convert word1 into word2. Allowed operations, each costing 1:
  insert a character, delete a character, replace a character.

## Examples

```
Input: "horse", "ros"           Output: 3
  Explanation: horse -> rorse (replace h) -> rose (delete r) -> ros (delete e)
Input: "intention", "execution" Output: 5
Input: "", "abc"                Output: 3   Explanation: three inserts
```

## Constraints & clarifying questions

```
- Are all three operations cost 1? (yes; if costs differ the recurrence stays the
  same, only the constants change)
- Empty strings? (distance = length of the other)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *three-operation table* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(3^(m+n)) time, O(m+n) space. Compare the current chars.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(n) space. Two rows; remember to set curr[0] = i for each new row.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- both empty -> 0
- identical -> 0
- one empty -> length of the other
- completely different, same length -> that length (all replaces)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(3^(m+n)) time, O(m+n) space

```
Compare the current chars. If equal, free, move both. Otherwise try all three:
  replace -> move both, insert -> move j only, delete -> move i only. 1 + min.
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(n) space

```
Two rows; remember to set curr[0] = i for each new row.
```

### DP definition

```
STATE      dp[i][j] = min ops to turn word1[0..i) into word2[0..j)

RECURRENCE if word1[i-1] === word2[j-1]: dp[i][j] = dp[i-1][j-1]
else dp[i][j] = 1 + min( dp[i-1][j-1]   replace
                                   , dp[i-1][j]     delete word1[i-1]
                                   , dp[i][j-1] )   insert word2[j-1]
BASE CASES dp[i][0] = i (delete all), dp[0][j] = j (insert all)

ANSWER     dp[m][n]
Table for "horse" -> "ros":
           ""  r  o  s
       ""   0  1  2  3
       h    1  1  2  3      dp[1][1]: h!=r -> 1 + min(0, 1, 1) = 1 (replace)
       o    2  2  1  2      dp[2][2]: o==o -> dp[1][1] = 1
       r    3  2  2  2
       s    4  3  3  2      dp[4][3]: s==s -> dp[3][2] = 2
       e    5  4  4  3      answer 3

Reading a cell: "up-left" = replace/match, "up" = delete, "left" = insert.
```

### Edge cases

```
- both empty -> 0
- identical -> 0
- one empty -> length of the other
- completely different, same length -> that length (all replaces)
```

Full JavaScript solution with tests: [10_edit_distance.js](../solutions/10_edit_distance.js). Run it with `node 10_edit_distance.js` from the solutions folder.

</details>

## Common mistakes

- Wrong base cases: `dp[i][0] = i` and `dp[0][j] = j` (delete or insert everything), not 0.
- Adding 1 even when the characters match; a match costs nothing: `dp[i][j] = dp[i-1][j-1]`.
- Mixing up which neighbour is insert vs delete — harmless for the number, but wrong when reconstructing the operations.

## Related follow-ups

- [Delete Operation for Two Strings](08_delete_operation_for_two_strings.md)
- One Edit Distance (LeetCode #161)
- [Wildcard Matching](../03_Hard/15_wildcard_matching.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
