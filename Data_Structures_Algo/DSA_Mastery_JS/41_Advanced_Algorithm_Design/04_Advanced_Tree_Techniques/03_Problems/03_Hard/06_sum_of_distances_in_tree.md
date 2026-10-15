# Sum of Distances in Tree

| | |
|---|---|
| **Topic** | Advanced Tree Techniques |
| **Difficulty** | Hard |
| **Pattern** | rerooting DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Graph Traversal](../../../../24_Graph_Traversal/README.md) |
| **Source** | LeetCode #834 — https://leetcode.com/problems/sum-of-distances-in-tree/ (statement paraphrased, not copied) |
| **Solution file** | [06_sum_of_distances_in_tree.js](../solutions/06_sum_of_distances_in_tree.js) — open only after a real attempt |

## Problem

A tree has n nodes 0..n-1. For every node i, compute the sum of the distances (in edges)
from i to all other nodes. Return the array of these sums.

## Examples

```
Input: n = 6, edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]   Output: [8,12,6,10,10,10]
Input: n = 1, edges = []                                Output: [0]
Input: n = 2, edges = [[1,0]]                           Output: [1,1]
```

## Constraints & clarifying questions

```
- n up to 3 * 10^4 -> O(n^2) is about 9 * 10^8 steps: too slow.
- The tree can be a long path -> no deep recursion.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "For EVERY node as the root" -> *rerooting DP*. Section 5.4 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** BFS from each node and add distances: O(n^2).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Moving the root from p to its child c: the count[c] nodes in c's subtree get 1 closer, the other n - count[c] get 1 farther. So ans[c] = ans[p] - count[c] + (n - count[c]).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** You need ans[root] first: a post-order pass gives count[] and down[] (distances into the subtree). Use BFS order reversed for post-order to avoid recursion.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

BFS from every node; sum its distance array.

### APPROACH 2 — Optimal (rerooting)   O(n) time, O(n) space

```
post-order: count[p] += count[c]; down[p] += down[c] + count[c]
ans[0] = down[0]
pre-order:  ans[c] = ans[p] - count[c] + (n - count[c])

Dry run (example 1, root 0):
  count = [6,1,4,1,1,1], down = [8,0,3,0,0,0] -> ans[0] = 8
  ans[1] = 8 - 1 + 5 = 12, ans[2] = 8 - 4 + 2 = 6, ans[3..5] = 6 - 1 + 5 = 10
```

### Edge cases

```
- n = 1 -> [0]
- path of 3 * 10^4 nodes -> iterative passes
```

### Common mistakes

- Using count[p] in the formula instead of count[c].
- Doing the second pass in post-order (children need the parent's FINAL answer first).

Full JavaScript solution with tests: [06_sum_of_distances_in_tree.js](../solutions/06_sum_of_distances_in_tree.js).

</details>

## Related follow-ups

- Count Number of Possible Root Nodes (LeetCode #2581)
- Difference Between Maximum and Minimum Price Sum (LeetCode #2538)
- Minimum Height Trees (problem 02)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
