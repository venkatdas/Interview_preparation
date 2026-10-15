# Find the Index of the First Occurrence in a String

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Easy |
| **Pattern** | KMP search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #28 — https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/ |
| **Solution file** | [01_find_index_of_first_occurrence.js](../solutions/01_find_index_of_first_occurrence.js) — open only after a real attempt |

## Problem

Return the index of the first occurrence of `needle` in `haystack`, or -1 if it is not
part of haystack.

## Examples

```
Input: haystack = "sadbutsad", needle = "sad"   Output: 0
Input: haystack = "leetcode", needle = "leeto"  Output: -1
Input: haystack = "mississippi", needle = "issip"  Output: 4
```

## Constraints & clarifying questions

```
- Empty needle? (LeetCode says needle is non-empty; classic strStr returns 0)
- Lengths up to 10^4 -> naive O(n*m) passes, but the interviewer wants to hear "KMP"
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *KMP search* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * m) time, O(1) space. Try every start i in haystack and compare needle character by character.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (KMP)   O(n + m) time, O(m) space. Precompute lps (longest proper prefix that is also a suffix) for the needle.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- needle longer than haystack -> -1
- needle === haystack -> 0
- repeated characters ("aaab" in "aaaaaab")
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * m) time, O(1) space

```
Try every start i in haystack and compare needle character by character.
Worst case: haystack "aaaa...ab", needle "aaab" -> almost m comparisons at every i.
```

### APPROACH 2 — Optimal (KMP)   O(n + m) time, O(m) space

```
Precompute lps (longest proper prefix that is also a suffix) for the needle. While
scanning haystack with a match pointer j, a mismatch does NOT restart from scratch:
the first j chars matched, and lps[j-1] of them are also a prefix of the needle, so
we continue with j = lps[j-1]. The text pointer never moves backwards.

lps for "issip":   i s s i p
                   0 0 0 1 0
Dry run, haystack "mississippi":
  m: j=0 mismatch, stay            i: match j=1   s: j=2   s: j=3   i: j=4
  s (index 5) vs needle[4]='p': mismatch -> j = lps[3] = 1; needle[1]='s' matches -> j=2
  s (6): j=3     i (7): j=4     p (8): j=5 === m -> found at 8 - 5 + 1 = 4
```

### Edge cases

```
- needle longer than haystack -> -1
- needle === haystack -> 0
- repeated characters ("aaab" in "aaaaaab")
```

Full JavaScript solution with tests: [01_find_index_of_first_occurrence.js](../solutions/01_find_index_of_first_occurrence.js). Run it with `node 01_find_index_of_first_occurrence.js` from the solutions folder.

</details>

## Common mistakes

- Building the LPS table with `len = lps[len]` instead of `lps[len - 1]` on a mismatch, which loops forever or skips matches.
- Resetting the text pointer back after a mismatch; in KMP the text pointer `i` never moves backwards.
- Forgetting the empty-needle convention (LeetCode expects 0).

## Related follow-ups

- [Repeated Substring Pattern](../01_Easy/02_repeated_substring_pattern.md)
- [Repeated String Match](../02_Medium/03_repeated_string_match.md)
- [Shortest Palindrome](../03_Hard/06_shortest_palindrome.md)
- Rotate String (LeetCode #796)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
