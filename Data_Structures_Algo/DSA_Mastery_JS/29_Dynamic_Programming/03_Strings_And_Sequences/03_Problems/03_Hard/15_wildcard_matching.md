# Wildcard Matching

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Hard |
| **Pattern** | pattern table with `*` |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #44 — https://leetcode.com/problems/wildcard-matching/ |
| **Solution file** | [15_wildcard_matching.js](../solutions/15_wildcard_matching.js) — open only after a real attempt |

## Problem

Given a string s and a pattern p, implement matching with:
  '?' matches any single character
  '*' matches any sequence of characters (including the empty sequence)
The match must cover the ENTIRE string.

## Examples

```
Input: s = "aa", p = "a"      Output: false
Input: s = "aa", p = "*"      Output: true
Input: s = "cb", p = "?a"     Output: false   Explanation: '?' eats c, then a != b
Input: s = "adceb", p = "*a*b" Output: true   Explanation: first * = "", second * = "dce"
```

## Constraints & clarifying questions

```
- Is '*' a single wildcard "any run" (yes, unlike regex where it modifies the
  previous char)?
- Empty s / empty p? ("" matches "" and "***"; "" never matches a non-empty s)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *pattern table with `*`* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space. Walk both.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(n) space. Two rows, same recurrence.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- p = "" and s = "" -> true; p = "" and s != "" -> false
- p = "*" -> always true
- consecutive stars "a**b" behave like one star
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space

```
Walk both. Normal char or '?': must match, advance both. '*': either it matches
nothing (advance j) or it eats one more char of s (advance i, stay on the '*').
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(n) space

```
Two rows, same recurrence.
(There is also a greedy O(m*n) worst / O(m+n) typical two-pointer solution that
remembers the last '*' position; DP is the one to know first.)
```

### DP definition

```
STATE      dp[i][j] = does s[0..i) match p[0..j)

RECURRENCE p[j-1] is a letter or '?': dp[i][j] = dp[i-1][j-1] && (p[j-1]==='?' || p[j-1]===s[i-1])
p[j-1] is '*':            dp[i][j] = dp[i][j-1]   ('*' matches empty)
                                             || dp[i-1][j]   ('*' eats s[i-1], stays)
BASE CASES dp[0][0] = true; dp[0][j] = true only while p[0..j) is all '*';
dp[i][0] = false for i > 0
ANSWER     dp[m][n]
Table for s = "adceb", p = "*a*b" (rows = i chars of s, cols = j chars of p):
           ""  *  a  *  b
       ""   T  T  F  F  F
       a    F  T  T  T  F      dp[1][2]: 'a'=='a' && dp[0][1] -> T
       d    F  T  F  T  F      dp[2][3]: '*' -> dp[2][2] F || dp[1][3] T -> T
       c    F  T  F  T  F
       e    F  T  F  T  F
       b    F  T  F  T  T      dp[5][4]: 'b'=='b' && dp[4][3] -> T   answer true
```

### Edge cases

```
- p = "" and s = "" -> true; p = "" and s != "" -> false
- p = "*" -> always true
- consecutive stars "a**b" behave like one star
```

Full JavaScript solution with tests: [15_wildcard_matching.js](../solutions/15_wildcard_matching.js). Run it with `node 15_wildcard_matching.js` from the solutions folder.

</details>

## Common mistakes

- Treating `*` like regex `*` (repeat the previous character); in wildcard it matches any sequence on its own.
- Forgetting that an empty string can still match a pattern made only of `*` (base row `dp[0][j]`).
- Letting `?` match the empty string; it must consume exactly one character.

## Related follow-ups

- [Regular Expression Matching](16_regular_expression_matching.md)
- [Edit Distance](../02_Medium/10_edit_distance.md)
- Valid Parenthesis String (LeetCode #678)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
