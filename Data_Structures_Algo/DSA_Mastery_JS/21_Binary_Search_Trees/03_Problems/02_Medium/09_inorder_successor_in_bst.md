# Inorder Successor in BST

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | remember the last left turn |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #285 — https://leetcode.com/problems/inorder-successor-in-bst/ |
| **Solution file** | [09_inorder_successor_in_bst.js](../solutions/09_inorder_successor_in_bst.js) — open only after a real attempt |

## Problem

Given a BST and a node p in it, return the node with the smallest value GREATER than
p.val (the next node in inorder). Return null if p is the largest.

## Examples

```
Input: root=[2,1,3], p=1               Output: 2
Input: root=[5,3,6,2,4,null,null,1], p=6   Output: null
Input: root=[5,3,6,2,4,null,null,1], p=4   Output: 5   Explanation: 4 has no right subtree, so go UP
```

## Constraints & clarifying questions

```
- Values unique? (yes)   - Do nodes have parent pointers? (no, in this version)
- Is p guaranteed to be in the tree? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *remember the last left turn* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (full inorder, find p, take the next)   O(n) time, O(n) space. Collect the inorder list of NODES, locate p, return the element after it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (walk down from the root, remember the last left turn)   O(h) time, O(1) space. Search for p.val from the root.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- p is the max -> null
- p has a right subtree -> leftmost of it
- p is the root
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (full inorder, find p, take the next)   O(n) time, O(n) space

```
Collect the inorder list of NODES, locate p, return the element after it.
```

### APPROACH 2 — Optimal (walk down from the root, remember the last left turn)   O(h) time, O(1) space

```
Search for p.val from the root. Every time we go LEFT (current.val > p.val), current is
a candidate successor: it is bigger than p, and we keep looking for a smaller one on
the left. Every time we go right, current is <= p so it cannot be the answer.
The last candidate when we fall off the tree is the successor.
(If p has a right subtree, the answer is the min of that subtree; the walk-from-root
version finds it too, with no special case.)

Dry run on [5,3,6,2,4,null,null,1], p=4:
  at 5: 4 < 5 -> candidate 5, go left
  at 3: 4 > 3 -> go right
  at 4: 4 == 4 -> not bigger, go right -> null. Answer: 5
```

### Edge cases

```
- p is the max -> null
- p has a right subtree -> leftmost of it
- p is the root
```

Full JavaScript solution with tests: [09_inorder_successor_in_bst.js](../solutions/09_inorder_successor_in_bst.js). Run it with `node 09_inorder_successor_in_bst.js` from the solutions folder.

</details>

## Common mistakes

- Returning the right child instead of the leftmost node of the right subtree.
- Forgetting the case with no right child (the successor is an ancestor).
- Using `<=` vs `<` incorrectly so the node itself is returned.

## Related follow-ups

- Inorder Successor in BST II (LeetCode #510)
- [Delete Node in a BST](11_delete_node_in_bst.md)
- [Kth Smallest Element in a BST](08_kth_smallest_in_bst.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
