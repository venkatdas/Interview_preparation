# Remove Duplicates from Sorted List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | compare with next |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #83 — https://leetcode.com/problems/remove-duplicates-from-sorted-list/ |
| **Solution file** | [09_remove_duplicates_sorted_list.js](../solutions/09_remove_duplicates_sorted_list.js) — open only after a real attempt |

## Problem

Given the head of a SORTED linked list, delete all duplicates so each value
appears only once. Return the list, still sorted.

## Examples

```
Input: 1 -> 1 -> 2              Output: 1 -> 2
Input: 1 -> 1 -> 2 -> 3 -> 3    Output: 1 -> 2 -> 3
Input: (empty)                  Output: (empty)
```

## Constraints & clarifying questions

```
- Is the list guaranteed sorted? (yes; that's why duplicates are always adjacent)
- Keep one copy, or remove ALL nodes that have duplicates? (keep one here;
  LeetCode 82 "Remove Duplicates II" removes all - see the bonus function)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *compare with next* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Walk the list, collect values into a Set (which drops duplicates), build a new list from the Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (compare with next)   O(n) time, O(1) space. Because the list is sorted, duplicates are neighbours.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty list, single node
- all nodes identical -> single node
- duplicates at the tail
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Walk the list, collect values into a Set (which drops duplicates), build a
new list from the Set. Works for unsorted lists too but allocates.
```

### APPROACH 2 — Optimal (compare with next)   O(n) time, O(1) space

```
Because the list is sorted, duplicates are neighbours. Stand on a node and
look at the next one: if it has the same value, skip it (current.next =
current.next.next) and look again. Otherwise step forward.

Dry run on 1 -> 1 -> 2 -> 3 -> 3:
  current=1, next=1 same -> skip    1 -> 2 -> 3 -> 3
  current=1, next=2 diff -> move    current=2
  current=2, next=3 diff -> move    current=3
  current=3, next=3 same -> skip    1 -> 2 -> 3
  current=3, next=null -> stop
```

### Edge cases

```
- empty list, single node
- all nodes identical -> single node
- duplicates at the tail
```

Full JavaScript solution with tests: [09_remove_duplicates_sorted_list.js](../solutions/09_remove_duplicates_sorted_list.js). Run it with `node 09_remove_duplicates_sorted_list.js` from the solutions folder.

</details>

## Common mistakes

- Moving `curr` forward after removing a duplicate, which misses runs of three or more.
- Using a Set when the list is sorted (adjacent comparison is enough).
- Confusing this with "remove all nodes that have duplicates" (LeetCode #82).

## Related follow-ups

- Remove Duplicates from Sorted List II (LeetCode #82)
- [Remove Duplicates from Sorted Array](../../../03_Arrays/03_Problems/01_Easy/06_remove_duplicates_from_sorted_array.md) (03_Arrays)
- [Remove Linked List Elements](08_remove_linked_list_elements.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
