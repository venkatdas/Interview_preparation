# Reverse Linked List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | 3-pointer reversal (iter + recursive) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #206 — https://leetcode.com/problems/reverse-linked-list/ |
| **Solution file** | [01_reverse_linked_list.js](../solutions/01_reverse_linked_list.js) — open only after a real attempt |

## Problem

Given the head of a singly linked list, reverse the list and return the new head.

## Examples

```
Input: 1 -> 2 -> 3 -> 4 -> 5   Output: 5 -> 4 -> 3 -> 2 -> 1
Input: 1 -> 2                  Output: 2 -> 1
Input: (empty)                 Output: (empty)
```

## Constraints & clarifying questions

```
- Can I modify the nodes in place, or must I return a new list? (in place is expected)
- Can the list be empty? (yes -> return null)
- Should I do it iteratively or recursively? (know both; iterative uses O(1) space)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *3-pointer reversal (iter + recursive)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Walk the list, copy every value into an array, reverse the array, then walk the list again writing the values back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (3 pointers, iterative)   O(n) time, O(1) space. Keep three pointers: prev, current, next.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty list -> null
- one node -> same node
- two nodes -> swap
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Walk the list, copy every value into an array, reverse the array, then walk the
list again writing the values back. Works, but uses extra memory and does not
actually practice pointer manipulation, which is what the interviewer wants to see.
```

### APPROACH 2 — Optimal (3 pointers, iterative)   O(n) time, O(1) space

```
Keep three pointers: prev, current, next.
At every node: save next, point current backwards to prev, then slide both
prev and current one step to the right.

Dry run on 1 -> 2 -> 3:
  start:  prev=null  current=1        1 -> 2 -> 3 -> null
  step 1: next=2, 1.next=null         null <- 1    2 -> 3 -> null
          prev=1, current=2
  step 2: next=3, 2.next=1            null <- 1 <- 2    3 -> null
          prev=2, current=3
  step 3: next=null, 3.next=2         null <- 1 <- 2 <- 3
          prev=3, current=null -> stop
  return prev (3)
```

### APPROACH 3 — Recursive   O(n) time, O(n) space (call stack)

```
Reverse everything after head, then make head's next node point back at head
and cut head's own next. Base case: empty or single node is already reversed.

  reverse(1 -> 2 -> 3)
    newHead = reverse(2 -> 3)   // returns 3 -> 2, and node 2 still has 1 pointing at it
    1.next.next = 1             // 2.next = 1  ->  3 -> 2 -> 1 -> 2 ... (temporary cycle)
    1.next = null               // cut it     ->  3 -> 2 -> 1 -> null
    return 3
```

### Edge cases

```
- empty list -> null
- one node -> same node
- two nodes -> swap
```

Full JavaScript solution with tests: [01_reverse_linked_list.js](../solutions/01_reverse_linked_list.js). Run it with `node 01_reverse_linked_list.js` from the solutions folder.

</details>

## Common mistakes

- Overwriting `curr.next` before saving it, which loses the rest of the list.
- Returning `head` (now the tail) instead of `prev`.
- Using recursion on a 100k-node list and overflowing the JS stack.

## Related follow-ups

- [Reverse Nodes in k-Group](../03_Hard/17_reverse_nodes_in_k_group.md)
- [Palindrome Linked List](07_palindrome_linked_list.md)
- Reverse Linked List II (LeetCode #92)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
