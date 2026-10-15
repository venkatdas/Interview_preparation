# Regular Expression Matching

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Hard |
| **Pattern** | pattern table with `x*` |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #10 — https://leetcode.com/problems/regular-expression-matching/ |
| **Solution file** | [16_regular_expression_matching.js](../solutions/16_regular_expression_matching.js) — open only after a real attempt |

## Problem

Given a string s and a pattern p, implement matching with:
  '.'  matches any single character
  '*'  matches ZERO OR MORE of the element right before it ("a*" = "", "a", "aa", ...)
The match must cover the ENTIRE string.

## Examples

```
Input: s = "aa",  p = "a"     Output: false
Input: s = "aa",  p = "a*"    Output: true    Explanation: a* = "aa"
Input: s = "ab",  p = ".*"    Output: true    Explanation: .* = any string
Input: s = "aab", p = "c*a*b" Output: true    Explanation: c* = "", a* = "aa", then b
Input: s = "mississippi", p = "mis*is*p*."   Output: false
```

## Constraints & clarifying questions

```
- Is '*' always preceded by a valid char (never first)? (yes, pattern is valid)
- Difference from wildcard matching: here '*' modifies the PREVIOUS char.
- Empty s / empty p? ("" matches "" and "a*b*"; non-empty s never matches "")
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *pattern table with `x*`* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space. Look at p[j] and whether p[j+1] is '*'.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(n) space. Two rows (dp[i][j-2] is in the current row, dp[i-1][j] and dp[i-1][j-1] in prev).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- s = "", p = "a*b*" -> true
- s = "a", p = "" -> false
- "ab" vs ".*c" -> false (whole string must match)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space

```
Look at p[j] and whether p[j+1] is '*'.
  - If p[j+1] is '*': the pair "x*" can match ZERO chars (jump to j+2), or, if
    p[j] matches s[i], match ONE char and stay on the same pair (i+1, j).
  - Otherwise p[j] must match s[i] and we advance both.
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(n) space

```
Two rows (dp[i][j-2] is in the current row, dp[i-1][j] and dp[i-1][j-1] in prev).
```

### DP definition

```
STATE      dp[i][j] = does s[0..i) match p[0..j)

RECURRENCE if p[j-1] !== '*':
dp[i][j] = dp[i-1][j-1] && firstMatch(s[i-1], p[j-1])
           if p[j-1] === '*'  (pair is p[j-2] p[j-1]):
               dp[i][j] = dp[i][j-2]                                  (zero copies)
                       || (firstMatch(s[i-1], p[j-2]) && dp[i-1][j])  (one more copy)
           where firstMatch(a, b) = b === '.' || a === b
BASE CASES dp[0][0] = true; dp[0][j] = dp[0][j-2] when p[j-1] === '*' (x* can vanish)

ANSWER     dp[m][n]
Table for s = "aab", p = "c*a*b" (rows = i chars of s, cols = j chars of p):
           ""  c  c*  a  a*  b
       ""   T  F  T   F  T   F     dp[0][2] = dp[0][0]; dp[0][4] = dp[0][2]
       a    F  F  F   T  T   F     dp[1][4]: zero copies dp[1][2]=F, or a matches && dp[0][4]=T
       a    F  F  F   F  T   F     dp[2][4]: a matches && dp[1][4]=T
       b    F  F  F   F  F   T     dp[3][5]: 'b'=='b' && dp[2][4]=T  -> true
```

### Edge cases

```
- s = "", p = "a*b*" -> true
- s = "a", p = "" -> false
- "ab" vs ".*c" -> false (whole string must match)
```

Full JavaScript solution with tests: [16_regular_expression_matching.js](../solutions/16_regular_expression_matching.js). Run it with `node 16_regular_expression_matching.js` from the solutions folder.

</details>

## Common mistakes

- Treating `*` as a standalone wildcard; it always applies to the character before it, so look at `p[j-2]`.
- For the "use the star once more" branch, forgetting to check that `s[i-1]` matches `p[j-2]` (or that it is `.`).
- Missing the base row: patterns like `a*b*` match the empty string.

## Related follow-ups

- [Wildcard Matching](15_wildcard_matching.md)
- [Distinct Subsequences](11_distinct_subsequences.md)
- [Edit Distance](../02_Medium/10_edit_distance.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
