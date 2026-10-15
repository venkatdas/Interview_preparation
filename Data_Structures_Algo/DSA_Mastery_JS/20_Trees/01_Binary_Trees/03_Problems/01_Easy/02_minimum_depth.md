# Minimum Depth of Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | BFS early exit |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #111 — https://leetcode.com/problems/minimum-depth-of-binary-tree/ |
| **Solution file** | [02_minimum_depth.js](../solutions/02_minimum_depth.js) — open only after a real attempt |

## Problem

Return the number of nodes on the shortest path from the root down to the nearest LEAF.
A leaf is a node with no children.

## Examples

```
Input: [3,9,20,null,null,15,7]   Output: 2   Explanation: 3 -> 9 (9 is a leaf)
Input: [2,null,3,null,4]         Output: 3   Explanation: the only leaf is 4; 2 is NOT a leaf
```

## Constraints & clarifying questions

```
- Does a node with ONE child count as a leaf? (no, this is the trap of the problem)
- Empty tree? (0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS early exit* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS recursion)   O(n) time, O(h) space. Like max depth, but take the MIN of the children...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS, stop at first leaf)   O(n) worst, often much less; O(w) space. BFS visits nodes in order of depth, so the FIRST leaf we meet is at the minimum depth.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- [1] -> 1
- node with one child: must skip the missing side ([2,null,3,null,4] -> 3, not 1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS recursion)   O(n) time, O(h) space

```
Like max depth, but take the MIN of the children... with a catch: if one child is
missing, we must NOT use its depth 0 (that would treat a non-leaf as a leaf).
So: if only one child exists, recurse only into it. Visits every node even if the
nearest leaf is at level 2.
```

### APPROACH 2 — Optimal (BFS, stop at first leaf)   O(n) worst, often much less; O(w) space

```
BFS visits nodes in order of depth, so the FIRST leaf we meet is at the minimum depth.
We can return immediately without looking at the rest of the tree.

Dry run on [3,9,20,null,null,15,7]:
  level 1: [3]      not a leaf
  level 2: [9, 20]  9 has no children -> return 2
```

### Edge cases

```
- [] -> 0
- [1] -> 1
- node with one child: must skip the missing side ([2,null,3,null,4] -> 3, not 1)
```

Full JavaScript solution with tests: [02_minimum_depth.js](../solutions/02_minimum_depth.js). Run it with `node 02_minimum_depth.js` from the solutions folder.

</details>

## Common mistakes

- Taking `min(left, right)` when one child is null (that side has no leaf).
- Using DFS over the entire tree when BFS can stop at the first leaf.
- Returning 1 for an empty tree.

## Related follow-ups

- [Maximum Depth of Binary Tree](01_maximum_depth.md)
- [Binary Tree Level Order Traversal](../02_Medium/10_level_order_traversal.md)
- [Rotting Oranges](../../../../24_Graph_Traversal/03_Problems/02_Medium/10_rotting_oranges.md) (24_Graph_Traversal)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
