# Merge Two Sorted Lists (recursive)

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Easy |
| **Pattern** | recursion on linked lists |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Linked Lists](../../../15_Linked_Lists/README.md) |
| **Source** | LeetCode #21 — https://leetcode.com/problems/merge-two-sorted-lists/ (statement paraphrased in our own words) |
| **Solution file** | [04_merge_two_sorted_lists.js](../solutions/04_merge_two_sorted_lists.js) — open only after a real attempt |

## Problem

Given the heads of two sorted linked lists, splice them together into one sorted
list (reuse the nodes) and return its head.

## Examples

```
1->2->4  and  1->3->4   =>   1->1->2->3->4->4
(empty)  and  (empty)   =>   (empty)
(empty)  and  0         =>   0
```

## Constraints & clarifying questions

```
- Lengths up to 50 each on LeetCode; values may repeat and be negative
- Stable for ties? (take from list1 first on ties)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Each call should decide ONE node and trust recursion for the rest.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Pour both lists into an array, sort, rebuild. O((m+n) log(m+n)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** The smaller of the two heads must be first. Point its `next` at the merge of everything that is left, then return it.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** If either list is empty, the answer is the other list. Use `<=` so equal values keep list1 first.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect + sort + rebuild)   O((m+n) log(m+n)) time, O(m+n) space

```
Dump both lists into an array, sort, build a new list. Ignores that inputs are sorted.
```

### APPROACH 2 — Optimal (recursion)   O(m+n) time, O(m+n) stack space

```
PROMISE: merge(a, b) returns the head of the merged sorted list of a and b.
  base: if a is empty the answer is b (and vice versa)
  step: the smaller head must come first. Say a.val <= b.val:
        a.next = merge(a.next, b); return a.
Each call places exactly one node, so there are m + n calls.

Dry run a = 1->4, b = 2->3:
  merge(1.., 2..): 1 <= 2 -> 1.next = merge(4, 2->3)
    merge(4, 2..): 2 < 4  -> 2.next = merge(4, 3)
      merge(4, 3): 3 < 4  -> 3.next = merge(4, null) = 4
  result 1->2->3->4
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| sort everything | O((m+n) log(m+n)) | O(m+n) |
| recursion | O(m+n) | O(m+n) stack |
| iterative with dummy | O(m+n) | O(1) |

### Edge cases

```
- one or both lists empty
- all of one list smaller than the other (one long chain of the same branch)
- equal values: use <= to keep the merge stable
```

### Common mistakes

- Forgetting to return the chosen head after setting its `next`.
- Creating new nodes when the task says to splice existing ones.
- Not handling both-empty input.

Full JavaScript solution with tests: [04_merge_two_sorted_lists.js](../solutions/04_merge_two_sorted_lists.js). Run it with `node 04_merge_two_sorted_lists.js` from the solutions folder.

</details>

## Related follow-ups

- Merge k Sorted Lists (LeetCode #23)
- Sort List (LeetCode #148)
- Merge Sorted Array (LeetCode #88)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
