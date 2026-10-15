# Recover Binary Search Tree

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | inorder dips (Morris optional) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #99 — https://leetcode.com/problems/recover-binary-search-tree/ |
| **Solution file** | [12_recover_bst.js](../solutions/12_recover_bst.js) — open only after a real attempt |

## Problem

Exactly two nodes of a BST had their VALUES swapped by mistake. Fix the tree in place
without changing its structure.

## Examples

```
Input: [1,3,null,null,2]   Output: [3,1,null,null,2]   Explanation: 1 and 3 were swapped
Input: [3,1,4,null,null,2]   Output: [2,1,4,null,null,3]   Explanation: 2 and 3 were swapped
```

## Constraints & clarifying questions

```
- Exactly two nodes swapped? (yes)
- Follow-up: O(1) space? (Morris traversal; the recursion stack version is O(h))

Key insight: inorder of a correct BST is sorted. With two values swapped, the inorder
sequence has one or two "dips" (a place where prev > current):
  sorted:   1 2 3 4 5     swap 2 and 4:  1 4 3 2 5  -> dips at (4,3) and (3,2)
                           swap 2 and 3:  1 3 2 4 5  -> ONE dip at (3,2)
The first wrong node is the `prev` of the FIRST dip; the second wrong node is the
`current` of the LAST dip (which is the same dip when the swapped nodes are adjacent).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *inorder dips (Morris optional)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (inorder to array, sort, write back)   O(n log n) time, O(n) space. Collect inorder nodes, collect their values, sort the values, write them back in inorder.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (one inorder pass tracking prev, first, second)   O(n) time, O(h) space. Inorder traversal keeping `prev`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- the swapped nodes are adjacent in inorder (only one dip)
- the root is one of the swapped nodes
- two-node tree
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (inorder to array, sort, write back)   O(n log n) time, O(n) space

```
Collect inorder nodes, collect their values, sort the values, write them back in
inorder. Fixes ANY number of mistakes, but uses O(n) memory and sorting.
```

### APPROACH 2 — Optimal (one inorder pass tracking prev, first, second)   O(n) time, O(h) space

```
Inorder traversal keeping `prev`. Whenever prev.val > node.val:
  if first is not set -> first = prev     (left side of the first dip)
  second = node                           (right side of the latest dip)
At the end swap first.val and second.val.

Dry run on [3,1,4,null,null,2]  (inorder: 1 3 2 4):
  prev=1, node=3: ok
  prev=3, node=2: dip -> first = 3, second = 2
  prev=2, node=4: ok
  swap 3 and 2 -> inorder 1 2 3 4
```

### Edge cases

```
- the swapped nodes are adjacent in inorder (only one dip)
- the root is one of the swapped nodes
- two-node tree
```

Full JavaScript solution with tests: [12_recover_bst.js](../solutions/12_recover_bst.js). Run it with `node 12_recover_bst.js` from the solutions folder.

</details>

## Common mistakes

- Only handling the case where the swapped nodes are adjacent in inorder (or only the distant case).
- Swapping nodes instead of values (unnecessary pointer surgery).
- Using O(n) extra space when O(h) is enough.

## Related follow-ups

- [Validate Binary Search Tree](07_validate_bst.md)
- [Kth Smallest Element in a BST](08_kth_smallest_in_bst.md)
- Minimum Absolute Difference in BST (LeetCode #530)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
