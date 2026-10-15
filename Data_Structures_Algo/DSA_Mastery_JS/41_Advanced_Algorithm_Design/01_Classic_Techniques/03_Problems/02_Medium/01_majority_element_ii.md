# Majority Element II

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Medium |
| **Pattern** | Boyer-Moore, k = n/3 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #229 — https://leetcode.com/problems/majority-element-ii/ |
| **Solution file** | [01_majority_element_ii.js](../solutions/01_majority_element_ii.js) — open only after a real attempt |

## Problem

Find all elements that appear MORE than floor(n / 3) times. Solve in O(n) time and O(1)
extra space.

## Examples

```
Input: [3,2,3]        Output: [3]
Input: [1]            Output: [1]
Input: [1,2]          Output: [1,2]
Input: [1,1,1,3,3,2,2,2]   Output: [1,2]
```

## Constraints & clarifying questions

```
- Strictly more than n/3 -> at most TWO such elements can exist (three would need > n total)
- Output order does not matter
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Boyer-Moore, k = n/3* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Count with a Map and filter.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Boyer-Moore with two candidates)   O(n) time, O(1) space. Keep two candidate slots with counters.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 or 2 -> every element qualifies
- no element exceeds n/3 -> []
- all equal -> one answer
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Count with a Map and filter. Correct, but uses O(n) space which the follow-up forbids.
```

### APPROACH 2 — Optimal (Boyer-Moore with two candidates)   O(n) time, O(1) space

```
Keep two candidate slots with counters. For each x:
  - matches a candidate -> increment it
  - a slot is free (count 0) -> take it
  - otherwise decrement BOTH counters (we "cancel" x with one copy of each candidate:
    three distinct values removed together cannot change who has > n/3)
Survivors are only CANDIDATES: verify each with a second counting pass.

Dry run on [1,1,1,3,3,2,2,2]:
  1: slotA = 1 (1)      1: A=2     1: A=3
  3: slotB = 3 (1)      3: B=2
  2: no match, no free slot -> A=2, B=1
  2: -> A=1, B=0        2: slot B free -> B = 2 (1)
  candidates 1 and 2; verify: 1 appears 3 > 8/3, 2 appears 3 > 8/3, (3 appears 2, not a candidate) -> [1,2]
```

### Edge cases

```
- n = 1 or 2 -> every element qualifies
- no element exceeds n/3 -> []
- all equal -> one answer
```

Full JavaScript solution with tests: [01_majority_element_ii.js](../solutions/01_majority_element_ii.js). Run it with `node 01_majority_element_ii.js` from the solutions folder.

</details>

## Common mistakes

- Skipping the verification pass: candidates surviving the vote are only possible answers, not guaranteed ones.
- Decrementing both counters when the current value matches one of the candidates.
- Assigning a new candidate to a slot whose count is 0 even though the value already equals the other candidate.

## Related follow-ups

- Majority Element (LeetCode #169)
- [Find the Duplicate Number](02_find_the_duplicate_number.md)
- Check If a Number Is Majority Element in a Sorted Array (LeetCode #1150)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
