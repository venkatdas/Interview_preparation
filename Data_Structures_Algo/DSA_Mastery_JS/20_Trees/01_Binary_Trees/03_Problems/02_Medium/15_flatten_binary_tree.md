# Flatten Binary Tree to Linked List

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | in-place rewiring (Morris-style) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #114 — https://leetcode.com/problems/flatten-binary-tree-to-linked-list/ |
| **Solution file** | [15_flatten_binary_tree.js](../solutions/15_flatten_binary_tree.js) — open only after a real attempt |

## Problem

Flatten the tree IN PLACE into a "linked list" that uses the right pointers only
(every left is null), in PREORDER order.

## Examples

```
Input: [1,2,5,3,4,null,6]   Output: [1,null,2,null,3,null,4,null,5,null,6]
Input: []                   Output: []
Input: [0]                  Output: [0]
```

## Constraints & clarifying questions

```
- In place, O(1) extra space required? (the follow-up asks for it)
- Preorder order? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *in-place rewiring (Morris-style)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (collect preorder, then rewire)   O(n) time, O(n) space. Do a preorder traversal into an array of nodes, then for i = 0..n-2 set nodes[i].left = null, nodes[i].right = nodes[i+1].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Morris-style, O(1) extra space)   O(n) time, O(1) space. Walk down with `current`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree, single node
- already a right-only chain -> unchanged
- left-only chain -> becomes right-only chain
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect preorder, then rewire)   O(n) time, O(n) space

```
Do a preorder traversal into an array of nodes, then for i = 0..n-2 set
nodes[i].left = null, nodes[i].right = nodes[i+1]. Easy and correct, but uses O(n).
```

### APPROACH 2 — Optimal (Morris-style, O(1) extra space)   O(n) time, O(1) space

```
Walk down with `current`. If current has a left subtree:
  1. find the RIGHTMOST node of the left subtree (the last node of its preorder),
  2. attach current.right under that rightmost node's right,
  3. move the left subtree to the right, set left = null.
Then move current = current.right. Every node's left subtree gets spliced in
exactly once, so total work is O(n) even though step 1 walks down.

Dry run on [1,2,5,3,4,null,6]:
  current=1: left=2, rightmost of {2,3,4} is 4; 4.right = 5; 1.right = 2; 1.left = null
             tree: 1 -> 2 (3, 4 -> (null, 5 -> (null, 6)))
  current=2: left=3, rightmost of {3} is 3; 3.right = 4; 2.right = 3; 2.left = null
  current=3: no left. current=4: no left. current=5: no left. current=6: done.
  1 -> 2 -> 3 -> 4 -> 5 -> 6
```

### Edge cases

```
- empty tree, single node
- already a right-only chain -> unchanged
- left-only chain -> becomes right-only chain
```

Full JavaScript solution with tests: [15_flatten_binary_tree.js](../solutions/15_flatten_binary_tree.js). Run it with `node 15_flatten_binary_tree.js` from the solutions folder.

</details>

## Common mistakes

- Leaving `left` pointers non-null after flattening.
- Losing the original right subtree before attaching it to the end of the flattened left part.
- Building a new list instead of rewiring in place.

## Related follow-ups

- [Invert Binary Tree](../01_Easy/04_invert_binary_tree.md)
- [Populating Next Right Pointers in Each Node](16_populating_next_right_pointers.md)
- Increasing Order Search Tree (LeetCode #897)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
