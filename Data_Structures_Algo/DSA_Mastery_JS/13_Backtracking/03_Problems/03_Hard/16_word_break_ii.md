# Word Break II

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Hard |
| **Pattern** | backtracking + memoization |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #140 — https://leetcode.com/problems/word-break-ii/ |
| **Solution file** | [16_word_break_ii.js](../solutions/16_word_break_ii.js) — open only after a real attempt |

## Problem

Given a string s and a dictionary of words, return ALL sentences made by inserting
spaces into s so that every word is in the dictionary. Words may be reused.

## Examples

```
Input: s = "catsanddog", dict = ["cat","cats","and","sand","dog"]
Output: ["cats and dog","cat sand dog"]
Input: s = "pineapplepenapple", dict = ["apple","pen","applepen","pine","pineapple"]
Output: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
Input: s = "catsandog", dict = ["cats","dog","sand","and","cat"]   Output: []
```

## Constraints & clarifying questions

```
- s.length <= 20, dictionary <= 1000 words, each <= 10 chars
- Output can be exponential in theory ("aaaa..." with dict ["a","aa","aaa"])
- Order of sentences does not matter
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *backtracking + memoization* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain backtracking)   O(2^n * n) time. go(start, words): if start === n, record words.join(' ').

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking + memoization on the start index). O(n^2 + size of output) time, O(n * output) space The sub-problem "all sentences for s[start..]" depends only on `start`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- No valid split -> []
- s is itself one dictionary word -> [s]
- Words reused: "aaa" with ["a","aa"] -> ["a a a","a aa","aa a"]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain backtracking)   O(2^n * n) time

```
go(start, words): if start === n, record words.join(' '). Else for every end, if
s[start..end] is a word, take it and recurse from end + 1. Correct, but the same
suffix (e.g. "dog" after both "cats and" and "cat sand") is re-explored from scratch.
```

### APPROACH 2 — Optimal (Backtracking + memoization on the start index)

```
O(n^2 + size of output) time, O(n * output) space
The sub-problem "all sentences for s[start..]" depends only on `start`. Cache it in
a Map: memo[start] = array of sentences. Each start is solved once; building the
answer for `start` is: for each word w at start, prefix w to each sentence of
memo[start + w.length]. This is the "memoization teaser" from the README applied to a
backtracking problem: it works because the RESULT of a suffix is reusable, not just
a yes/no.

Dry run "catsanddog":
  solve(0): "cat" -> solve(3): "sand" -> solve(7): "dog" -> solve(10) = [""]
                                         -> ["dog"]       memo[7]
                      -> ["sand dog"]                      memo[3]
            "cats" -> solve(4): "and" -> solve(7) cached ["dog"] -> ["and dog"]   memo[4]
  -> ["cat sand dog", "cats and dog"]
```

### Edge cases

```
- No valid split -> []
- s is itself one dictionary word -> [s]
- Words reused: "aaa" with ["a","aa"] -> ["a a a","a aa","aa a"]
```

Full JavaScript solution with tests: [16_word_break_ii.js](../solutions/16_word_break_ii.js). Run it with `node 16_word_break_ii.js` from the solutions folder.

</details>

## Common mistakes

- Plain backtracking without memo times out on inputs like `aaaa...ab` with many prefixes.
- Joining words with extra or missing spaces at the ends.
- Using an array for the dictionary (O(m) lookups) instead of a Set.

## Related follow-ups

- [Word Break](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/17_word_break.md) (29_Dynamic_Programming/01_One_Dimensional_DP)
- [Palindrome Partitioning](../02_Medium/10_palindrome_partitioning.md)
- Concatenated Words (LeetCode #472)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
