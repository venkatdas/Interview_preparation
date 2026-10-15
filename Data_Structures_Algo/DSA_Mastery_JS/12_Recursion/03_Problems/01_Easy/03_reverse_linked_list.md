# Reverse Linked List (recursive)

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Easy |
| **Pattern** | recursion on linked lists |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Linked Lists](../../../15_Linked_Lists/README.md) |
| **Source** | LeetCode #206 — https://leetcode.com/problems/reverse-linked-list/ (statement paraphrased in our own words) |
| **Solution file** | [03_reverse_linked_list.js](../solutions/03_reverse_linked_list.js) — open only after a real attempt |

## Problem

Given the head of a singly linked list, reverse the list and return the new head.
Here we focus on the recursive version: trust the call to reverse "the rest".

## Examples

```
1 -> 2 -> 3 -> 4 -> 5   =>   5 -> 4 -> 3 -> 2 -> 1
1 -> 2                  =>   2 -> 1
(empty)                 =>   (empty)
```

## Constraints & clarifying questions

```
- Up to 5000 nodes (recursion depth 5000 is fine in Node; 10^6 would not be)
- Reverse in place, or may we allocate new nodes? (in place)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Linked lists are recursive by nature: a list is a node followed by a smaller list. Trust a call that reverses `head.next`.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Copy the values into an array and write them back in reverse order.

</details>

<details><summary>Hint 3</summary>

**The key idea.** After `newHead = reverse(head.next)`, the node `head.next` is the TAIL of the reversed rest. Attach `head` after it and cut `head.next`.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Empty list and single node are both base cases. Forgetting `head.next = null` makes a cycle.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (copy values out, write them back)   O(n) time, O(n) space

```
Walk the list collecting values into an array, then walk again writing them back
in reverse order. Works, but uses an extra array and does not move pointers.
```

### APPROACH 2 — Optimal (recursion)   O(n) time, O(n) stack space

```
PROMISE: reverse(head) reverses the list starting at head and returns its new head.
  base: empty list or single node is already reversed -> return head
  step: newHead = reverse(head.next). Now head.next is the TAIL of the reversed rest.
        Hook head after it: head.next.next = head; and cut head.next = null.
  return newHead (it never changes on the way back up).
(The iterative three-pointer version is O(1) space — mention it as the follow-up.)

Dry run on 1 -> 2 -> 3:
  reverse(1) calls reverse(2) calls reverse(3) -> base, returns 3
  back in reverse(2): 2.next is 3; set 3.next = 2, 2.next = null   => 3 -> 2
  back in reverse(1): 1.next is 2; set 2.next = 1, 1.next = null   => 3 -> 2 -> 1
  return 3
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| copy values | O(n) | O(n) array |
| recursion | O(n) | O(n) stack |
| iterative 3 pointers | O(n) | O(1) |

### Edge cases

```
- empty list -> null;  one node -> same node
- forgetting head.next = null creates a 2-cycle between the first two nodes
```

### Common mistakes

- Returning `head` instead of `newHead` at the end.
- Not setting `head.next = null` (2-cycle at the end).
- Using recursion on a 10^6-node list in production (stack overflow) - mention the iterative version.

Full JavaScript solution with tests: [03_reverse_linked_list.js](../solutions/03_reverse_linked_list.js). Run it with `node 03_reverse_linked_list.js` from the solutions folder.

</details>

## Related follow-ups

- Reverse Linked List II (LeetCode #92)
- Reverse Nodes in k-Group (LeetCode #25)
- Palindrome Linked List (LeetCode #234)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
