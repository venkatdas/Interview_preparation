# Validate Binary Search Tree

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | bounds passed down |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #98 — https://leetcode.com/problems/validate-binary-search-tree/ |
| **Solution file** | [07_validate_bst.js](../solutions/07_validate_bst.js) — open only after a real attempt |

## Problem

Return true if the tree is a valid BST: for EVERY node, all values in its left
subtree are strictly smaller and all values in its right subtree are strictly larger.

## Examples

```
Input: [2,1,3]             Output: true
Input: [5,1,4,null,null,3,6]   Output: false   Explanation: 3 is in the right subtree of 5 but 3 < 5
Input: [5,4,6,null,null,3,7]   Output: false   Explanation: 3 < 6 (ok for parent) but 3 < 5 (not ok for grandparent)
```

## Constraints & clarifying questions

```
- Are duplicates allowed? (no: strictly less / strictly greater)
- Value range? (can include the min/max int, so use -Infinity/Infinity or null bounds)

THE CLASSIC BUG: checking only node.left.val < node.val < node.right.val (compare with
the parent only). The third example passes that check at every node but is NOT a BST,
because 3 violates the GRANDPARENT 5. Every node must respect ALL its ancestors.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bounds passed down* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (inorder must be strictly increasing)   O(n) time, O(n) space. Inorder traversal of a BST yields sorted ascending values.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (pass down a (low, high) range)   O(n) time, O(h) space. Each node must satisfy low &lt; node.val &lt; high.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> true, single node -> true
- duplicates: [2,2] -> false
- values equal to the bounds: [1, 1] false, use strict comparisons
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (inorder must be strictly increasing)   O(n) time, O(n) space

```
Inorder traversal of a BST yields sorted ascending values. Collect the inorder into an
array and check that each value is strictly greater than the previous. Simple and
correct; costs an O(n) array (can be reduced to one "previous" variable).
```

### APPROACH 2 — Optimal (pass down a (low, high) range)   O(n) time, O(h) space

```
Each node must satisfy low < node.val < high. Going left tightens the HIGH bound to
node.val; going right tightens the LOW bound to node.val. The range carries the
constraints from ALL ancestors, which is exactly what the parent-only check misses.

Dry run on [5,4,6,null,null,3,7]:
  valid(5, -inf, inf) ok
    valid(4, -inf, 5) ok; children null
    valid(6, 5, inf) ok
      valid(3, 5, 6): 3 < 5 -> FALSE   <- caught by the inherited low bound
```

### Edge cases

```
- empty tree -> true, single node -> true
- duplicates: [2,2] -> false
- values equal to the bounds: [1, 1] false, use strict comparisons
```

Full JavaScript solution with tests: [07_validate_bst.js](../solutions/07_validate_bst.js). Run it with `node 07_validate_bst.js` from the solutions folder.

</details>

## Common mistakes

- Only comparing a node with its direct children.
- Initial bounds of `±2^31` instead of `±Infinity` (values can equal those limits).
- Allowing duplicates when the definition requires strict ordering.

## Related follow-ups

- [Recover Binary Search Tree](12_recover_bst.md)
- [Kth Smallest Element in a BST](08_kth_smallest_in_bst.md)
- [Count Good Nodes in Binary Tree](../../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/13_count_good_nodes.md) (20_Trees/01_Binary_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
