# Lowest Common Ancestor of a Binary Search Tree

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | split point by ordering |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #235 — https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/ |
| **Solution file** | [06_lowest_common_ancestor_bst.js](../solutions/06_lowest_common_ancestor_bst.js) — open only after a real attempt |

## Problem

Given a BST and two nodes p and q in it, return their lowest common ancestor.

## Examples

```
Input: root=[6,2,8,0,4,7,9,null,null,3,5], p=2, q=8   Output: 6
Input: same, p=2, q=4                                  Output: 2   (a node is its own ancestor)
```

## Constraints & clarifying questions

```
- Both nodes exist? (yes)  - Values unique? (yes)
- Do we know it is a BST? (yes, that is the whole shortcut vs. problem 17 in 20_Trees/01_Binary_Trees, Lowest Common Ancestor of a Binary Tree)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *split point by ordering* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (generic binary tree LCA)   O(n) time, O(h) space. The "return what you found" recursion from the plain binary tree version.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (use ordering to pick a side)   O(h) time, O(1) space. Start at the root.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- p is an ancestor of q
- p and q on opposite sides of the root -> root
- skewed tree -> O(n) walk but still O(1) space
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (generic binary tree LCA)   O(n) time, O(h) space

```
The "return what you found" recursion from the plain binary tree version. Correct,
but it may visit the whole tree.
```

### APPROACH 2 — Optimal (use ordering to pick a side)   O(h) time, O(1) space

```
Start at the root. If both p and q are smaller than the node, the LCA is in the left
subtree; if both are bigger, it is in the right subtree. Otherwise they are on
different sides (or one equals the node), so THIS node is the LCA.

Dry run on root 6, p=2, q=4:
  at 6: both < 6 -> go left
  at 2: not both smaller, not both bigger (2 == p) -> answer 2
```

### Edge cases

```
- p is an ancestor of q
- p and q on opposite sides of the root -> root
- skewed tree -> O(n) walk but still O(1) space
```

Full JavaScript solution with tests: [06_lowest_common_ancestor_bst.js](../solutions/06_lowest_common_ancestor_bst.js). Run it with `node 06_lowest_common_ancestor_bst.js` from the solutions folder.

</details>

## Common mistakes

- Using the general-tree O(n) algorithm when the BST order allows O(h).
- Getting the comparisons backwards when deciding to go left or right.
- Forgetting that p itself can be the LCA when q is in its subtree.

## Related follow-ups

- [Lowest Common Ancestor of a Binary Tree](../../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/17_lowest_common_ancestor.md) (20_Trees/01_Binary_Trees)
- [Search in a Binary Search Tree](../01_Easy/01_search_in_bst.md)
- [Inorder Successor in BST](09_inorder_successor_in_bst.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
