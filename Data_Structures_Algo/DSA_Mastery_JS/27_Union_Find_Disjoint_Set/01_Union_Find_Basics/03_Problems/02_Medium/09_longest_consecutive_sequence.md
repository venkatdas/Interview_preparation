# Longest Consecutive Sequence

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | union x with x+1 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #128 — https://leetcode.com/problems/longest-consecutive-sequence/ |
| **Solution file** | [09_longest_consecutive_sequence.js](../solutions/09_longest_consecutive_sequence.js) — open only after a real attempt |

## Problem

Given an unsorted integer array, return the length of the longest run of consecutive
integers (values, not positions). Must run in O(n).

## Examples

```
Input: [100,4,200,1,3,2]          Output: 4   (1,2,3,4)
Input: [0,3,7,2,5,8,4,6,0,1]      Output: 9
Input: []                         Output: 0
```

## Constraints & clarifying questions

```
- Duplicates? (yes, they do not extend a run - dedupe first)
- Negative numbers? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *union x with x+1* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort)   O(n log n) time, O(1) extra. Sort, dedupe, walk and count runs.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find: union x with x+1)   O(n * alpha) time, O(n) space. Think of each distinct value as a node.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> 0
- all duplicates [1,1,1] -> 1
- single element -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort)   O(n log n) time, O(1) extra

```
Sort, dedupe, walk and count runs. Simple but not O(n).
```

### APPROACH 2 — Optimal (Union-Find: union x with x+1)   O(n * alpha) time, O(n) space

```
Think of each distinct value as a node. There is an edge between x and x + 1 whenever
both exist. A run of consecutive numbers is exactly a connected component, and its
length is the component size.
  1. index each distinct value 0..k-1 (Map).
  2. for each value x: if x + 1 exists, union(idx[x], idx[x+1]).
  3. answer = max set size.
(The classic hash-set "only start from x where x-1 is missing" solution is also O(n)
 and is in 05_Hashing; this version shows union-find's "size of component" power.)

Dry run [100,4,200,1,3,2]:
  ids 100:0 4:1 200:2 1:3 3:4 2:5
  4 -> 5 missing; 1 -> 2 exists union(3,5); 3 -> 4 exists union(4,1); 2 -> 3 union(5,4)
  set {1,2,3,4} has size 4 -> answer 4
```

### Edge cases

```
- empty -> 0
- all duplicates [1,1,1] -> 1
- single element -> 1
```

Full JavaScript solution with tests: [09_longest_consecutive_sequence.js](../solutions/09_longest_consecutive_sequence.js). Run it with `node 09_longest_consecutive_sequence.js` from the solutions folder.

</details>

## Common mistakes

- Sorting the array (O(n log n)) when O(n) is required.
- Not de-duplicating; repeated values must not inflate a set size.
- Returning 1 for an empty array; the answer is 0.

## Related follow-ups

- [Longest Consecutive Sequence (hash-set version)](../../../../05_Hashing/03_Problems/02_Medium/10_longest_consecutive_sequence.md)
- [Number of Connected Components](01_number_of_connected_components.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
