# Middle of the Linked List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | fast/slow |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #876 — https://leetcode.com/problems/middle-of-the-linked-list/ |
| **Solution file** | [05_middle_of_linked_list.js](../solutions/05_middle_of_linked_list.js) — open only after a real attempt |

## Problem

Given the head of a singly linked list, return the middle node.
If there are two middle nodes (even length), return the SECOND one.

## Examples

```
Input: 1 -> 2 -> 3 -> 4 -> 5        Output: node 3
Input: 1 -> 2 -> 3 -> 4 -> 5 -> 6   Output: node 4   Explanation: middles are 3 and 4, return 4
Input: 1                            Output: node 1
```

## Constraints & clarifying questions

```
- Even length: first or second middle? (second for this problem; many
  problems such as Palindrome / Sort List want the FIRST - see the variant below)
- Is the list non-empty? (LeetCode guarantees >= 1 node; we also handle null)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fast/slow* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (two passes)   O(n) time, O(1) space. Pass 1: count the nodes (n).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (fast & slow pointers, one pass)   O(n) time, O(1) space. slow moves 1 step, fast moves 2 steps.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single node -> itself
- two nodes -> the second one
- empty list -> null
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (two passes)   O(n) time, O(1) space

```
Pass 1: count the nodes (n). Pass 2: walk floor(n/2) steps from head.
```

### APPROACH 2 — Optimal (fast & slow pointers, one pass)   O(n) time, O(1) space

```
slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow has
travelled exactly half the distance = the middle.

Dry run on 1 -> 2 -> 3 -> 4 -> 5:
  slow=1 fast=1
  slow=2 fast=3
  slow=3 fast=5   fast.next is null -> stop, return slow (3)

Dry run on 1 -> 2 -> 3 -> 4:
  slow=1 fast=1
  slow=2 fast=3
  slow=3 fast=null -> stop, return 3 (the second middle)

To get the FIRST middle instead, loop while (fast.next && fast.next.next).
```

### Edge cases

```
- single node -> itself
- two nodes -> the second one
- empty list -> null
```

Full JavaScript solution with tests: [05_middle_of_linked_list.js](../solutions/05_middle_of_linked_list.js). Run it with `node 05_middle_of_linked_list.js` from the solutions folder.

</details>

## Common mistakes

- Returning the first middle when the problem asks for the second (or vice versa).
- Loop condition `fast.next.next` without guarding `fast.next`.
- Counting the length first is fine, but say that it takes two passes.

## Related follow-ups

- [Palindrome Linked List](07_palindrome_linked_list.md)
- [Sort List](../02_Medium/19_sort_list.md)
- [Reorder List](../02_Medium/14_reorder_list.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
