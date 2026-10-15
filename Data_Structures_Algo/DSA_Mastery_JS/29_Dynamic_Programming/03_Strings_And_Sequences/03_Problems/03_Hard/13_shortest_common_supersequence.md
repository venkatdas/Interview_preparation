# Shortest Common Supersequence

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Hard |
| **Pattern** | LCS + reconstruct the string |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1092 — https://leetcode.com/problems/shortest-common-supersequence/ |
| **Solution file** | [13_shortest_common_supersequence.js](../solutions/13_shortest_common_supersequence.js) — open only after a real attempt |

## Problem

Given strings str1 and str2, return the SHORTEST string that has both of them
as subsequences. If several exist, any is fine.

## Examples

```
Input: str1 = "abac", str2 = "cab"   Output: "cabac"
  Explanation: "cabac" contains "abac" (positions 1-4) and "cab" (positions 0-2);
  nothing shorter works.
Input: str1 = "aaaaaaaa", str2 = "aaaaaaaa"   Output: "aaaaaaaa"
```

## Constraints & clarifying questions

```
- Return the string or its length? (the string; the length is m + n - LCS)
- Empty inputs? (return the other string)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *LCS + reconstruct the string* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space. Build the answer left to right.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one string empty -> return the other
- identical strings -> that string
- no common chars -> any concatenation of length m + n (we produce str1 + str2)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space

```
Build the answer left to right. If the current chars are equal, emit it once and
advance both. Otherwise emit str1[i] and advance i, OR emit str2[j] and advance j;
keep the shorter result. Exponential because (i, j) repeats.
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### DP definition

```
STATE      dp[i][j] = length of the shortest supersequence of str1[0..i) and str2[0..j)

RECURRENCE if str1[i-1] === str2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])
BASE CASES dp[i][0] = i, dp[0][j] = j  (supersequence of X and "" is X)

ANSWER     dp[m][n] is the length; walk the table backwards to build the string:
- chars equal -> emit once, go diagonal
           - else go to the smaller neighbour and emit the char we "consumed"
           - when one string is exhausted, emit the rest of the other

Table for "abac" vs "cab":
           ""  c  a  b
       ""   0  1  2  3
       a    1  2  2  3
       b    2  3  3  3
       a    3  4  4  4
       c    4  4  5  5      length 5

Walking back from (4,3): c!=b, dp[3][3]=4 < dp[4][2]=5 -> go up, emit 'c'.
(3,3): a!=b, up=3 vs left=4 -> go up, emit 'a'. (2,3): b==b -> emit 'b', diagonal.
(1,2): a==a -> emit 'a', diagonal. (0,1): str1 exhausted, emit remaining "c".
Emitted in reverse: c a b a c -> reversed = "cabac".

The `tabulation` version builds the string this way. The `memo` version stores
strings in the cache (simpler, more memory) to show the alternative.
```

### Edge cases

```
- one string empty -> return the other
- identical strings -> that string
- no common chars -> any concatenation of length m + n (we produce str1 + str2)
```

Full JavaScript solution with tests: [13_shortest_common_supersequence.js](../solutions/13_shortest_common_supersequence.js). Run it with `node 13_shortest_common_supersequence.js` from the solutions folder.

</details>

## Common mistakes

- Concatenating the strings and removing one LCS greedily without walking the table; you must backtrack through the LCS table to interleave correctly.
- Forgetting to append the leftover characters of whichever string is not exhausted at the end of the walk.
- Assuming the answer is unique — any supersequence of minimum length is accepted.

## Related follow-ups

- [Longest Common Subsequence](../02_Medium/01_longest_common_subsequence.md)
- [Delete Operation for Two Strings](../02_Medium/08_delete_operation_for_two_strings.md)
- [Interleaving String](../02_Medium/12_interleaving_string.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
