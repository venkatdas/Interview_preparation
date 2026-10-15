# Palindrome Partitioning

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | partition with cut positions |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #131 — https://leetcode.com/problems/palindrome-partitioning/ |
| **Solution file** | [10_palindrome_partitioning.js](../solutions/10_palindrome_partitioning.js) — open only after a real attempt |

## Problem

Given a string s, split it into pieces so that every piece is a palindrome.
Return all such partitions.

## Examples

```
Input: "aab"   Output: [["a","a","b"],["aa","b"]]
Input: "a"     Output: [["a"]]
```

## Constraints & clarifying questions

```
- 1 <= s.length <= 16 (so 2^15 ways to cut at most)
- Lowercase letters only
- Is a single character a palindrome? (yes, so a solution always exists)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *partition with cut positions* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n * n) time. There are n-1 gaps between characters; each gap is either a cut or not -> 2^(n-1) partitions.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking over cut positions)   O(n * 2^n) worst, O(n) stack. go(start, parts): if start === s.length we used up the string -> record.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all same letters "aaa" -> 4 partitions (2^(n-1))
- no palindromes longer than 1 ("abc") -> only [["a","b","c"]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n * n) time

```
There are n-1 gaps between characters; each gap is either a cut or not -> 2^(n-1)
partitions. Generate them all with a bit mask, then check every piece.
```

### APPROACH 2 — Optimal (Backtracking over cut positions)   O(n * 2^n) worst, O(n) stack

```
go(start, parts): if start === s.length we used up the string -> record.
Otherwise try every end >= start; if s[start..end] is a palindrome, take it as the
next piece and recurse from end + 1. Pruning happens naturally: a non-palindrome
piece is never taken, so whole subtrees are skipped.
Optional speed-up: precompute isPal[i][j] with DP so each check is O(1).

Dry run "aab":
  go(0,[])
    end=0 "a" pal -> go(1,["a"])
      end=1 "a" pal -> go(2,["a","a"])
        end=2 "b" pal -> go(3,["a","a","b"]) record
      end=2 "ab" not pal -> skip
    end=1 "aa" pal -> go(2,["aa"])
      end=2 "b" pal -> go(3,["aa","b"]) record
    end=2 "aab" not pal
```

### Edge cases

```
- all same letters "aaa" -> 4 partitions (2^(n-1))
- no palindromes longer than 1 ("abc") -> only [["a","b","c"]]
```

Full JavaScript solution with tests: [10_palindrome_partitioning.js](../solutions/10_palindrome_partitioning.js). Run it with `node 10_palindrome_partitioning.js` from the solutions folder.

</details>

## Common mistakes

- Off-by-one in substring bounds: `s.slice(start, end + 1)` vs `s.slice(start, end)`.
- Re-checking the same substring for palindrome many times; precompute an `isPal[i][j]` table.
- Recording a partition before reaching the end of the string.

## Related follow-ups

- [Palindromic Substrings](../../../04_Strings/03_Problems/02_Medium/13_palindromic_substrings.md) (04_Strings)
- [Longest Palindromic Substring](../../../04_Strings/03_Problems/02_Medium/07_longest_palindromic_substring.md) (04_Strings)
- Palindrome Partitioning II (LeetCode #132)
- [Word Break II](../03_Hard/16_word_break_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
