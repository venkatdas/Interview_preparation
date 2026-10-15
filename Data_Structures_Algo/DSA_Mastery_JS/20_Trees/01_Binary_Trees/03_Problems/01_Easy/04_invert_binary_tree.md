# Invert Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | recursion / BFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #226 — https://leetcode.com/problems/invert-binary-tree/ |
| **Solution file** | [04_invert_binary_tree.js](../solutions/04_invert_binary_tree.js) — open only after a real attempt |

## Problem

Mirror the tree: swap the left and right child of EVERY node. Return the root.

## Examples

```
Input: [4,2,7,1,3,6,9]   Output: [4,7,2,9,6,3,1]
Input: [2,1,3]           Output: [2,3,1]
Input: []                Output: []
```

## Constraints & clarifying questions

```
- In place or return a new tree? (in place is fine, return the same root)
- Empty tree? (return null)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *recursion / BFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS with a queue, swap as you go)   O(n) time, O(w) space. Visit every node with a queue; at each node swap its two children, then enqueue them.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (recursion)   O(n) time, O(h) space. invert(node): invert the left subtree, invert the right subtree, then swap them.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> null
- single node -> unchanged
- node with only one child: the child moves to the other side
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS with a queue, swap as you go)   O(n) time, O(w) space

```
Visit every node with a queue; at each node swap its two children, then enqueue them.
Same big-O as the recursion; it is the iterative alternative and avoids deep recursion.
```

### APPROACH 2 — Optimal (recursion)   O(n) time, O(h) space

```
invert(node): invert the left subtree, invert the right subtree, then swap them.
(Order does not matter: swap first then recurse also works.)

Dry run on [2,1,3]:
  invert(2): invert(1) -> leaf, returns 1; invert(3) -> leaf, returns 3
             swap -> 2.left = 3, 2.right = 1  => [2,3,1]
```

### Edge cases

```
- empty -> null
- single node -> unchanged
- node with only one child: the child moves to the other side
```

Full JavaScript solution with tests: [04_invert_binary_tree.js](../solutions/04_invert_binary_tree.js). Run it with `node 04_invert_binary_tree.js` from the solutions folder.

</details>

## Common mistakes

- Assigning `root.left = invert(root.right)` and then using the already-overwritten `root.left` for the right side.
- Forgetting to return the root.
- Swapping values instead of subtrees.

## Related follow-ups

- [Symmetric Tree](05_symmetric_tree.md)
- [Same Tree](03_same_tree.md)
- [Flatten Binary Tree to Linked List](../02_Medium/15_flatten_binary_tree.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
