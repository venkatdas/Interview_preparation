# Search in a Binary Search Tree

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Easy |
| **Pattern** | prune by ordering |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #700 — https://leetcode.com/problems/search-in-a-binary-search-tree/ |
| **Solution file** | [01_search_in_bst.js](../solutions/01_search_in_bst.js) — open only after a real attempt |

## Problem

Given the root of a BST and a value, return the node whose value equals val
(the subtree rooted at that node). Return null if it does not exist.

## Examples

```
Input: root=[4,2,7,1,3], val=2   Output: [2,1,3]
Input: root=[4,2,7,1,3], val=5   Output: []
```

## Constraints & clarifying questions

```
- Values unique? (yes)
- Return the node or just true/false? (the node)
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

**Start simple.** APPROACH 1 — Brute force (search like a plain binary tree)   O(n) time, O(h) space. Ignore the BST property and look at every node.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (use the BST property)   O(h) time, O(1) space iterative. At each node: equal -> found; val smaller -> go left; bigger -> go right.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> null
- val at root
- val smaller than everything -> walk the left spine to null
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (search like a plain binary tree)   O(n) time, O(h) space

```
Ignore the BST property and look at every node. Works but throws away the only
reason the tree is sorted.
```

### APPROACH 2 — Optimal (use the BST property)   O(h) time, O(1) space iterative

```
At each node: equal -> found; val smaller -> go left; bigger -> go right.
Exactly binary search, but on a tree. O(log n) balanced, O(n) skewed.

Dry run on [4,2,7,1,3], val=3:
  at 4: 3 < 4 -> left
  at 2: 3 > 2 -> right
  at 3: found -> return node 3
```

### Edge cases

```
- empty tree -> null
- val at root
- val smaller than everything -> walk the left spine to null
```

Full JavaScript solution with tests: [01_search_in_bst.js](../solutions/01_search_in_bst.js). Run it with `node 01_search_in_bst.js` from the solutions folder.

</details>

## Common mistakes

- Searching both subtrees like a general tree (O(n) instead of O(h)).
- Returning the value instead of the subtree node.
- Recursing without returning the recursive result.

## Related follow-ups

- [Insert into a Binary Search Tree](../02_Medium/02_insert_into_bst.md)
- [Binary Search](../../../10_Searching/03_Problems/01_Easy/01_binary_search.md) (10_Searching)
- [Kth Smallest Element in a BST](../02_Medium/08_kth_smallest_in_bst.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
