# Binary Tree Zigzag Level Order Traversal

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | BFS, alternate direction |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #103 — https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/ |
| **Solution file** | [11_zigzag_level_order.js](../solutions/11_zigzag_level_order.js) — open only after a real attempt |

## Problem

Level order traversal, but alternate direction: level 0 left-to-right, level 1
right-to-left, level 2 left-to-right, and so on.

## Examples

```
Input: [3,9,20,null,null,15,7]   Output: [[3],[20,9],[15,7]]
Input: [1]                       Output: [[1]]
Input: []                        Output: []
```

## Constraints & clarifying questions

```
- Does the first level go left-to-right? (yes)
- Empty tree -> []
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS, alternate direction* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (normal level order, then reverse odd levels)   O(n) time, O(w) space. Run the standard BFS, then call reverse() on every level with an odd index.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS, fill the level array from the correct end)   O(n) time, O(w) space. Same BFS, but pre-size the level array and write each value at index i (left-to-right levels) or levelSize - 1 - i (right-to-left levels).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> []
- single node
- levels with 1 node are unaffected by direction
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (normal level order, then reverse odd levels)   O(n) time, O(w) space

```
Run the standard BFS, then call reverse() on every level with an odd index.
The reverse costs an extra pass over half the nodes. Honestly fine, and the
easiest to get right under pressure.
```

### APPROACH 2 — Optimal (BFS, fill the level array from the correct end)   O(n) time, O(w) space

```
Same BFS, but pre-size the level array and write each value at index i (left-to-right
levels) or levelSize - 1 - i (right-to-left levels). No reverse needed.
A deque with alternating push/unshift is the other common way.

Dry run on [3,9,20,null,null,15,7]:
  level 0 (L->R): [3]
  level 1 (R->L): size 2; 9 goes to index 1, 20 goes to index 0 -> [20, 9]
  level 2 (L->R): [15, 7]
```

### Edge cases

```
- [] -> []
- single node
- levels with 1 node are unaffected by direction
```

Full JavaScript solution with tests: [11_zigzag_level_order.js](../solutions/11_zigzag_level_order.js). Run it with `node 11_zigzag_level_order.js` from the solutions folder.

</details>

## Common mistakes

- Reversing the order children are enqueued, which breaks later levels.
- Using `unshift` per element (O(n²) total); fill by index or reverse once per level.
- Starting with right-to-left instead of left-to-right.

## Related follow-ups

- [Binary Tree Level Order Traversal](10_level_order_traversal.md)
- [Binary Tree Right Side View](12_right_side_view.md)
- [Vertical Order Traversal of a Binary Tree](../../../02_N_Ary_Trees_And_Misc/03_Problems/03_Hard/07_vertical_order_traversal.md) (20_Trees/02_N_Ary_Trees_And_Misc)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
