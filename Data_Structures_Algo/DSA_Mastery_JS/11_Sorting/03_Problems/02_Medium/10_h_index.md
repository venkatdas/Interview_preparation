# H-Index

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | counting sort |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #274 — https://leetcode.com/problems/h-index/ |
| **Solution file** | [10_h_index.js](../solutions/10_h_index.js) — open only after a real attempt |

## Problem

Given citations[i] = number of citations of a researcher's i-th paper, return the
h-index: the largest h such that the researcher has at least h papers with >= h
citations each.

## Examples

```
Input: [3,0,6,1,5]   Output: 3   (3 papers with >= 3 citations: 3, 6, 5; not 4 papers with >= 4)
Input: [1,3,1]       Output: 1
```

## Constraints & clarifying questions

```
- n <= 5000, citations up to 1000 (but h can never exceed n!)
- Zero citations everywhere -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting sort* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort descending, scan)   O(n log n) time. Sort descending.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (counting sort capped at n)   O(n) time, O(n) space. h is at most n, so citations above n are "as good as n".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [0] -> 0; [100] -> 1 (one paper with >= 1 citation)
- all equal [5,5,5] -> 3
- [] -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort descending, scan)   O(n log n) time

```
Sort descending. Walk i = 0..n-1: while citations[i] >= i + 1, h = i + 1.
The first time the (i+1)-th paper has fewer than i+1 citations, stop.
```

### APPROACH 2 — Optimal (counting sort capped at n)   O(n) time, O(n) space

```
h is at most n, so citations above n are "as good as n". Count papers per citation
count in buckets 0..n (cap at n). Then walk h from n down to 0, accumulating how many
papers have >= h citations; the first h where that running total >= h is the answer.

Dry run [3,0,6,1,5], n=5:
  buckets (capped): 0:1, 1:1, 3:1, 5:2   (6 counts as 5)
  h=5: papers >= 5 = 2 < 5
  h=4: 2 < 4
  h=3: 2 + 1 = 3 >= 3 -> answer 3
```

### Edge cases

```
- [0] -> 0; [100] -> 1 (one paper with >= 1 citation)
- all equal [5,5,5] -> 3
- [] -> 0
```

Full JavaScript solution with tests: [10_h_index.js](../solutions/10_h_index.js). Run it with `node 10_h_index.js` from the solutions folder.

</details>

## Common mistakes

- Off-by-one after sorting descending: h is the largest i with `citations[i - 1] >= i`.
- Making the count array size max(citations); cap it at n because h can never exceed n.
- Confusing this with H-Index II, where the input is already sorted and binary search applies.

## Related follow-ups

- H-Index II (LeetCode #275) — sorted input, binary search
- [Maximum Gap](09_maximum_gap.md) — bucket/counting ideas
- [Koko Eating Bananas](../../../10_Searching/03_Problems/02_Medium/12_koko_eating_bananas.md) — binary search on the answer, another way to find h

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
