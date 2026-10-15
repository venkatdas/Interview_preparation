# Maximum Depth of Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | bottom-up / BFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #104 — https://leetcode.com/problems/maximum-depth-of-binary-tree/ |
| **Solution file** | [01_maximum_depth.js](../solutions/01_maximum_depth.js) — open only after a real attempt |

## Problem

Return the number of nodes on the longest path from the root down to the farthest leaf.
(Depth counted in NODES here: a single node has depth 1, an empty tree has depth 0.)

## Examples

```
Input: [3,9,20,null,null,15,7]   Output: 3   Explanation: 3 -> 20 -> 15 (or 7)
Input: [1,null,2]                Output: 2
Input: []                        Output: 0
```

## Constraints & clarifying questions

```
- Depth in nodes or in edges? (nodes here; edges = nodes - 1)
- Can the tree be empty? (yes -> 0)
- How deep can it get? (if ~10^5 and skewed, recursion may overflow -> offer BFS)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bottom-up / BFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS, count levels)   O(n) time, O(w) space. Walk the tree level by level with a queue; each full level we finish adds 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bottom-up recursion)   O(n) time, O(h) space. Leap of faith: assume maxDepth(left) and maxDepth(right) are correct.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> 0
- single node -> 1
- skewed tree (linked list shape) -> n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS, count levels)   O(n) time, O(w) space

```
Walk the tree level by level with a queue; each full level we finish adds 1.
Not slower in big-O, but more code than the recursion. It is the version to use
when recursion depth is a concern.
```

### APPROACH 2 — Optimal (bottom-up recursion)   O(n) time, O(h) space

```
Leap of faith: assume maxDepth(left) and maxDepth(right) are correct.
Then my depth = 1 + the bigger of the two. Base case: null -> 0.

Dry run on [3,9,20,null,null,15,7]:
  depth(3) = 1 + max(depth(9), depth(20))
    depth(9)  = 1 + max(0, 0) = 1
    depth(20) = 1 + max(depth(15), depth(7)) = 1 + max(1, 1) = 2
  = 1 + max(1, 2) = 3
```

### Edge cases

```
- empty tree -> 0
- single node -> 1
- skewed tree (linked list shape) -> n
```

Full JavaScript solution with tests: [01_maximum_depth.js](../solutions/01_maximum_depth.js). Run it with `node 01_maximum_depth.js` from the solutions folder.

</details>

## Common mistakes

- Returning -1 or 1 for an empty tree; LeetCode counts nodes, so empty = 0.
- Confusing depth in nodes with height in edges.
- Recursing on huge skewed trees in JS (mention the iterative BFS option).

## Related follow-ups

- [Minimum Depth of Binary Tree](02_minimum_depth.md)
- [Balanced Binary Tree](06_balanced_binary_tree.md)
- [Maximum Depth of N-ary Tree](../../../02_N_Ary_Trees_And_Misc/03_Problems/01_Easy/02_max_depth_n_ary.md) (20_Trees/02_N_Ary_Trees_And_Misc)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
