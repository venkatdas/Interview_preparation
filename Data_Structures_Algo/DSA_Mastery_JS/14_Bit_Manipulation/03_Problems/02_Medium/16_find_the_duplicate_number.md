# Find the Duplicate Number

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | bit counting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #287 — https://leetcode.com/problems/find-the-duplicate-number/ |
| **Solution file** | [16_find_the_duplicate_number.js](../solutions/16_find_the_duplicate_number.js) — open only after a real attempt |

## Problem

nums has n + 1 integers, each in [1, n]. Exactly one number is repeated (possibly many
times). Find it WITHOUT modifying the array and using O(1) extra space.

## Examples

```
Input: [1,3,4,2,2]   Output: 2
Input: [3,1,3,4,2]   Output: 3
Input: [3,3,3,3,3]   Output: 3
```

## Constraints & clarifying questions

```
- Can I sort or use a Set? (no: read-only, O(1) space)
- Exactly one value repeats? (yes, but it may repeat more than twice)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bit counting* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each element, scan the rest for an equal one.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count 1 bits per column vs the "ideal" 1..n)   O(32 n) time, O(1) space. Imagine the array were exactly [1, 2, ..., n] (no duplicate).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- duplicate appears more than twice -> still works (more extra 1s)
- n = 1: [1,1] -> 1
- duplicate is n (the largest value)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each element, scan the rest for an equal one.
```

### APPROACH 2 — Optimal (count 1 bits per column vs the "ideal" 1..n)   O(32 n) time, O(1) space

```
Imagine the array were exactly [1, 2, ..., n] (no duplicate). For each bit position, count
how many of 1..n have that bit set: call it `baseCount`. Now count in the real array:
`actualCount`. The real array = {1..n} with ONE value replaced (several times) by the
duplicate. If actualCount > baseCount at bit i, the duplicate has bit i set: every extra
copy of it adds 1s to the columns where it has 1s, and the values it replaced contribute
fewer 1s in total only if the duplicate's bit is set there. Build the duplicate bit by bit.
(Floyd's cycle detection is the other famous O(n) solution - see 15_Linked_Lists/.)

Dry run on [1,3,4,2,2] (n = 4; ideal {1,2,3,4} = 001,010,011,100):
  bit0: base = 2 (1,3), actual = 2 (1,3)      -> not > -> 0
  bit1: base = 2 (2,3), actual = 3 (3,2,2)    -> >  -> set
  bit2: base = 1 (4),   actual = 1 (4)        -> 0
  duplicate = 010 = 2
```

### Edge cases

```
- duplicate appears more than twice -> still works (more extra 1s)
- n = 1: [1,1] -> 1
- duplicate is n (the largest value)
```

Full JavaScript solution with tests: [16_find_the_duplicate_number.js](../solutions/16_find_the_duplicate_number.js). Run it with `node 16_find_the_duplicate_number.js` from the solutions folder.

</details>

## Common mistakes

- Modifying the array (sorting or negating) when the problem forbids it.
- Using a Set (O(n) space) when O(1) is required.
- In the bit-count method, comparing counts for bits with the wrong range 1..n.

## Related follow-ups

- [Linked List Cycle II](../../../15_Linked_Lists/03_Problems/02_Medium/04_linked_list_cycle_ii.md) (15_Linked_Lists)
- [Missing Number](../01_Easy/04_missing_number.md)
- [Single Number](../01_Easy/01_single_number.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
