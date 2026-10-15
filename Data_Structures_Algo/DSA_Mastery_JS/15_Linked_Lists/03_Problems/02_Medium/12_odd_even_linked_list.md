# Odd Even Linked List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | two chains |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #328 — https://leetcode.com/problems/odd-even-linked-list/ |
| **Solution file** | [12_odd_even_linked_list.js](../solutions/12_odd_even_linked_list.js) — open only after a real attempt |

## Problem

Group all nodes at odd POSITIONS (1st, 3rd, 5th...) followed by all nodes at
even positions (2nd, 4th...). Keep the relative order inside each group.
Must run in O(1) extra space and O(n) time.

## Examples

```
Input: 1 -> 2 -> 3 -> 4 -> 5          Output: 1 -> 3 -> 5 -> 2 -> 4
Input: 2 -> 1 -> 3 -> 5 -> 6 -> 4 -> 7   Output: 2 -> 3 -> 6 -> 7 -> 1 -> 5 -> 4
```

## Constraints & clarifying questions

```
- "Odd/even" refers to position (1-indexed), not value? (yes)
- O(1) space required? (yes, so no extra arrays)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two chains* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Walk the list and push values into two arrays (odd positions, even positions), then build a new list from odd + even.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two chains, then connect)   O(n) time, O(1) space. Keep two "tails": odd and even.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty, one node, two nodes -> unchanged
- odd length: last node is odd, even chain ends with null automatically
- even length: last node is even; odd.next must be set to evenHead, which
  also cuts the leftover pointer from the last odd node into the even chain
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Walk the list and push values into two arrays (odd positions, even
positions), then build a new list from odd + even.
```

### APPROACH 2 — Optimal (two chains, then connect)   O(n) time, O(1) space

```
Keep two "tails": odd and even. Repeatedly:
  odd.next  = even.next     (skip over the even node)
  odd       = odd.next
  even.next = odd.next      (skip over the odd node)
  even      = even.next
Remember evenHead (the 2nd node) so we can attach it after the odd chain.
Stop when even or even.next is null (no more pairs to pull apart).

Dry run on 1 -> 2 -> 3 -> 4 -> 5:
  odd=1 even=2 evenHead=2
  odd.next=3, odd=3 ; even.next=4, even=4       odd chain 1-3, even chain 2-4
  odd.next=5, odd=5 ; even.next=null, even=null  odd chain 1-3-5, even chain 2-4
  even is null -> stop. odd.next (5.next) = evenHead  ->  1 3 5 2 4
```

### Edge cases

```
- empty, one node, two nodes -> unchanged
- odd length: last node is odd, even chain ends with null automatically
- even length: last node is even; odd.next must be set to evenHead, which
  also cuts the leftover pointer from the last odd node into the even chain
```

Full JavaScript solution with tests: [12_odd_even_linked_list.js](../solutions/12_odd_even_linked_list.js). Run it with `node 12_odd_even_linked_list.js` from the solutions folder.

</details>

## Common mistakes

- Grouping by odd/even values instead of odd/even positions.
- Forgetting to connect the end of the odd list to the head of the even list.
- Losing the even head because it was not saved before relinking.

## Related follow-ups

- Partition List (LeetCode #86)
- [Reorder List](14_reorder_list.md)
- [Swap Nodes in Pairs](13_swap_nodes_in_pairs.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
