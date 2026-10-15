# Remove Nth Node From End of List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | two pointers with gap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #19 — https://leetcode.com/problems/remove-nth-node-from-end-of-list/ |
| **Solution file** | [06_remove_nth_from_end.js](../solutions/06_remove_nth_from_end.js) — open only after a real attempt |

## Problem

Given the head of a linked list, remove the n-th node counted from the END
and return the head.

## Examples

```
Input: 1 -> 2 -> 3 -> 4 -> 5, n = 2   Output: 1 -> 2 -> 3 -> 5
Input: 1, n = 1                       Output: (empty)
Input: 1 -> 2, n = 1                  Output: 1
Input: 1 -> 2, n = 2                  Output: 2   Explanation: the head itself is removed
```

## Constraints & clarifying questions

```
- Is n always valid (1 <= n <= length)? (yes)
- One pass required? (the follow-up asks for it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two pointers with gap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (two passes)   O(n) time, O(1) space. Pass 1: count length L.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers with a gap of n, one pass)   O(n) time, O(1) space. Start both pointers at a dummy node in front of head.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- removing the head (n === length)
- removing the tail (n === 1)
- single node -> empty list
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (two passes)   O(n) time, O(1) space

```
Pass 1: count length L. The node to delete is at index L - n from the front.
Pass 2: walk to index L - n - 1 and skip the next node. Removing the head
(L - n === 0) needs a special case, which a dummy node removes.
```

### APPROACH 2 — Optimal (two pointers with a gap of n, one pass)   O(n) time, O(1) space

```
Start both pointers at a dummy node in front of head. Move fast n+1 steps
ahead. Now move both together until fast is null. slow is then exactly
one node BEFORE the one to delete, so slow.next = slow.next.next.

Dry run on 1 -> 2 -> 3 -> 4 -> 5, n = 2:
  dummy -> 1 -> 2 -> 3 -> 4 -> 5
  fast moves 3 steps: fast = 3, slow = dummy
  move both: fast=4 slow=1 ; fast=5 slow=2 ; fast=null slow=3
  slow.next (4) is the target. 3.next = 5  ->  1 -> 2 -> 3 -> 5

Why dummy? If n = length, the head itself is removed and slow stays on dummy,
so "slow.next = slow.next.next" still works with no if-statement.
```

### Edge cases

```
- removing the head (n === length)
- removing the tail (n === 1)
- single node -> empty list
```

Full JavaScript solution with tests: [06_remove_nth_from_end.js](../solutions/06_remove_nth_from_end.js). Run it with `node 06_remove_nth_from_end.js` from the solutions folder.

</details>

## Common mistakes

- Not handling removal of the head; a dummy node fixes it.
- Gap of n instead of n + 1 when you need to stop at the node before the target.
- Assuming n is always smaller than the length without asking.

## Related follow-ups

- [Middle of the Linked List](../01_Easy/05_middle_of_linked_list.md)
- [Rotate List](15_rotate_list.md)
- Delete the Middle Node of a Linked List (LeetCode #2095)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
