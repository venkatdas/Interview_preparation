# N-ary Tree Level Order Traversal

| | |
|---|---|
| **Topic** | N-ary Trees and Miscellaneous |
| **Difficulty** | Medium |
| **Pattern** | BFS current/next |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #429 — https://leetcode.com/problems/n-ary-tree-level-order-traversal/ |
| **Solution file** | [03_n_ary_level_order.js](../solutions/03_n_ary_level_order.js) — open only after a real attempt |

## Problem

Return the values level by level (array of arrays) of an N-ary tree.

## Examples

```
Input: [1,null,3,2,4,null,5,6]   Output: [[1],[3,2,4],[5,6]]
Input: []                        Output: []
```

## Constraints & clarifying questions

```
- Order inside a level: left to right? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS current/next* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS with depth)   O(n) time, O(h) space. Recurse with the depth; push node.val into levels[depth].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS, one level per loop)   O(n) time, O(w) space. Same template as the binary tree version, with `queue.push(...node.children)`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> []
- single node -> [[1]]
- wide tree: one big second level
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS with depth)   O(n) time, O(h) space

```
Recurse with the depth; push node.val into levels[depth]. Preorder visits children
left to right, so each level fills in the right order.
```

### APPROACH 2 — Optimal (BFS, one level per loop)   O(n) time, O(w) space

```
Same template as the binary tree version, with `queue.push(...node.children)`.
Here the "current level" array is swapped for a "next level" array instead of using
queue.shift(), which avoids the O(n) shift cost in JS.

Dry run on [1,null,3,2,4,null,5,6]:
  level [1]      -> next [3,2,4]
  level [3,2,4]  -> next [5,6]
  level [5,6]    -> next []  done
```

### Edge cases

```
- empty -> []
- single node -> [[1]]
- wide tree: one big second level
```

Full JavaScript solution with tests: [03_n_ary_level_order.js](../solutions/03_n_ary_level_order.js). Run it with `node 03_n_ary_level_order.js` from the solutions folder.

</details>

## Common mistakes

- Not saving the level size before the inner loop.
- Spreading huge children arrays with `push(...children)` can hit argument limits for extremely wide nodes; use a loop.
- Returning a flat list instead of one list per level.

## Related follow-ups

- [Binary Tree Level Order Traversal](../../../01_Binary_Trees/03_Problems/02_Medium/10_level_order_traversal.md) (20_Trees/01_Binary_Trees)
- [Maximum Depth of N-ary Tree](../01_Easy/02_max_depth_n_ary.md)
- [Binary Tree Zigzag Level Order Traversal](../../../01_Binary_Trees/03_Problems/02_Medium/11_zigzag_level_order.md) (20_Trees/01_Binary_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
