# Convert Sorted Array to Binary Search Tree

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Easy |
| **Pattern** | middle = root |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #108 — https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/ |
| **Solution file** | [04_sorted_array_to_bst.js](../solutions/04_sorted_array_to_bst.js) — open only after a real attempt |

## Problem

Given an ascending sorted array, build a HEIGHT-BALANCED BST (depths of the two
subtrees of every node differ by at most 1).

## Examples

```
Input: [-10,-3,0,5,9]   Output: [0,-3,9,-10,null,5]   (other balanced answers accepted)
Input: [1,3]            Output: [3,1] or [1,null,3]
```

## Constraints & clarifying questions

```
- Strictly increasing, unique values? (yes)
- Any balanced answer OK? (yes; tests check inorder + balance, not exact shape)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *middle = root* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (insert one by one into a BST)   O(n^2) time, O(n) space. Insert values in sorted order with a normal BST insert: each insert walks the whole right spine, and the result is a LINKED LIST, not balanced.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (pick the middle as root, recurse on halves)   O(n) time, O(log n) space. The middle element becomes the root, so both halves have (almost) the same size, which is exactly what balanced means.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array -> null
- one element
- two elements (either one can be the root)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (insert one by one into a BST)   O(n^2) time, O(n) space

```
Insert values in sorted order with a normal BST insert: each insert walks the whole
right spine, and the result is a LINKED LIST, not balanced. You would then need to
rebalance it. This shows why "just insert" is wrong here.
```

### APPROACH 2 — Optimal (pick the middle as root, recurse on halves)   O(n) time, O(log n) space

```
The middle element becomes the root, so both halves have (almost) the same size, which
is exactly what balanced means. Recurse on [left, mid-1] and [mid+1, right] using
indices (no slicing). Every element is visited once.

Dry run on [-10,-3,0,5,9]:
  build(0,4): mid 2 -> root 0
    build(0,1): mid 0 -> -10; build(0,-1) null; build(1,1) -> -3 as right child
    build(3,4): mid 3 -> 5; right build(4,4) -> 9
  Result: [0,-10,5,null,-3,null,9]  (balanced; LeetCode's sample picks the other middle)
```

### Edge cases

```
- empty array -> null
- one element
- two elements (either one can be the root)
```

Full JavaScript solution with tests: [04_sorted_array_to_bst.js](../solutions/04_sorted_array_to_bst.js). Run it with `node 04_sorted_array_to_bst.js` from the solutions folder.

</details>

## Common mistakes

- Inserting elements one by one in sorted order (creates a chain).
- Slicing arrays at each call (extra O(n log n) copying); pass indices.
- Off-by-one in the `lo > hi` base case.

## Related follow-ups

- Convert Sorted List to Binary Search Tree (LeetCode #109)
- [Balanced Binary Tree](../../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/06_balanced_binary_tree.md) (20_Trees/01_Binary_Trees)
- Balance a Binary Search Tree (LeetCode #1382)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
