# Ugly Number II

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | generate in order with heap + set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #264 — https://leetcode.com/problems/ugly-number-ii/ |
| **Solution file** | [15_ugly_number_ii.js](../solutions/15_ugly_number_ii.js) — open only after a real attempt |

## Problem

An ugly number is a positive integer whose only prime factors are 2, 3 and 5.
Return the n-th ugly number. (1 counts as the first.)

## Examples

```
Input: n = 10   Output: 12   Explanation: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12
Input: n = 1    Output: 1
```

## Constraints & clarifying questions

```
- n up to 1690 (the answer fits in 32 bits)
- Is 1 ugly? (yes, by convention)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *generate in order with heap + set* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(answer * log answer) time, O(1) space. Count up from 1, test each integer by dividing out 2, 3, 5 and checking if 1 remains.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (min-heap + set to generate in order)   O(n log n) time, O(n) space. Every ugly number except 1 is (a smaller ugly number) * 2, 3 or 5.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1
- duplicates from different factor paths must not be counted twice
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(answer * log answer) time, O(1) space

```
Count up from 1, test each integer by dividing out 2, 3, 5 and checking if
1 remains. Ugly numbers get sparse fast, so this checks huge numbers of
candidates for larger n.
```

### APPROACH 2 — Optimal (min-heap + set to generate in order)   O(n log n) time, O(n) space

```
Every ugly number except 1 is (a smaller ugly number) * 2, 3 or 5. So we can
GENERATE them in increasing order: start the heap with 1; pop the smallest
(that's the next ugly number), push smallest*2, *3, *5. A Set prevents
duplicates (6 = 2*3 = 3*2). The n-th pop is the answer.

Dry run for n = 5:
  heap {1}        pop 1  -> push 2,3,5
  heap {2,3,5}    pop 2  -> push 4,6,10
  heap {3,4,5,6,10}      pop 3 -> push 6(dup, skip),9,15
  heap {4,5,6,9,10,15}   pop 4 -> push 8,12,20
  heap {5,6,8,...}       pop 5 -> 5th ugly number is 5

(The classic DP with three pointers is O(n) time; see 29_Dynamic_Programming.
The heap version generalizes to "super ugly number" with any set of primes.)
```

### Edge cases

```
- n = 1 -> 1
- duplicates from different factor paths must not be counted twice
```

Full JavaScript solution with tests: [15_ugly_number_ii.js](../solutions/15_ugly_number_ii.js). Run it with `node 15_ugly_number_ii.js` from the solutions folder.

</details>

## Common mistakes

- Pushing duplicates (e.g. 6 from 2·3 and 3·2) without dedupe.
- Overflow is not an issue in JS for n ≤ 1690, but in other languages use 64-bit.
- In the three-pointer DP, advancing only one pointer when two produce the same value.

## Related follow-ups

- Ugly Number (LeetCode #263)
- Super Ugly Number (LeetCode #313)
- [Merge k Sorted Lists](../03_Hard/07_merge_k_sorted_lists.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
