# Swap Nodes in Pairs

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | recursion on linked lists (step of 2) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Linked Lists](../../../15_Linked_Lists/README.md) |
| **Source** | LeetCode #24 — https://leetcode.com/problems/swap-nodes-in-pairs/ (statement paraphrased in our own words) |
| **Solution file** | [06_swap_nodes_in_pairs.js](../solutions/06_swap_nodes_in_pairs.js) — open only after a real attempt |

## Problem

Given a linked list, swap every two adjacent nodes and return the new head.
Swap the NODES themselves (relink pointers), do not just swap their values.

## Examples

```
1->2->3->4   =>   2->1->4->3
1->2->3      =>   2->1->3       (odd one out stays)
(empty)      =>   (empty)
```

## Constraints & clarifying questions

```
- 0..100 nodes
- Must nodes move, or can values be swapped? (nodes must move)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Same as reversing, but each call handles TWO nodes and recurses on the list after them.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Put the nodes in an array, swap neighbours, relink.

</details>

<details><summary>Hint 3</summary>

**The key idea.** With `first = head` and `second = head.next`: `first.next = swapPairs(second.next)`, `second.next = first`, return `second`.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Fewer than two nodes: return head unchanged. Odd length: the last node stays.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (array of nodes, relink)   O(n) time, O(n) space

```
Put every node into an array, swap entries i and i+1 for even i, then relink the
array in order. Simple but uses O(n) extra memory.
```

### APPROACH 2 — Optimal (recursion on pairs)   O(n) time, O(n/2) stack

```
PROMISE: swapPairs(head) swaps pairs in the list starting at head, returns new head.
  base: fewer than two nodes -> nothing to swap -> return head
  step: first = head, second = head.next.
        first.next = swapPairs(second.next)   // trust the rest
        second.next = first
        return second
(Iterative with a dummy node gets O(1) space.)

Dry run 1->2->3->4:
  swap(1): first=1, second=2, 1.next = swap(3)
    swap(3): first=3, second=4, 3.next = swap(null) = null, 4.next = 3, return 4
  1.next = 4 (4->3), 2.next = 1, return 2   => 2->1->4->3
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| array of nodes | O(n) | O(n) |
| recursion | O(n) | O(n/2) stack |
| iterative with dummy | O(n) | O(1) |

### Edge cases

```
- empty list / single node
- odd length: last node stays where it is
```

### Common mistakes

- Swapping values instead of nodes (often forbidden).
- Overwriting `second.next` before saving it for the recursive call.
- Returning `first` instead of `second` as the new head.

Full JavaScript solution with tests: [06_swap_nodes_in_pairs.js](../solutions/06_swap_nodes_in_pairs.js). Run it with `node 06_swap_nodes_in_pairs.js` from the solutions folder.

</details>

## Related follow-ups

- Reverse Nodes in k-Group (LeetCode #25)
- Swapping Nodes in a Linked List (LeetCode #1721)
- Odd Even Linked List (LeetCode #328)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
