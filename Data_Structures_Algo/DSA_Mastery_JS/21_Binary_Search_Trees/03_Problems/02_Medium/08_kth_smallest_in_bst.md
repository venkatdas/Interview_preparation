# Kth Smallest Element in a BST

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | iterative inorder, early stop |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #230 — https://leetcode.com/problems/kth-smallest-element-in-a-bst/ |
| **Solution file** | [08_kth_smallest_in_bst.js](../solutions/08_kth_smallest_in_bst.js) — open only after a real attempt |

## Problem

Return the kth smallest value (1-indexed) in a BST.

## Examples

```
Input: root=[3,1,4,null,2], k=1          Output: 1
Input: root=[5,3,6,2,4,null,null,1], k=3   Output: 3
```

## Constraints & clarifying questions

```
- 1 <= k <= n guaranteed? (yes)
- Follow-up: what if the tree changes often and we query kth a lot?
  (store subtree sizes in each node -> O(h) per query)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *iterative inorder, early stop* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (full inorder into an array)   O(n) time, O(n) space. Inorder gives sorted values; return values[k - 1].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (iterative inorder, stop at the kth node)   O(h + k) time, O(h) space. Use the explicit-stack inorder traversal and count nodes as they are popped.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> leftmost node; k = n -> rightmost node
- single node, k = 1
- skewed tree
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (full inorder into an array)   O(n) time, O(n) space

```
Inorder gives sorted values; return values[k - 1]. Always visits all n nodes.
```

### APPROACH 2 — Optimal (iterative inorder, stop at the kth node)   O(h + k) time, O(h) space

```
Use the explicit-stack inorder traversal and count nodes as they are popped. Stop
as soon as the counter reaches k. No array, and we do not touch the rest of the tree.

Dry run on [5,3,6,2,4,null,null,1], k=3:
  push 5, 3, 2, 1   (left spine)
  pop 1 -> count 1; pop 2 -> count 2; pop 3 -> count 3 == k -> return 3
```

### Edge cases

```
- k = 1 -> leftmost node; k = n -> rightmost node
- single node, k = 1
- skewed tree
```

Full JavaScript solution with tests: [08_kth_smallest_in_bst.js](../solutions/08_kth_smallest_in_bst.js). Run it with `node 08_kth_smallest_in_bst.js` from the solutions folder.

</details>

## Common mistakes

- Collecting the entire inorder list when you can stop at k.
- Off-by-one between 0-based and 1-based k.
- Shared counters not reset between calls.

## Related follow-ups

- [Kth Largest Element in an Array](../../../11_Sorting/03_Problems/02_Medium/04_kth_largest_element.md) (11_Sorting)
- [Validate Binary Search Tree](07_validate_bst.md)
- Binary Search Tree Iterator (LeetCode #173)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
