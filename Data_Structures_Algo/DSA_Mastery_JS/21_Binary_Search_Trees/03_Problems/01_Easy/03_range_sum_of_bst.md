# Range Sum of BST

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Easy |
| **Pattern** | prune by ordering |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #938 — https://leetcode.com/problems/range-sum-of-bst/ |
| **Solution file** | [03_range_sum_of_bst.js](../solutions/03_range_sum_of_bst.js) — open only after a real attempt |

## Problem

Return the sum of all node values v with low <= v <= high.

## Examples

```
Input: root=[10,5,15,3,7,null,18], low=7, high=15   Output: 32   (7 + 10 + 15)
Input: root=[10,5,15,3,7,13,18,1,null,6], low=6, high=10   Output: 23   (6 + 7 + 10)
```

## Constraints & clarifying questions

```
- Inclusive bounds? (yes)
- Values unique? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prune by ordering* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (visit every node)   O(n) time, O(h) space. Traverse the whole tree, add values inside the range.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prune with the BST property)   O(h + k) time, O(h) space. If node.val &lt; low, nothing in its LEFT subtree can be in range -> skip left.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> 0
- range outside all values -> 0
- low == high -> single value or 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (visit every node)   O(n) time, O(h) space

```
Traverse the whole tree, add values inside the range.
```

### APPROACH 2 — Optimal (prune with the BST property)   O(h + k) time, O(h) space

```
If node.val < low, nothing in its LEFT subtree can be in range -> skip left.
If node.val > high, skip the right subtree. Only the branches that could contain
in-range values are explored. k = number of nodes in range.

Dry run on [10,5,15,3,7,null,18], low=7, high=15:
  10 in range (+10); explore both
    5 < 7: skip left (3), go right -> 7 in range (+7)
    15 in range (+15); 15 is not > high so we also look right -> 18 > 15, skip its right, left null
  = 32
```

### Edge cases

```
- empty tree -> 0
- range outside all values -> 0
- low == high -> single value or 0
```

Full JavaScript solution with tests: [03_range_sum_of_bst.js](../solutions/03_range_sum_of_bst.js). Run it with `node 03_range_sum_of_bst.js` from the solutions folder.

</details>

## Common mistakes

- Visiting every node without pruning by the range.
- Pruning the wrong side (if `node.val < low`, only the right subtree can help).
- Using exclusive bounds when the range is inclusive.

## Related follow-ups

- [Trim a Binary Search Tree](../02_Medium/10_trim_a_bst.md)
- [Search in a Binary Search Tree](01_search_in_bst.md)
- [Kth Smallest Element in a BST](../02_Medium/08_kth_smallest_in_bst.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
