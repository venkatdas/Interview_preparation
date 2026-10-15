# Lowest Common Ancestor of a Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | bottom-up "return what you found" |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #236 — https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/ |
| **Solution file** | [17_lowest_common_ancestor.js](../solutions/17_lowest_common_ancestor.js) — open only after a real attempt |

## Problem

Given a binary tree and two nodes p and q that are both in the tree, return the
deepest node that has BOTH p and q in its subtree (a node counts as its own ancestor).

## Examples

```
Input: [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1   Output: 3
Input: same tree, p=5, q=4                        Output: 5   Explanation: 5 is an ancestor of 4
Input: [1,2], p=1, q=2                            Output: 1
```

## Constraints & clarifying questions

```
- Are p and q guaranteed to exist in the tree? (yes; if not, you need an extra check)
- Are values unique? (yes, so we can compare by value or by reference)
- Is it a BST? (no; the BST version is simpler, see 21_Binary_Search_Trees)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bottom-up "return what you found"* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (find both root-to-node paths, compare)   O(n) time, O(n) space. DFS to find the path from the root to p, and the path from the root to q (arrays of nodes).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (one bottom-up recursion)   O(n) time, O(h) space. lca(node): returns p or q if node IS p or q (we stop looking below it), null if the subtree contains neither, otherwise the LCA.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- p is an ancestor of q (answer is p)
- p and q are root and a leaf
- both are leaves far apart (answer is high up)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (find both root-to-node paths, compare)   O(n) time, O(n) space

```
DFS to find the path from the root to p, and the path from the root to q (arrays of
nodes). Walk both paths together while they agree; the last common node is the LCA.
Two traversals plus two path arrays.
```

### APPROACH 2 — Optimal (one bottom-up recursion)   O(n) time, O(h) space

```
lca(node): returns p or q if node IS p or q (we stop looking below it), null if the
subtree contains neither, otherwise the LCA.
  left  = lca(node.left), right = lca(node.right)
  - both non-null -> p and q are on different sides -> node is the LCA
  - only one non-null -> pass it up (it is either the LCA already, or p/q alone)
Why stopping at p works: if q is below p, the other side returns null and p bubbles up.

Dry run on [3,5,1,6,2,0,8,null,null,7,4], p=5, q=4:
  lca(3): lca(5) -> node is p, return 5 immediately
          lca(1) -> subtree {1,0,8} has neither -> null
          one side non-null -> return 5
```

### Edge cases

```
- p is an ancestor of q (answer is p)
- p and q are root and a leaf
- both are leaves far apart (answer is high up)
```

Full JavaScript solution with tests: [17_lowest_common_ancestor.js](../solutions/17_lowest_common_ancestor.js). Run it with `node 17_lowest_common_ancestor.js` from the solutions folder.

</details>

## Common mistakes

- Using the BST shortcut (compare values) on a general binary tree.
- Not handling the case where p is an ancestor of q.
- Comparing node values when duplicates are possible; compare nodes.

## Related follow-ups

- [Lowest Common Ancestor of a Binary Search Tree](../../../../21_Binary_Search_Trees/03_Problems/02_Medium/06_lowest_common_ancestor_bst.md) (21_Binary_Search_Trees)
- [All Nodes Distance K in Binary Tree](../../../02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/06_all_nodes_distance_k.md) (20_Trees/02_N_Ary_Trees_And_Misc)
- Lowest Common Ancestor of a Binary Tree III (LeetCode #1650)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
