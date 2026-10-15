# Construct Binary Tree from Preorder and Inorder Traversal

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | divide by root, index map |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #105 — https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/ |
| **Solution file** | [18_construct_from_preorder_inorder.js](../solutions/18_construct_from_preorder_inorder.js) — open only after a real attempt |

## Problem

Given the preorder and inorder traversals of a tree with UNIQUE values, rebuild the tree.

## Examples

```
Input: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]   Output: [3,9,20,null,null,15,7]
Input: preorder=[-1], inorder=[-1]                     Output: [-1]
```

## Constraints & clarifying questions

```
- Values unique? (yes; otherwise the tree is not uniquely determined)
- Both arrays same length and valid? (yes)

Key insight:
  preorder[0] is the ROOT. Find it in inorder: everything to its LEFT is the left
  subtree, everything to its RIGHT is the right subtree. The left subtree has k nodes,
  so preorder[1..k] is the left subtree's preorder and preorder[k+1..] is the right's.
  Recurse.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *divide by root, index map* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (slice arrays, indexOf)   O(n^2) time, O(n^2) space. Literally implement the insight with indexOf and slice at every level.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (index map + pointers into the arrays)   O(n) time, O(n) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty arrays -> null
- single node
- fully left-skewed: preorder [1,2,3], inorder [3,2,1]
- fully right-skewed: preorder [1,2,3], inorder [1,2,3]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (slice arrays, indexOf)   O(n^2) time, O(n^2) space

```
Literally implement the insight with indexOf and slice at every level. indexOf is O(n)
and the slices copy arrays, so a skewed tree costs O(n^2).
```

### APPROACH 2 — Optimal (index map + pointers into the arrays)   O(n) time, O(n) space

```
1. Build a Map value -> index in inorder (O(1) lookup instead of indexOf).
2. Recurse on index ranges [inLeft, inRight] of inorder instead of copying arrays.
3. Consume preorder from left to right with a single moving pointer `preIndex`:
   the order we create nodes (root, then whole left subtree, then right) IS preorder.

Dry run on preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]:
  build(0,4): root = pre[0]=3, at inorder index 1
    left = build(0,0): root = pre[1]=9, index 0; left build(0,-1) null; right build(1,0) null
    right = build(2,4): root = pre[2]=20, index 3
      left = build(2,2): 15.  right = build(4,4): 7.
```

### Edge cases

```
- empty arrays -> null
- single node
- fully left-skewed: preorder [1,2,3], inorder [3,2,1]
- fully right-skewed: preorder [1,2,3], inorder [1,2,3]
```

Full JavaScript solution with tests: [18_construct_from_preorder_inorder.js](../solutions/18_construct_from_preorder_inorder.js). Run it with `node 18_construct_from_preorder_inorder.js` from the solutions folder.

</details>

## Common mistakes

- Searching the inorder array linearly for each root (O(n²)).
- Slicing arrays at every call (extra O(n) copies); pass index ranges.
- Building the right subtree before the left while consuming preorder in order.

## Related follow-ups

- Construct Binary Tree from Inorder and Postorder Traversal (LeetCode #106)
- [Serialize and Deserialize Binary Tree](../03_Hard/20_serialize_deserialize.md)
- [Convert Sorted Array to Binary Search Tree](../../../../21_Binary_Search_Trees/03_Problems/01_Easy/04_sorted_array_to_bst.md) (21_Binary_Search_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
