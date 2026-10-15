# Interleaving String

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | boolean table (i, j) with k = i + j |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #97 — https://leetcode.com/problems/interleaving-string/ |
| **Solution file** | [12_interleaving_string.js](../solutions/12_interleaving_string.js) — open only after a real attempt |

## Problem

Given strings s1, s2 and s3, return true if s3 can be formed by interleaving
s1 and s2: all characters of both are used, each keeps its own order, and the
two sequences can be mixed in any way.

## Examples

```
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"   Output: true
  Explanation: aa + dbb + c + bc + a + c   (s1 parts: aa,c,c  s2 parts: dbb,bc,a)
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"   Output: false
Input: s1 = "", s2 = "", s3 = ""                        Output: true
```

## Constraints & clarifying questions

```
- Must all characters be used? (yes: if s1.length + s2.length !== s3.length -> false)
- Empty strings allowed? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *boolean table (i, j) with k = i + j* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space. Walk s3.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(n) space. One row: dp[j] (same row, previous column) and old dp[j] (previous row) are both reachable if we iterate j left to right.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- length mismatch -> false immediately
- one of s1 / s2 empty -> s3 must equal the other
- all same chars "aa" + "aa" -> "aaaa" true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space

```
Walk s3. The next char of s3 must come from the front of s1 OR the front of s2.
Try both when both match. Note k = i + j always, so the state is just (i, j).
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(n) space

```
One row: dp[j] (same row, previous column) and old dp[j] (previous row) are both
reachable if we iterate j left to right.
```

### DP definition

```
STATE      dp[i][j] = can s1[0..i) and s2[0..j) interleave into s3[0..i+j)

RECURRENCE dp[i][j] = (s1[i-1] === s3[i+j-1] && dp[i-1][j])
|| (s2[j-1] === s3[i+j-1] && dp[i][j-1])
BASE CASES dp[0][0] = true; dp[i][0] = s1[0..i) === s3[0..i); dp[0][j] likewise

ANSWER     dp[m][n]
Table for s1 = "ab", s2 = "ac", s3 = "aabc" (rows = i chars of s1, cols = j of s2):
           j=0  j=1(a)  j=2(ac)
  i=0       T     T       F        row 0: s3 prefix must equal s2 prefix: "a" ok, "aa"!="ac"
  i=1(a)    T     T       F        dp[1][1]: s3[1]='a' from s1 -> dp[0][1]=T
  i=2(ab)   F     T       T        dp[2][2]: s3[3]='c' from s2 -> dp[2][1]=T  -> true
```

### Edge cases

```
- length mismatch -> false immediately
- one of s1 / s2 empty -> s3 must equal the other
- all same chars "aa" + "aa" -> "aaaa" true
```

Full JavaScript solution with tests: [12_interleaving_string.js](../solutions/12_interleaving_string.js). Run it with `node 12_interleaving_string.js` from the solutions folder.

</details>

## Common mistakes

- Skipping the length check `s1.length + s2.length === s3.length`.
- A greedy two-pointer that prefers s1 when both match; it fails on inputs like "aabcc"/"dbbca".
- Indexing s3 with `i + j` off by one — with prefix lengths i and j, the next character is `s3[i + j - 1]`.

## Related follow-ups

- [Distinct Subsequences](../03_Hard/11_distinct_subsequences.md)
- [Edit Distance](10_edit_distance.md)
- [Unique Paths (same grid shape)](../../../04_Grid_DP/03_Problems/02_Medium/01_unique_paths.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
