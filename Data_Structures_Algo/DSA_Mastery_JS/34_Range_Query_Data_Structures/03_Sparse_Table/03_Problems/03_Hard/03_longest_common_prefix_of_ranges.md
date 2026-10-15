# Longest Common Prefix of two suffixes

| | |
|---|---|
| **Topic** | Sparse Table (Range Minimum Query) |
| **Difficulty** | Hard |
| **Pattern** | suffix array + LCP array + RMQ |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [03_longest_common_prefix_of_ranges.js](../solutions/03_longest_common_prefix_of_ranges.js) — open only after a real attempt |

## Problem

Given a string s and many queries (i, j), return the length of the longest common
prefix of the suffixes s[i..] and s[j..].
Example use: "how long do s[i..] and s[j..] agree?" is the core of repeated-substring,
distinct-substring counting and suffix-array based string problems.

## Examples

```
s = "banana"
  lcp(1, 3) -> "anana" vs "ana"  -> 3
  lcp(0, 2) -> "banana" vs "nana" -> 0
  lcp(2, 4) -> "nana" vs "na"    -> 2
```

## Constraints & clarifying questions

```
- Many queries on one fixed string? (yes -> precompute; one query -> just compare chars)
- i === j allowed? (yes, answer = n - i)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *suffix array + LCP array + RMQ* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per query. Compare s[i + t] and s[j + t] for t = 0, 1, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Suffix array + LCP array + sparse table)   O(n log^2 n) build, O(1) query. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- i === j -> n - i
- one suffix is a prefix of the other ("ana" vs "anana" -> 3)
- single-character string
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per query

```
Compare s[i + t] and s[j + t] for t = 0, 1, ... until they differ.
```

### APPROACH 2 — Optimal (Suffix array + LCP array + sparse table)   O(n log^2 n) build, O(1) query

```
1. Suffix array `sa`: the suffix start indices sorted lexicographically, with `rank[i]` =
   position of suffix i in that order. Built by prefix doubling: sort by (rank[i], rank[i+k])
   pairs, doubling k each round -> O(n log^2 n) with a comparison sort.
2. LCP array (Kasai): lcp[r] = LCP of the suffixes at sorted positions r-1 and r. O(n).
3. Key fact: LCP of two suffixes at sorted positions a < b is the MIN of lcp[a+1..b].
   (Suffixes between them in sorted order share at least that much, and no more.)
   That is a static range-min query -> sparse table -> O(1).

Dry run on "banana":
  suffixes sorted: a(5), ana(3), anana(1), banana(0), na(4), nana(2) -> sa = [5,3,1,0,4,2]
  rank = [3,2,5,1,4,0]   (rank[i] = where suffix i sits)
  lcp (between neighbours in sorted order) = [_, 1, 3, 0, 0, 2]
  lcp(1, 3): rank[1]=2, rank[3]=1 -> min(lcp[2..2]) = 3
  lcp(2, 4): rank[2]=5, rank[4]=4 -> min(lcp[5..5]) = 2
  lcp(0, 2): rank[0]=1, rank[2]=5 -> min(lcp[2..5]) = min(3,0,0,2) = 0
```

### Edge cases

```
- i === j -> n - i
- one suffix is a prefix of the other ("ana" vs "anana" -> 3)
- single-character string
```

Full JavaScript solution with tests: [03_longest_common_prefix_of_ranges.js](../solutions/03_longest_common_prefix_of_ranges.js). Run it with `node 03_longest_common_prefix_of_ranges.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the `i === j` case: the answer is the full suffix length `n - i`, not a range query.
- Querying the LCP array on `[rank[i], rank[j]]` instead of `[min(rank) + 1, max(rank)]`.
- Comparing characters for every query (O(n) each) when there are many queries.

## Related follow-ups

- [Suffix arrays in Advanced String Algorithms](../../../../33_String_Algorithms_Advanced/README.md)
- [Longest Duplicate Substring](../../../../33_String_Algorithms_Advanced/03_Problems/03_Hard/07_longest_duplicate_substring.md)
- Number of Distinct Substrings in a String (LeetCode #1698)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
