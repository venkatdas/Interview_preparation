# Remove Linked List Elements

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | dummy + prev |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #203 — https://leetcode.com/problems/remove-linked-list-elements/ |
| **Solution file** | [08_remove_linked_list_elements.js](../solutions/08_remove_linked_list_elements.js) — open only after a real attempt |

## Problem

Given the head of a linked list and an integer val, remove every node whose
value equals val and return the new head.

## Examples

```
Input: 1 -> 2 -> 6 -> 3 -> 4 -> 5 -> 6, val = 6   Output: 1 -> 2 -> 3 -> 4 -> 5
Input: (empty), val = 1                           Output: (empty)
Input: 7 -> 7 -> 7 -> 7, val = 7                  Output: (empty)
```

## Constraints & clarifying questions

```
- Can the head itself be removed? (yes - that's why we use a dummy node)
- Can every node be removed? (yes -> return null)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *dummy + prev* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Copy the values that are NOT val into an array, then build a brand new list.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (dummy head + "prev" pointer)   O(n) time, O(1) space. Removing a node means changing the next pointer of the node BEFORE it.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty list
- all nodes removed
- val appears at head, at tail, consecutively
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Copy the values that are NOT val into an array, then build a brand new list.
Easy, but allocates n new nodes.
```

### APPROACH 2 — Optimal (dummy head + "prev" pointer)   O(n) time, O(1) space

```
Removing a node means changing the next pointer of the node BEFORE it. So we
walk with a pointer `prev` and look at prev.next:
  - if prev.next.val === val  ->  prev.next = prev.next.next  (skip it, do NOT advance prev,
                                  because the new prev.next might also need removing)
  - else                      ->  prev = prev.next
A dummy node in front of head means removing the head is not a special case.

Dry run on 1 -> 6 -> 6 -> 2, val = 6:
  dummy -> 1 -> 6 -> 6 -> 2       prev = dummy
  prev.next = 1 (keep)            prev = 1
  prev.next = 6 (remove)          dummy -> 1 -> 6 -> 2     prev stays on 1
  prev.next = 6 (remove)          dummy -> 1 -> 2          prev stays on 1
  prev.next = 2 (keep)            prev = 2
  prev.next = null -> stop. return dummy.next = 1 -> 2
```

### Edge cases

```
- empty list
- all nodes removed
- val appears at head, at tail, consecutively
```

Full JavaScript solution with tests: [08_remove_linked_list_elements.js](../solutions/08_remove_linked_list_elements.js). Run it with `node 08_remove_linked_list_elements.js` from the solutions folder.

</details>

## Common mistakes

- Not handling consecutive matching nodes (advancing after a deletion skips one).
- Missing matches at the head without a dummy node.
- Returning the old head when it was removed.

## Related follow-ups

- [Remove Duplicates from Sorted List](09_remove_duplicates_sorted_list.md)
- [Remove Nth Node From End of List](../02_Medium/06_remove_nth_from_end.md)
- Delete Node in a Linked List (LeetCode #237)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
