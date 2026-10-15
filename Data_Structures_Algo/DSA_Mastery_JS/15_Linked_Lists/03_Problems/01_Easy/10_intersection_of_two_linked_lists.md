# Intersection of Two Linked Lists

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | two pointers switching lists |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #160 — https://leetcode.com/problems/intersection-of-two-linked-lists/ |
| **Solution file** | [10_intersection_of_two_linked_lists.js](../solutions/10_intersection_of_two_linked_lists.js) — open only after a real attempt |

## Problem

Two singly linked lists may merge at some node and share the rest of their
nodes (a "Y" shape). Return the node where they intersect, or null.
Intersection is by NODE identity, not by value.

## Examples

```
A: 4 -> 1 \
              8 -> 4 -> 5        Output: node 8
  B: 5 -> 6 -> 1 /

  A: 2 -> 6 -> 4
  B: 1 -> 5                      Output: null
```

## Constraints & clarifying questions

```
- No cycles? (correct)
- Must the lists keep their original structure? (yes, no modification)
- O(1) memory required? (follow-up: yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two pointers switching lists* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (visited set)   O(n+m) time, O(n) space. Put every node of A into a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers that switch lists)   O(n+m) time, O(1) space. Walk pointerA through A and then through B; walk pointerB through B and then through A.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one list empty -> null
- no intersection -> both pointers reach null together (loop must end!)
- intersection at the very first node (lists are identical)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (visited set)   O(n+m) time, O(n) space

```
Put every node of A into a Set. Walk B; the first node already in the Set
is the intersection.
```

### APPROACH 2 — Optimal (two pointers that switch lists)   O(n+m) time, O(1) space

```
Walk pointerA through A and then through B; walk pointerB through B and then
through A. Both travel exactly lengthA + lengthB steps, so they reach the
intersection at the same moment (or both hit null at the same moment if
there is none).

Intuition: the "extra" length before the shared part differs between the two
lists. By making each pointer walk BOTH prefixes, the difference cancels out.

Dry run (A = 4,1,8,4,5  B = 5,6,1,8,4,5, shared from 8):
  pA: 4 1 8 4 5 null 5 6 1 8
  pB: 5 6 1 8 4 5 null 4 1 8
  both land on 8 at step 10 -> return 8

Alternative O(1) approach: compute both lengths, advance the longer list by
the difference, then walk together. Same complexity, slightly more code.
```

### Edge cases

```
- one list empty -> null
- no intersection -> both pointers reach null together (loop must end!)
- intersection at the very first node (lists are identical)
```

Full JavaScript solution with tests: [10_intersection_of_two_linked_lists.js](../solutions/10_intersection_of_two_linked_lists.js). Run it with `node 10_intersection_of_two_linked_lists.js` from the solutions folder.

</details>

## Common mistakes

- Comparing node values instead of node references.
- Infinite loop when there is no intersection: the switch-heads trick must let both pointers reach null together.
- Modifying the lists (e.g. making a cycle) without restoring them.

## Related follow-ups

- [Linked List Cycle II](../02_Medium/04_linked_list_cycle_ii.md)
- [Two Sum](../../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) (05_Hashing)
- Lowest Common Ancestor of a Binary Tree III (LeetCode #1650)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
