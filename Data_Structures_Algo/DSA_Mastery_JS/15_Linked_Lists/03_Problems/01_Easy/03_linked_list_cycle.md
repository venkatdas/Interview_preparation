# Linked List Cycle

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | Floyd fast/slow |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #141 — https://leetcode.com/problems/linked-list-cycle/ |
| **Solution file** | [03_linked_list_cycle.js](../solutions/03_linked_list_cycle.js) — open only after a real attempt |

## Problem

Given the head of a linked list, return true if some node's next pointer
points back to an earlier node (the list loops forever), otherwise false.

## Examples

```
Input: 3 -> 2 -> 0 -> -4 -> (back to 2)   Output: true
Input: 1 -> 2 -> (back to 1)              Output: true
Input: 1                                  Output: false
```

## Constraints & clarifying questions

```
- Can I modify the nodes (e.g. mark them visited)? (usually no)
- Is O(1) extra space required? (that's the follow-up; yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Floyd fast/slow* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (visited set)   O(n) time, O(n) space. Walk the list and store every node object in a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Floyd's tortoise and hare)   O(n) time, O(1) space. Two pointers: slow moves 1 step, fast moves 2 steps.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty list -> false
- single node with no cycle -> false
- single node pointing to itself -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (visited set)   O(n) time, O(n) space

```
Walk the list and store every node object in a Set. If we ever meet a node
that is already in the Set, there is a cycle. If we reach null, there is none.
```

### APPROACH 2 — Optimal (Floyd's tortoise and hare)   O(n) time, O(1) space

```
Two pointers: slow moves 1 step, fast moves 2 steps.
- No cycle: fast reaches null -> return false.
- Cycle: both pointers eventually enter the loop. Inside the loop fast gains
  exactly 1 step on slow every move, so the gap shrinks by 1 each time and
  MUST hit 0 within one lap. They meet -> return true.
  (Why can't fast "jump over" slow? Because the gap shrinks by exactly 1,
  it passes through every value down to 0.)

Dry run on 1 -> 2 -> 3 -> 4 -> (back to 2):
  slow=1 fast=1
  slow=2 fast=3
  slow=3 fast=2   (fast went 3 -> 4 -> 2)
  slow=4 fast=4   meet -> true
```

### Edge cases

```
- empty list -> false
- single node with no cycle -> false
- single node pointing to itself -> true
```

Full JavaScript solution with tests: [03_linked_list_cycle.js](../solutions/03_linked_list_cycle.js). Run it with `node 03_linked_list_cycle.js` from the solutions folder.

</details>

## Common mistakes

- Checking `fast.next.next` without first checking `fast.next`, which throws on even-length lists.
- Comparing values instead of node identity.
- Starting fast one step ahead and then comparing before moving, causing an off-by-one false positive.

## Related follow-ups

- [Linked List Cycle II](../02_Medium/04_linked_list_cycle_ii.md)
- [Happy Number](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/01_Easy/05_happy_number.md) (00_Foundations/04_Mathematics_For_DSA)
- [Find the Duplicate Number](../../../14_Bit_Manipulation/03_Problems/02_Medium/16_find_the_duplicate_number.md) (14_Bit_Manipulation)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
