# Count Good Nodes in Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | top-down max so far |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1448 — https://leetcode.com/problems/count-good-nodes-in-binary-tree/ |
| **Solution file** | [13_count_good_nodes.js](../solutions/13_count_good_nodes.js) — open only after a real attempt |

## Problem

A node X is "good" if on the path from the root to X there is no node with a value
GREATER than X.val (the root is always good). Count the good nodes.

## Examples

```
Input: [3,1,4,3,null,1,5]   Output: 4   Explanation: 3 (root), 4, 5, and the left 3 are good
Input: [3,3,null,4,2]       Output: 3   Explanation: 2 is not good because 3 > 2 above it
Input: [1]                  Output: 1
```

## Constraints & clarifying questions

```
- "No node greater" means equal values are still good? (yes, >= counts as good)
- Negative values? (yes, so start the running max at -Infinity)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *top-down max so far* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (for each node, walk its ancestors)   O(n * h) time, O(h) space. DFS while keeping the explicit list of ancestors on the path.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (top-down, pass the max so far)   O(n) time, O(h) space. The only thing a node needs to know about its ancestors is the biggest value among them.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single node -> 1
- all equal values -> every node is good
- strictly decreasing path -> only the root is good
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (for each node, walk its ancestors)   O(n * h) time, O(h) space

```
DFS while keeping the explicit list of ancestors on the path. At each node, scan the
whole path and check that none is greater. Scanning costs O(h) per node.
```

### APPROACH 2 — Optimal (top-down, pass the max so far)   O(n) time, O(h) space

```
The only thing a node needs to know about its ancestors is the biggest value among
them. Pass that single number down. If node.val >= maxSoFar, count it and the new
max becomes node.val.

Dry run on [3,1,4,3,null,1,5]:
  dfs(3, max=-inf): 3 >= -inf good (1), max 3
    dfs(1, 3): 1 < 3 not good
      dfs(3, 3): 3 >= 3 good (2)
    dfs(4, 3): 4 >= 3 good (3), max 4
      dfs(1, 4): not good
      dfs(5, 4): good (4)
  -> 4
```

### Edge cases

```
- single node -> 1
- all equal values -> every node is good
- strictly decreasing path -> only the root is good
```

Full JavaScript solution with tests: [13_count_good_nodes.js](../solutions/13_count_good_nodes.js). Run it with `node 13_count_good_nodes.js` from the solutions folder.

</details>

## Common mistakes

- Passing the parent's value instead of the maximum along the whole path.
- Using `>` instead of `>=` (equal values count as good).
- Forgetting the root is always good.

## Related follow-ups

- [Path Sum](../01_Easy/08_path_sum.md)
- [Validate Binary Search Tree](../../../../21_Binary_Search_Trees/03_Problems/02_Medium/07_validate_bst.md) (21_Binary_Search_Trees)
- [Path Sum II](14_path_sum_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
