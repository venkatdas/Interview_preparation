# Reorder List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | middle + reverse + merge |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #143 — https://leetcode.com/problems/reorder-list/ |
| **Solution file** | [14_reorder_list.js](../solutions/14_reorder_list.js) — open only after a real attempt |

## Problem

Given L0 -> L1 -> ... -> Ln, reorder it IN PLACE to
  L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...
Only node pointers may change, not values. Nothing is returned.

## Examples

```
Input: 1 -> 2 -> 3 -> 4        Output: 1 -> 4 -> 2 -> 3
Input: 1 -> 2 -> 3 -> 4 -> 5   Output: 1 -> 5 -> 2 -> 4 -> 3
```

## Constraints & clarifying questions

```
- In place with O(1) extra space? (expected)
- Return value? (none; mutate the list)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *middle + reverse + merge* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (array of nodes + two pointers)   O(n) time, O(n) space. Store all nodes in an array.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (three classic steps combined)   O(n) time, O(1) space. This problem is a combo of three earlier ones: 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty, one node, two nodes -> unchanged
- odd vs even length (the first half is the longer one by our middle choice)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (array of nodes + two pointers)   O(n) time, O(n) space

```
Store all nodes in an array. Use left/right indices: link nodes[left] ->
nodes[right] -> nodes[left+1] -> ... until they meet. Then null-terminate.
```

### APPROACH 2 — Optimal (three classic steps combined)   O(n) time, O(1) space

```
This problem is a combo of three earlier ones:
  1. Find the middle (fast/slow)                    -> problem 05
  2. Reverse the second half                        -> problem 01
  3. Merge the two halves alternately               -> like problem 02

Dry run on 1 -> 2 -> 3 -> 4 -> 5:
  1. middle = 3.  first half: 1 -> 2 -> 3,   second half: 4 -> 5
  2. reversed second: 5 -> 4
  3. merge alternately:
       1 -> 5 -> 2 -> 4 -> 3        (3 is left over from the longer first half)

Make sure to CUT the first half (middle.next = null) before merging,
otherwise the halves stay connected and you create a cycle.
```

### Edge cases

```
- empty, one node, two nodes -> unchanged
- odd vs even length (the first half is the longer one by our middle choice)
```

Full JavaScript solution with tests: [14_reorder_list.js](../solutions/14_reorder_list.js). Run it with `node 14_reorder_list.js` from the solutions folder.

</details>

## Common mistakes

- Not cutting the first half (`slow.next = null`), creating a cycle.
- Splitting at the wrong middle so the halves are off by one.
- Using an array of nodes is fine but O(n) space; mention the in-place version.

## Related follow-ups

- [Middle of the Linked List](../01_Easy/05_middle_of_linked_list.md)
- [Reverse Linked List](../01_Easy/01_reverse_linked_list.md)
- [Merge Two Sorted Lists](../01_Easy/02_merge_two_sorted_lists.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
