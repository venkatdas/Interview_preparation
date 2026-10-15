# Maximum Depth of N-ary Tree

| | |
|---|---|
| **Topic** | N-ary Trees and Miscellaneous |
| **Difficulty** | Easy |
| **Pattern** | for-child recursion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #559 — https://leetcode.com/problems/maximum-depth-of-n-ary-tree/ |
| **Solution file** | [02_max_depth_n_ary.js](../solutions/02_max_depth_n_ary.js) — open only after a real attempt |

## Problem

Return the number of nodes on the longest root-to-leaf path of an N-ary tree.

## Examples

```
Input: [1,null,3,2,4,null,5,6]   Output: 3
Input: [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]   Output: 5
```

## Constraints & clarifying questions

```
- Depth in nodes? (yes)   - Empty tree -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *for-child recursion* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS counting levels)   O(n) time, O(w) space. Level order; count how many levels you finish.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (recursion)   O(n) time, O(h) space. depth(node) = 1 + max over children of depth(child); a leaf (no children) is 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0, [1] -> 1
- a long chain -> n
- Math.max(...[]) === -Infinity trap
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS counting levels)   O(n) time, O(w) space

```
Level order; count how many levels you finish.
```

### APPROACH 2 — Optimal (recursion)   O(n) time, O(h) space

```
depth(node) = 1 + max over children of depth(child); a leaf (no children) is 1.
Same big-O as BFS, far less code. Note Math.max() of an empty list is -Infinity,
so handle the leaf case explicitly or start the max at 0.

Dry run on [1,null,3,2,4,null,5,6]:
  depth(1) = 1 + max(depth(3), depth(2), depth(4)) = 1 + max(2, 1, 1) = 3
    depth(3) = 1 + max(depth(5)=1, depth(6)=1) = 2
```

### Edge cases

```
- [] -> 0, [1] -> 1
- a long chain -> n
- Math.max(...[]) === -Infinity trap
```

Full JavaScript solution with tests: [02_max_depth_n_ary.js](../solutions/02_max_depth_n_ary.js). Run it with `node 02_max_depth_n_ary.js` from the solutions folder.

</details>

## Common mistakes

- Overwriting the best child depth instead of taking the max.
- Returning 0 for a single node (it should be 1 when counting nodes).
- Forgetting nodes whose `children` array is empty are leaves.

## Related follow-ups

- [Maximum Depth of Binary Tree](../../../01_Binary_Trees/03_Problems/01_Easy/01_maximum_depth.md) (20_Trees/01_Binary_Trees)
- [N-ary Tree Level Order Traversal](../02_Medium/03_n_ary_level_order.md)
- [N-ary Tree Preorder Traversal](01_n_ary_preorder.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
