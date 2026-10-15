# Rotate List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | ring and cut |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #61 — https://leetcode.com/problems/rotate-list/ |
| **Solution file** | [15_rotate_list.js](../solutions/15_rotate_list.js) — open only after a real attempt |

## Problem

Given the head of a linked list, rotate it to the RIGHT by k places.
(The last node moves to the front, k times.)

## Examples

```
Input: 1 -> 2 -> 3 -> 4 -> 5, k = 2   Output: 4 -> 5 -> 1 -> 2 -> 3
Input: 0 -> 1 -> 2, k = 4             Output: 2 -> 0 -> 1   Explanation: k=4 is the same as k=1 for length 3
Input: (empty), k = 3                 Output: (empty)
```

## Constraints & clarifying questions

```
- Can k be larger than the length? (yes -> use k % length)
- Can k be 0? (yes -> unchanged)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *ring and cut* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (rotate one step, k times)   O(n*k) time, O(1) space. Each step: walk to the second-last node, detach the tail, put it in front.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (make a ring, then cut it)   O(n) time, O(1) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty or single node -> unchanged
- k % n === 0 -> unchanged (don't cut at the old tail into an empty list!)
- k much larger than n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (rotate one step, k times)   O(n*k) time, O(1) space

```
Each step: walk to the second-last node, detach the tail, put it in front.
Fine for tiny k, terrible when k is large.
```

### APPROACH 2 — Optimal (make a ring, then cut it)   O(n) time, O(1) space

```
1. Walk to the tail, counting length n.
2. Connect tail.next = head  (now it's a circle).
3. k = k % n. The new tail is at position n - k - 1 (0-indexed) from the old head.
   Walk there, set newHead = newTail.next, cut newTail.next = null.

Dry run on 1 -> 2 -> 3 -> 4 -> 5, k = 2:
  n = 5, tail = 5, make circle: 5 -> 1
  k = 2 % 5 = 2 ; steps to new tail = 5 - 2 - 1 = 2  -> node 3
  newHead = 3.next = 4 ; cut 3.next = null
  result 4 -> 5 -> 1 -> 2 -> 3
```

### Edge cases

```
- empty or single node -> unchanged
- k % n === 0 -> unchanged (don't cut at the old tail into an empty list!)
- k much larger than n
```

Full JavaScript solution with tests: [15_rotate_list.js](../solutions/15_rotate_list.js). Run it with `node 15_rotate_list.js` from the solutions folder.

</details>

## Common mistakes

- Not reducing k modulo the length (k can be huge).
- Not handling an empty list or k % length === 0.
- Off-by-one when finding the new tail: it is at index `length - k - 1`.

## Related follow-ups

- [Rotate Array](../../../03_Arrays/03_Problems/02_Medium/07_rotate_array.md) (03_Arrays)
- [Remove Nth Node From End of List](06_remove_nth_from_end.md)
- Split Linked List in Parts (LeetCode #725)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
