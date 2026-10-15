# Longest Consecutive Sequence

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Medium |
| **Pattern** | seen-set, start-of-run |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #128 — https://leetcode.com/problems/longest-consecutive-sequence/ |
| **Solution file** | [10_longest_consecutive_sequence.js](../solutions/10_longest_consecutive_sequence.js) — open only after a real attempt |

## Problem

Given an unsorted integer array, return the length of the longest run of consecutive
integers (values, not positions). Must run in O(n) time.

## Examples

```
Input: [100, 4, 200, 1, 3, 2]          Output: 4   Explanation: 1, 2, 3, 4
Input: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]  Output: 9   Explanation: 0..8
Input: []                              Output: 0
```

## Constraints & clarifying questions

```
- Duplicates? (yes, they don't extend a run: [1,1,2] -> 2)
- Negative numbers? (yes)
- Must it be O(n)? (the whole point; sorting would be O(n log n))
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *seen-set, start-of-run* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort)   O(n log n) time, O(1) or O(n) space. Sort, then walk once counting runs where next === current + 1 (skip equal duplicates).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (seen-set, only start from run beginnings)   O(n) time, O(n) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty -> 0
- Single element -> 1
- Duplicates: [1, 2, 2, 3] -> 3
- Negative run: [-3, -2, -1] -> 3
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort)   O(n log n) time, O(1) or O(n) space

```
Sort, then walk once counting runs where next === current + 1 (skip equal duplicates).
Correct and easy, but not O(n).
```

### APPROACH 2 — Optimal (seen-set, only start from run beginnings)   O(n) time, O(n) space

```
1. Put everything in a Set (O(1) membership, duplicates vanish).
  2. For each value v: if v - 1 is in the set, v is NOT the start of a run -> skip.
     Otherwise v starts a run: count upward while v+1, v+2, ... are in the set.
Why O(n)? Each value is walked over only from its run's start, and a run's start is
unique, so every value is visited at most twice (once in the outer loop, once inside
a run walk).

Dry run on [100, 4, 200, 1, 3, 2]:
  set = {100, 4, 200, 1, 3, 2}
  100: 99 not in set -> start. 101? no. length 1
  4:   3 in set -> skip
  200: 199 no -> start. 201? no. length 1
  1:   0 no -> start. 2 yes, 3 yes, 4 yes, 5 no. length 4
  3:   2 in set -> skip
  2:   1 in set -> skip
  best = 4
```

### Edge cases

```
- Empty -> 0
- Single element -> 1
- Duplicates: [1, 2, 2, 3] -> 3
- Negative run: [-3, -2, -1] -> 3
```

Full JavaScript solution with tests: [10_longest_consecutive_sequence.js](../solutions/10_longest_consecutive_sequence.js). Run it with `node 10_longest_consecutive_sequence.js` from the solutions folder.

</details>

## Common mistakes

- Starting a count from every number, which makes it O(n^2); only start where `x - 1` is not in the set.
- Sorting first and then claiming O(n).
- Forgetting duplicates; a Set removes them naturally, a sorted scan must skip them.

## Related follow-ups

- [Longest Consecutive Sequence (Union-Find)](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/09_longest_consecutive_sequence.md) — the same problem with DSU
- [First Missing Positive](../../../03_Arrays/03_Problems/03_Hard/16_first_missing_positive.md) — another "which numbers are present" problem
- Binary Tree Longest Consecutive Sequence (LeetCode #298) — consecutive runs on a tree

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
