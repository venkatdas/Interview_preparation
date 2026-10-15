# Palindrome Partitioning II

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Hard |
| **Pattern** | interval table + 1D DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #132 — https://leetcode.com/problems/palindrome-partitioning-ii/ |
| **Solution file** | [04_palindrome_partitioning_ii.js](../solutions/04_palindrome_partitioning_ii.js) — open only after a real attempt |

## Problem

Given a string s, split it into substrings so that every substring is a palindrome.
Return the MINIMUM number of cuts needed.

## Examples

```
Input: "aab"     Output: 1    Explanation: "aa" | "b"
Input: "a"       Output: 0
Input: "ab"      Output: 1
Input: "abcba"   Output: 0    Explanation: already a palindrome
Input: "abccbc"  Output: 2    Explanation: "a" | "bccb" | "c"
```

## Constraints & clarifying questions

```
- 1 <= s.length <= 2000, lowercase letters only
- Is the empty string possible? (no; but we handle it -> 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *interval table + 1D DP* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n * n) time, O(n) space. From position i, try every end j >= i.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / Tabulation (interval table + 1D DP)   O(n^2) time, O(n^2) space. Two DPs.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- length 1 -> 0
- whole string palindrome -> 0 (j = 0 branch)
- all distinct chars -> n - 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n * n) time, O(n) space

```
From position i, try every end j >= i. If s[i..j] is a palindrome (checked by
scanning), cut there and recurse from j + 1. Take the minimum. Every position can be
a cut or not -> 2^n partitions.
```

### APPROACH 2 — Memo / Tabulation (interval table + 1D DP)   O(n^2) time, O(n^2) space

```
Two DPs. The first is a classic INTERVAL table, the second is a 1D prefix DP that
reads it.

  TABLE 1 (interval)
  STATE      isPal[l][r] = true if s[l..r] is a palindrome
  RECURRENCE isPal[l][r] = s[l] === s[r] && (r - l < 2 || isPal[l+1][r-1])
  BASE CASES isPal[i][i] = true;  length-2: s[l] === s[r]
  Fill by increasing length (or l from n-1 down, r from l up) so the inner range is ready.

  TABLE 2 (1D)
  STATE      cuts[i] = min cuts for the prefix s[0..i-1]  (first i chars)
  RECURRENCE cuts[i] = min over j < i with isPal[j][i-1] of:
                       (j === 0 ? 0 : cuts[j] + 1)
             "the last piece is s[j..i-1]; it must be a palindrome; before it we need
              cuts[j] cuts plus one more cut to separate the last piece (unless j = 0)"
  BASE CASES cuts[0] = 0
  ANSWER     cuts[n]

Dry run on "aab":
  isPal: [0][0]=T [1][1]=T [2][2]=T [0][1]=T("aa") [1][2]=F [0][2]=F
  cuts[1]: j=0 isPal[0][0] -> 0                 => cuts[1] = 0
  cuts[2]: j=0 isPal[0][1] -> 0                 => cuts[2] = 0
  cuts[3]: j=0 isPal[0][2]? F
           j=1 isPal[1][2]? F
           j=2 isPal[2][2] T -> cuts[2]+1 = 1   => cuts[3] = 1
  answer 1
```

### Edge cases

```
- length 1 -> 0
- whole string palindrome -> 0 (j = 0 branch)
- all distinct chars -> n - 1
```

Full JavaScript solution with tests: [04_palindrome_partitioning_ii.js](../solutions/04_palindrome_partitioning_ii.js). Run it with `node 04_palindrome_partitioning_ii.js` from the solutions folder.

</details>

## Common mistakes

- Recomputing "is s[i..j] a palindrome?" inside the cut loop, making it O(n^3); precompute the boolean table first.
- Returning the number of pieces instead of the number of cuts (pieces - 1).
- Filling `isPal[i][j]` before `isPal[i+1][j-1]` is known; go by increasing length or i from right to left.

## Related follow-ups

- Palindrome Partitioning (LeetCode #131, backtracking)
- [Longest Palindromic Substring](../../../03_Strings_And_Sequences/03_Problems/02_Medium/05_longest_palindromic_substring.md)
- [Word Break](../../../01_One_Dimensional_DP/03_Problems/02_Medium/17_word_break.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
