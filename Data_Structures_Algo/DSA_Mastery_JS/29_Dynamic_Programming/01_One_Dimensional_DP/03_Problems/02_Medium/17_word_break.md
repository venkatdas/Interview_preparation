# Word Break

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | split the prefix |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #139 — https://leetcode.com/problems/word-break/ |
| **Solution file** | [17_word_break.js](../solutions/17_word_break.js) — open only after a real attempt |

## Problem

Given a string s and a dictionary of words, return true if s can be split
into a sequence of one or more dictionary words (words may be reused).

## Examples

```
Input: s = "leetcode", dict = ["leet","code"]            Output: true
Input: s = "applepenapple", dict = ["apple","pen"]       Output: true
Input: s = "catsandog", dict = ["cats","dog","sand","and","cat"]   Output: false
```

## Constraints & clarifying questions

```
- 1 <= s.length <= 300, dictionary words are unique
- Can a word be reused? (yes)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *split the prefix* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time. From each start index, try every dictionary word that matches and recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Not applicable for space; dp[i] depends on arbitrary earlier cells.. (Optimization: only try j in [i - maxWordLength, i-1].)

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- s is exactly one dictionary word
- dictionary is empty -> false
- "aaaaab" with ["a","aa"] -> false (classic exponential trap without memo)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time

```
From each start index, try every dictionary word that matches and recurse.
```

### APPROACH 2 — Memoization   O(n^2 * wordLen) time, O(n) space

```
Cache by start index.
```

### APPROACH 3 — Tabulation   O(n^2) substring checks, O(n) space

```
Dry run, s = "leetcode", dict = {leet, code}:
  i    : 0  1  2  3  4  5  6  7  8
  dp   : T  F  F  F  T  F  F  F  T
  dp[4]: j=0, dp[0]=T and "leet" in dict -> T
  dp[8]: j=4, dp[4]=T and "code" in dict -> T
```

### APPROACH 4 — Not applicable for space; dp[i] depends on arbitrary earlier cells.

```
(Optimization: only try j in [i - maxWordLength, i-1].)
```

### DP definition

```
STATE:       dp[i] = can the prefix s[0..i-1] be fully segmented?
RECURRENCE:  dp[i] = OR over j &lt; i of ( dp[j] AND s[j..i-1] is a word )
BASE CASES:  dp[0] = true (empty prefix)
ANSWER:      dp[n]
```

### Edge cases

```
- s is exactly one dictionary word
- dictionary is empty -> false
- "aaaaab" with ["a","aa"] -> false (classic exponential trap without memo)
```

Full JavaScript solution with tests: [17_word_break.js](../solutions/17_word_break.js). Run it with `node 17_word_break.js` from the solutions folder.

</details>

## Common mistakes

- Greedily matching the longest (or shortest) word first; "aaaaaaa" with ["aaaa","aaa"] breaks greedy.
- Plain backtracking without memo, which is exponential on inputs like "aaaa...ab".
- Searching the dictionary as an array (`includes`) instead of a Set, adding a factor of the dictionary size.

## Related follow-ups

- [Decode Ways](10_decode_ways.md)
- Word Break II (LeetCode 140)
- [Palindrome Partitioning II](../../../05_Interval_DP/03_Problems/03_Hard/04_palindrome_partitioning_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
