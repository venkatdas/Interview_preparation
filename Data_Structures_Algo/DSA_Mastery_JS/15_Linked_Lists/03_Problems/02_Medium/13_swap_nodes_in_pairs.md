# Swap Nodes in Pairs

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | dummy + rewire |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #24 — https://leetcode.com/problems/swap-nodes-in-pairs/ |
| **Solution file** | [13_swap_nodes_in_pairs.js](../solutions/13_swap_nodes_in_pairs.js) — open only after a real attempt |

## Problem

Given a linked list, swap every two adjacent NODES and return the head.
You must swap the nodes themselves, not just their values.

## Examples

```
Input: 1 -> 2 -> 3 -> 4   Output: 2 -> 1 -> 4 -> 3
Input: 1 -> 2 -> 3        Output: 2 -> 1 -> 3   Explanation: the odd one out stays
Input: 1                  Output: 1
```

## Constraints & clarifying questions

```
- Can I just swap values? (interviewers usually say NO - practice the pointers)
- Odd length: leave the last node alone? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *dummy + rewire* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (swap values)   O(n) time, O(1) space. Walk in steps of two and swap node.val with node.next.val.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (dummy + rewire 3 pointers per pair)   O(n) time, O(1) space. Use prev (starts at dummy), first = prev.next, second = first.next.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty, one node
- odd length (last node untouched)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (swap values)   O(n) time, O(1) space

```
Walk in steps of two and swap node.val with node.next.val. Simple, but not
allowed when the question says "swap nodes".
```

### APPROACH 2 — Optimal (dummy + rewire 3 pointers per pair)   O(n) time, O(1) space

```
Use prev (starts at dummy), first = prev.next, second = first.next.
  prev.next   = second    (prev now points at the second node)
  first.next  = second.next  (first jumps over second to the rest)
  second.next = first     (second points back at first)
  prev = first            (first is now the last node of the swapped pair)

Dry run on 1 -> 2 -> 3 -> 4:
  dummy -> 1 -> 2 -> 3 -> 4       prev=dummy first=1 second=2
  dummy -> 2 -> 1 -> 3 -> 4       prev=1
  first=3 second=4
  dummy -> 2 -> 1 -> 4 -> 3       prev=3, prev.next=null -> stop
  return dummy.next = 2
```

### APPROACH 3 — Recursive   O(n) time, O(n) stack

```
swap(head): second = head.next; head.next = swap(second.next); second.next = head; return second.
```

### Edge cases

```
- empty, one node
- odd length (last node untouched)
```

Full JavaScript solution with tests: [13_swap_nodes_in_pairs.js](../solutions/13_swap_nodes_in_pairs.js). Run it with `node 13_swap_nodes_in_pairs.js` from the solutions folder.

</details>

## Common mistakes

- Swapping values instead of nodes when the problem forbids it.
- Forgetting to link the previous pair to the new first node of the current pair.
- Mishandling an odd last node (it stays in place).

## Related follow-ups

- [Reverse Nodes in k-Group](../03_Hard/17_reverse_nodes_in_k_group.md)
- [Reverse Linked List](../01_Easy/01_reverse_linked_list.md)
- [Odd Even Linked List](12_odd_even_linked_list.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
