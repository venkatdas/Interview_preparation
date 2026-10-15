# Reverse Nodes in k-Group

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Hard |
| **Pattern** | group reversal + reconnect |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #25 — https://leetcode.com/problems/reverse-nodes-in-k-group/ |
| **Solution file** | [17_reverse_nodes_in_k_group.js](../solutions/17_reverse_nodes_in_k_group.js) — open only after a real attempt |

## Problem

Reverse the nodes of the list k at a time. If the last group has fewer than
k nodes, leave it as is. Only pointers may change, not values.

## Examples

```
Input: 1 -> 2 -> 3 -> 4 -> 5, k = 2   Output: 2 -> 1 -> 4 -> 3 -> 5
Input: 1 -> 2 -> 3 -> 4 -> 5, k = 3   Output: 3 -> 2 -> 1 -> 4 -> 5
Input: 1 -> 2, k = 1                  Output: 1 -> 2
```

## Constraints & clarifying questions

```
- What happens with the leftover group? (keep its order)
- k = 1? (no change) k >= length? (reverse all only if exactly length, else no change)
- O(1) extra space? (expected)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *group reversal + reconnect* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (array of values)   O(n) time, O(n) space. Copy values into an array, reverse each full chunk of k with a loop, write the values back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (check k ahead, reverse the group, reconnect)   O(n) time, O(1) space. Use a dummy and a pointer `groupPrev` at the node just before the current group.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> unchanged
- length < k -> unchanged
- length is an exact multiple of k -> every group reversed
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (array of values)   O(n) time, O(n) space

```
Copy values into an array, reverse each full chunk of k with a loop, write
the values back. Easy, but it swaps values not nodes.
```

### APPROACH 2 — Optimal (check k ahead, reverse the group, reconnect)   O(n) time, O(1) space

```
Use a dummy and a pointer `groupPrev` at the node just before the current group.
Repeat:
  1. Walk k steps from groupPrev to find `kth`. If we hit null, stop (leftover group).
  2. groupNext = kth.next (where the next group starts).
  3. Reverse the nodes from groupPrev.next up to kth using the 3-pointer
     reversal, with prev starting at groupNext so the last node links forward.
  4. Reconnect: the old first node of the group is now its last; groupPrev.next = kth;
     groupPrev = old first.

Dry run on 1 -> 2 -> 3 -> 4 -> 5, k = 2:
  dummy -> 1 -> 2 -> 3 -> 4 -> 5     groupPrev=dummy
  kth = 2, groupNext = 3
  reverse 1,2 with prev=3:   2 -> 1 -> 3    dummy.next = 2 ; groupPrev = 1
  kth = 4, groupNext = 5
  reverse 3,4 with prev=5:   4 -> 3 -> 5    1.next = 4 ; groupPrev = 3
  kth: walk 2 from 3 -> 5 -> null  -> stop
  result 2 -> 1 -> 4 -> 3 -> 5
```

### Edge cases

```
- k = 1 -> unchanged
- length < k -> unchanged
- length is an exact multiple of k -> every group reversed
```

Full JavaScript solution with tests: [17_reverse_nodes_in_k_group.js](../solutions/17_reverse_nodes_in_k_group.js). Run it with `node 17_reverse_nodes_in_k_group.js` from the solutions folder.

</details>

## Common mistakes

- Reversing the final group even when it has fewer than k nodes.
- Losing the connection between the previous group's tail and the new group head.
- Counting k nodes ahead incorrectly, reading `.next` of null.

## Related follow-ups

- [Reverse Linked List](../01_Easy/01_reverse_linked_list.md)
- [Swap Nodes in Pairs](../02_Medium/13_swap_nodes_in_pairs.md)
- Reverse Linked List II (LeetCode #92)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
