# Trim a Binary Search Tree

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | return the new subtree |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #669 — https://leetcode.com/problems/trim-a-binary-search-tree/ |
| **Solution file** | [10_trim_a_bst.js](../solutions/10_trim_a_bst.js) — open only after a real attempt |

## Problem

Given a BST and bounds [low, high], remove every node whose value is outside the
range, keeping the relative structure of the remaining nodes. Return the new root.

## Examples

```
Input: root=[1,0,2], low=1, high=2              Output: [1,null,2]
Input: root=[3,0,4,null,2,null,null,1], low=1, high=3   Output: [3,2,null,1]
```

## Constraints & clarifying questions

```
- Inclusive bounds? (yes)   - Values unique? (yes)
- Can the whole tree be removed? (yes -> return null)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *return the new subtree* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (collect in-range values in order, rebuild a BST)   O(n) time, O(n) space. Inorder traversal, keep the values in range, then rebuild a BST from the sorted list (middle element as root).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (recursive trim using the BST property)   O(n) time, O(h) space. trim(node): - null -> null - node.val &lt; low  -> node AND its whole left subtree are too small; the answer is trim(node.right) - node.val > high -> node and its right subtree are too big; the answer is trim(node.left) - in range -> keep node; node.left = trim(n

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- everything outside the range -> null
- range contains everything -> unchanged
- root outside the range -> the root changes
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect in-range values in order, rebuild a BST)   O(n) time, O(n) space

```
Inorder traversal, keep the values in range, then rebuild a BST from the sorted list
(middle element as root). Correct values, but the shape changes, which the problem
forbids ("keep the relative structure"). Shown to contrast with the real solution.
```

### APPROACH 2 — Optimal (recursive trim using the BST property)   O(n) time, O(h) space

```
trim(node):
  - null -> null
  - node.val < low  -> node AND its whole left subtree are too small; the answer is trim(node.right)
  - node.val > high -> node and its right subtree are too big; the answer is trim(node.left)
  - in range -> keep node; node.left = trim(node.left); node.right = trim(node.right)

Dry run on [3,0,4,null,2,null,null,1], low=1, high=3:
  trim(3): in range. left = trim(0): 0 < 1 -> trim(0.right = 2): in range
             2.left = trim(1): in range, leaf -> 1 ; 2.right = null  -> returns 2
           right = trim(4): 4 > 3 -> trim(4.left = null) -> null
  result: 3 with left 2 (with left 1) -> [3,2,null,1]
```

### Edge cases

```
- everything outside the range -> null
- range contains everything -> unchanged
- root outside the range -> the root changes
```

Full JavaScript solution with tests: [10_trim_a_bst.js](../solutions/10_trim_a_bst.js). Run it with `node 10_trim_a_bst.js` from the solutions folder.

</details>

## Common mistakes

- Dropping a node and its entire subtree when only one side is out of range.
- Not returning the trimmed subtree up to the parent.
- Visiting every node in a way that ignores BST pruning.

## Related follow-ups

- [Range Sum of BST](../01_Easy/03_range_sum_of_bst.md)
- [Delete Node in a BST](11_delete_node_in_bst.md)
- [Validate Binary Search Tree](07_validate_bst.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
