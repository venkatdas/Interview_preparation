# Longest Duplicate Substring

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Hard |
| **Pattern** | binary search + rolling hash |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1044 — https://leetcode.com/problems/longest-duplicate-substring/ |
| **Solution file** | [07_longest_duplicate_substring.js](../solutions/07_longest_duplicate_substring.js) — open only after a real attempt |

## Problem

Return the longest substring that occurs at least twice in s (occurrences may overlap).
Return "" if every substring is unique.

## Examples

```
Input: "banana"   Output: "ana"
Input: "abcd"     Output: ""
```

## Constraints & clarifying questions

```
- Length up to 3 * 10^4 -> O(n^2) substring comparisons are too slow
- Lowercase letters
- Any longest answer is accepted if several exist
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *binary search + rolling hash* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time. For each length from n-1 down, put every substring of that length in a Set; the first duplicate found is the answer.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Binary search on length + rolling hash)   O(n log n) expected. Key observation: if a duplicate of length L exists, duplicates of every shorter length exist too (take a prefix).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no duplicates -> ""
- all same letters "aaaa" -> "aaa" (overlapping)
- length 1 -> ""
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time

```
For each length from n-1 down, put every substring of that length in a Set; the first
duplicate found is the answer. Building substrings costs O(n) each.
```

### APPROACH 2 — Optimal (Binary search on length + rolling hash)   O(n log n) expected

```
Key observation: if a duplicate of length L exists, duplicates of every shorter length
exist too (take a prefix). So "does a duplicate of length L exist?" is monotonic in L
-> binary search on L.
The check for a given L: slide a window of length L, compute its polynomial hash in O(1)
from the previous window (rolling), and look the hash up in a Set. O(n) per check.
Collisions: we use a large modulus and verify candidates by comparing the actual
substrings (store hash -> list of start indices). With two independent hashes
(double hashing) verification is almost never needed; one hash + verification is simpler.

Dry run on "banana": lo = 1, hi = 5
  L = 3: windows ban, ana, nan, ana -> "ana" repeats -> record "ana", lo = 4
  L = 4: bana, anan, nana -> no repeat -> hi = 3
  lo > hi -> answer "ana"
```

### Edge cases

```
- no duplicates -> ""
- all same letters "aaaa" -> "aaa" (overlapping)
- length 1 -> ""
```

Full JavaScript solution with tests: [07_longest_duplicate_substring.js](../solutions/07_longest_duplicate_substring.js). Run it with `node 07_longest_duplicate_substring.js` from the solutions folder.

</details>

## Common mistakes

- Multiplying two ~1e9 numbers directly; the product passes 2^53 and silently loses precision.
- Binary searching on the wrong monotonic property: if length L repeats, every shorter length also repeats, so move `lo` up on success.
- Trusting a hash match without verification or a second hash, so a collision returns a wrong substring.

## Related follow-ups

- [Distinct Echo Substrings](08_distinct_echo_substrings.md)
- Longest Repeating Substring (LeetCode #1062)
- Number of Distinct Substrings in a String (LeetCode #1698)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
