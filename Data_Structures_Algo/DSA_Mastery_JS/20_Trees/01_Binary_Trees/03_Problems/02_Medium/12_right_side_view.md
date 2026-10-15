# Binary Tree Right Side View

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | DFS right-first / BFS last |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #199 — https://leetcode.com/problems/binary-tree-right-side-view/ |
| **Solution file** | [12_right_side_view.js](../solutions/12_right_side_view.js) — open only after a real attempt |

## Problem

Standing on the right side of the tree, return the values you can see from top to
bottom: the LAST node of every level.

## Examples

```
Input: [1,2,3,null,5,null,4]   Output: [1,3,4]
Input: [1,2,3,4]               Output: [1,3,4]   Explanation: 4 is under 2 but it is the only node on level 2
Input: []                      Output: []
```

## Constraints & clarifying questions

```
- Is it "rightmost node per level", not "only right children"? (yes, see example 2)
- Empty tree -> []
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS right-first / BFS last* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (full level order, take the last of each level)   O(n) time, O(n) space. Build all the levels (problem 10), then map each level to its last element.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS right-first, record first node seen at each depth)   O(n) time, O(h) space. Visit node, then RIGHT child, then left child, carrying the depth.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> []
- left-skewed tree: every node is visible
- a left node deeper than any right node must appear
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (full level order, take the last of each level)   O(n) time, O(n) space

```
Build all the levels (problem 10), then map each level to its last element.
Stores every level when we only need one value per level.
```

### APPROACH 2 — Optimal (DFS right-first, record first node seen at each depth)   O(n) time, O(h) space

```
Visit node, then RIGHT child, then left child, carrying the depth. The first time
we arrive at a new depth, that node is the rightmost one (because we always went
right first), so push it. Later nodes at that depth are ignored.
(BFS keeping only the last node of each level is an equally good answer.)

Dry run on [1,2,3,null,5,null,4]:
  dfs(1, d0): result.length 0 == 0 -> push 1
    dfs(3, d1): 1 == 1 -> push 3
      dfs(4, d2): 2 == 2 -> push 4
    dfs(2, d1): 2 != 1 -> skip
      dfs(5, d2): 3 != 2 -> skip
  -> [1, 3, 4]
```

### Edge cases

```
- [] -> []
- left-skewed tree: every node is visible
- a left node deeper than any right node must appear
```

Full JavaScript solution with tests: [12_right_side_view.js](../solutions/12_right_side_view.js). Run it with `node 12_right_side_view.js` from the solutions folder.

</details>

## Common mistakes

- Only following right children (a left subtree can be visible when it is deeper).
- Taking the first node of each BFS level instead of the last.
- In DFS, recording a value when `depth > result.length` but visiting left before right.

## Related follow-ups

- [Binary Tree Level Order Traversal](10_level_order_traversal.md)
- [Populating Next Right Pointers in Each Node](16_populating_next_right_pointers.md)
- Binary Tree Left Side View (classic variant)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
