# Balanced Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | bottom-up with sentinel |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #110 — https://leetcode.com/problems/balanced-binary-tree/ |
| **Solution file** | [06_balanced_binary_tree.js](../solutions/06_balanced_binary_tree.js) — open only after a real attempt |

## Problem

A tree is height-balanced if, for EVERY node, the heights of its left and right
subtrees differ by at most 1. Return true if the tree is balanced.

## Examples

```
Input: [3,9,20,null,null,15,7]        Output: true
Input: [1,2,2,3,3,null,null,4,4]      Output: false   Explanation: at node 2 (left), heights 2 vs 0
Input: []                             Output: true
```

## Constraints & clarifying questions

```
- Only the root, or every node? (every node)
- Empty tree balanced? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bottom-up with sentinel* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (top-down)   O(n log n) best, O(n^2) worst; O(h) space. For each node, compute height(left) and height(right) from scratch, compare, then recurse into both children.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bottom-up, height with a failure signal)   O(n) time, O(h) space. One pass that returns the height of each subtree, but returns -1 (a sentinel) the moment any subtree is unbalanced.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> true, [1] -> true
- unbalanced deep inside but root looks fine -> must check every node
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (top-down)   O(n log n) best, O(n^2) worst; O(h) space

```
For each node, compute height(left) and height(right) from scratch, compare, then
recurse into both children. height() is O(subtree size), and it is recomputed for
every ancestor, so nodes near the bottom are counted many times.
```

### APPROACH 2 — Optimal (bottom-up, height with a failure signal)   O(n) time, O(h) space

```
One pass that returns the height of each subtree, but returns -1 (a sentinel) the
moment any subtree is unbalanced. A parent that sees -1 from a child passes -1 up
immediately. Each node is visited exactly once.

Dry run on [1,2,2,3,3,null,null,4,4]:
  check(4) -> 1, check(4) -> 1, check(3 left) -> 2, check(3 right) -> 1
  check(2 left): |2 - 1| = 1 ok -> 3
  check(2 right): leaf -> 1
  check(1): |3 - 1| = 2 > 1 -> -1  => false
```

### Edge cases

```
- [] -> true, [1] -> true
- unbalanced deep inside but root looks fine -> must check every node
```

Full JavaScript solution with tests: [06_balanced_binary_tree.js](../solutions/06_balanced_binary_tree.js). Run it with `node 06_balanced_binary_tree.js` from the solutions folder.

</details>

## Common mistakes

- Checking only the root's subtrees.
- Calling a separate `height()` at each node (O(n²) on skewed trees).
- Confusing "balanced" with "complete" or "perfect".

## Related follow-ups

- [Maximum Depth of Binary Tree](01_maximum_depth.md)
- [Diameter of Binary Tree](07_diameter_of_binary_tree.md)
- [Convert Sorted Array to Binary Search Tree](../../../../21_Binary_Search_Trees/03_Problems/01_Easy/04_sorted_array_to_bst.md) (21_Binary_Search_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
