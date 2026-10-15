# Linked List Cycle II

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | Floyd phase 2 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #142 — https://leetcode.com/problems/linked-list-cycle-ii/ |
| **Solution file** | [04_linked_list_cycle_ii.js](../solutions/04_linked_list_cycle_ii.js) — open only after a real attempt |

## Problem

Given the head of a linked list, return the NODE where the cycle begins.
If there is no cycle, return null. Do not modify the list.

## Examples

```
Input: 3 -> 2 -> 0 -> -4 -> (back to 2)   Output: node with value 2
Input: 1 -> 2 -> (back to 1)              Output: node with value 1
Input: 1                                  Output: null
```

## Constraints & clarifying questions

```
- Return the node or its index/value? (the node; we test by value)
- O(1) space required? (follow-up: yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Floyd phase 2* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (visited set)   O(n) time, O(n) space. Walk and record every node in a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Floyd, phase 2)   O(n) time, O(1) space. Phase 1: slow/fast as in problem 03 until they meet inside the cycle.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no cycle -> null
- cycle starts at head (whole list is a loop)
- single self-looping node
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (visited set)   O(n) time, O(n) space

```
Walk and record every node in a Set. The first node we see twice is the
start of the cycle (it's the first node reachable from two directions).
```

### APPROACH 2 — Optimal (Floyd, phase 2)   O(n) time, O(1) space

```
Phase 1: slow/fast as in problem 03 until they meet inside the cycle.
Phase 2: put one pointer back at head, leave the other at the meeting point,
         move both ONE step at a time. Where they meet is the cycle start.

Why does phase 2 work?
  Let  a = distance head -> cycle start
       b = distance cycle start -> meeting point
       c = cycle length
  When they meet, slow walked a + b and fast walked 2(a + b).
  fast is also exactly some whole number of laps ahead:  2(a+b) = (a+b) + k*c
  so  a + b = k*c,  i.e.  a = k*c - b.
  "a steps from head" lands at the cycle start. "a steps from the meeting
  point" = k*c - b steps = go back b (to the start) then k full laps = also the
  cycle start. So two pointers moving 1 step each meet exactly there.

Dry run on 1 -> 2 -> 3 -> 4 -> (back to 2):   a=1, c=3
  phase 1: slow 1,2,3,4   fast 1,3,2,4   -> meet at 4
  phase 2: p1=1(head) p2=4   step: p1=2, p2=2  -> meet at 2 = cycle start
```

### Edge cases

```
- no cycle -> null
- cycle starts at head (whole list is a loop)
- single self-looping node
```

Full JavaScript solution with tests: [04_linked_list_cycle_ii.js](../solutions/04_linked_list_cycle_ii.js). Run it with `node 04_linked_list_cycle_ii.js` from the solutions folder.

</details>

## Common mistakes

- Resetting the wrong pointer (both must then move one step at a time).
- Returning the meeting point instead of the entry point.
- Not handling "no cycle" before the second phase.

## Related follow-ups

- [Linked List Cycle](../01_Easy/03_linked_list_cycle.md)
- [Find the Duplicate Number](../../../14_Bit_Manipulation/03_Problems/02_Medium/16_find_the_duplicate_number.md) (14_Bit_Manipulation)
- [Intersection of Two Linked Lists](../01_Easy/10_intersection_of_two_linked_lists.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
