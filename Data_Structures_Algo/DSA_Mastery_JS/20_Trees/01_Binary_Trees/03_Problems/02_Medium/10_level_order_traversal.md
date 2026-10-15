# Binary Tree Level Order Traversal

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | BFS template |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #102 — https://leetcode.com/problems/binary-tree-level-order-traversal/ |
| **Solution file** | [10_level_order_traversal.js](../solutions/10_level_order_traversal.js) — open only after a real attempt |

## Problem

Return the node values level by level, left to right, as an array of arrays.

## Examples

```
Input: [3,9,20,null,null,15,7]   Output: [[3],[9,20],[15,7]]
Input: [1]                       Output: [[1]]
Input: []                        Output: []
```

## Constraints & clarifying questions

```
- Output shape: flat array or array of levels? (array of levels)
- Empty tree -> []
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS template* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS carrying the depth)   O(n) time, O(h) space. Recurse with (node, depth).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS with a queue, level by level)   O(n) time, O(w) space. Push the root.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> []
- skewed tree -> every level has one node
- queue.shift() is O(n) in JS; fine for interviews, or use a head index
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS carrying the depth)   O(n) time, O(h) space

```
Recurse with (node, depth). When we reach a node at depth d, push its value into
result[d]. Because we always go left before right, each level fills left-to-right.
Same complexity; it is the "DFS can do BFS's job" trick, nice to know.
```

### APPROACH 2 — Optimal (BFS with a queue, level by level)   O(n) time, O(w) space

```
Push the root. While the queue is not empty: remember levelSize = queue.length,
pop exactly that many nodes (they are one level), collect their values, push their
children. The children form the next level. This is THE template for all BFS tree
problems (zigzag, right side view, min depth, averages...).

Dry run on [3,9,20,null,null,15,7]:
  queue [3]        size 1 -> level [3],     push 9, 20
  queue [9,20]     size 2 -> level [9,20],  push 15, 7
  queue [15,7]     size 2 -> level [15,7]
  queue []         done
```

### Edge cases

```
- [] -> []
- skewed tree -> every level has one node
- queue.shift() is O(n) in JS; fine for interviews, or use a head index
```

Full JavaScript solution with tests: [10_level_order_traversal.js](../solutions/10_level_order_traversal.js). Run it with `node 10_level_order_traversal.js` from the solutions folder.

</details>

## Common mistakes

- Reading `queue.length` inside the loop instead of saving the level size first.
- Using `shift()` on very large trees without noting its O(n) cost.
- Pushing null children into the queue and then crashing on `.val`.

## Related follow-ups

- [Binary Tree Zigzag Level Order Traversal](11_zigzag_level_order.md)
- [Binary Tree Right Side View](12_right_side_view.md)
- [N-ary Tree Level Order Traversal](../../../02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/03_n_ary_level_order.md) (20_Trees/02_N_Ary_Trees_And_Misc)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
