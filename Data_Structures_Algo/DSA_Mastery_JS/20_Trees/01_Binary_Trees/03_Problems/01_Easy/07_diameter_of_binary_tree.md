# Diameter of Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | return height, record best |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #543 — https://leetcode.com/problems/diameter-of-binary-tree/ |
| **Solution file** | [07_diameter_of_binary_tree.js](../solutions/07_diameter_of_binary_tree.js) — open only after a real attempt |

## Problem

The diameter is the number of EDGES on the longest path between any two nodes.
The path may or may not pass through the root.

## Examples

```
Input: [1,2,3,4,5]   Output: 3   Explanation: 4 -> 2 -> 1 -> 3 (or 5 -> 2 -> 1 -> 3)
Input: [1,2]         Output: 1
Input: [1]           Output: 0
```

## Constraints & clarifying questions

```
- Edges or nodes? (edges here; nodes = edges + 1)
- Must the path go through the root? (no, this is the whole point)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *return height, record best* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (height at every node)   O(n^2) worst, O(h) space. The longest path that "bends" at node X has length height(X.left) + height(X.right) (heights in nodes).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bottom-up, return height, record diameter)   O(n) time, O(h) space. One recursion that RETURNS the height of the subtree (in nodes), and as a side effect UPDATES an outer variable `best` with leftHeight + rightHeight at each node.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0, [1] -> 0
- longest path not through the root: [1,2,null,3,4,null,null,5,null,6] -> 4 (6-5-3-2-4), entirely in the left subtree
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (height at every node)   O(n^2) worst, O(h) space

```
The longest path that "bends" at node X has length height(X.left) + height(X.right)
(heights in nodes). Compute that for every node, take the max. height() is recomputed
for every node, so this is O(n * h) = O(n^2) on a skewed tree.
```

### APPROACH 2 — Optimal (bottom-up, return height, record diameter)   O(n) time, O(h) space

```
One recursion that RETURNS the height of the subtree (in nodes), and as a side
effect UPDATES an outer variable `best` with leftHeight + rightHeight at each node.
This "return one thing, record another" trick is used again in Max Path Sum.

Dry run on [1,2,3,4,5]:
  height(4) = 1, best = max(0, 0+0) = 0
  height(5) = 1
  height(2): left 1, right 1 -> best = 2, returns 2
  height(3) = 1
  height(1): left 2, right 1 -> best = 3, returns 3
  answer 3
```

### Edge cases

```
- [] -> 0, [1] -> 0
- longest path not through the root: [1,2,null,3,4,null,null,5,null,6] -> 4 (6-5-3-2-4), entirely in the left subtree
```

Full JavaScript solution with tests: [07_diameter_of_binary_tree.js](../solutions/07_diameter_of_binary_tree.js). Run it with `node 07_diameter_of_binary_tree.js` from the solutions folder.

</details>

## Common mistakes

- Assuming the longest path goes through the root.
- Mixing up nodes and edges in the count.
- Returning the diameter instead of the height from the helper.

## Related follow-ups

- [Binary Tree Maximum Path Sum](../03_Hard/19_maximum_path_sum.md)
- [Balanced Binary Tree](06_balanced_binary_tree.md)
- Longest Univalue Path (LeetCode #687)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
