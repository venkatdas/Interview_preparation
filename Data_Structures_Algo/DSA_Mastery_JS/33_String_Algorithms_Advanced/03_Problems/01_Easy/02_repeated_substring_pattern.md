# Repeated Substring Pattern

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Easy |
| **Pattern** | LPS period trick |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #459 — https://leetcode.com/problems/repeated-substring-pattern/ |
| **Solution file** | [02_repeated_substring_pattern.js](../solutions/02_repeated_substring_pattern.js) — open only after a real attempt |

## Problem

Return true if s can be built by taking one of its substrings and repeating it two or
more times.

## Examples

```
Input: "abab"          Output: true   ("ab" x 2)
Input: "aba"           Output: false
Input: "abcabcabcabc"  Output: true   ("abc" x 4, also "abcabc" x 2)
```

## Constraints & clarifying questions

```
- Length >= 1; a single character cannot be repeated "two or more times" -> false
- Lowercase letters
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *LPS period trick* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * d(n)) ~ O(n^2) worst case. For each candidate length L that divides n (L &lt; n), check that s equals s[0..L) repeated.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (KMP failure table)   O(n) time, O(n) space. Let p = lps[n-1] (longest proper prefix that is also a suffix).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "a" -> false; "aa" -> true
- all same letters -> true (n >= 2)
- "abac" -> false (p = 1, period 3, 4 % 3 != 0)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * d(n)) ~ O(n^2) worst case

```
For each candidate length L that divides n (L < n), check that s equals s[0..L) repeated.
```

### APPROACH 2 — Optimal (KMP failure table)   O(n) time, O(n) space

```
Let p = lps[n-1] (longest proper prefix that is also a suffix). The SMALLEST period of
s is n - p. The string is a repetition iff that period is shorter than n and divides n:
    p > 0  and  n % (n - p) === 0
One-liner alternative: (s + s).slice(1, -1).includes(s) - if s appears inside s+s
without using the first/last char, it has a non-trivial period.

Dry run on "abcabcabcabc" (n = 12):
  lps = [0,0,0,1,2,3,4,5,6,7,8,9]; p = 9; period = 12 - 9 = 3; 12 % 3 === 0 -> true
"aba": lps = [0,0,1]; p = 1; period 2; 3 % 2 !== 0 -> false
```

### Edge cases

```
- "a" -> false; "aa" -> true
- all same letters -> true (n >= 2)
- "abac" -> false (p = 1, period 3, 4 % 3 != 0)
```

Full JavaScript solution with tests: [02_repeated_substring_pattern.js](../solutions/02_repeated_substring_pattern.js). Run it with `node 02_repeated_substring_pattern.js` from the solutions folder.

</details>

## Common mistakes

- Using `n % (n - lps[n-1]) === 0` without also checking `lps[n-1] > 0` (a string with no border would wrongly pass).
- In the doubled-string trick, searching in `s + s` without removing the first and last character, so `s` is always found.
- Only trying divisors of n that are prime; every divisor length is a candidate.

## Related follow-ups

- [Longest Happy Prefix](../03_Hard/04_longest_happy_prefix.md)
- [Find the Index of the First Occurrence](01_find_index_of_first_occurrence.md)
- Rotate String (LeetCode #796)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
