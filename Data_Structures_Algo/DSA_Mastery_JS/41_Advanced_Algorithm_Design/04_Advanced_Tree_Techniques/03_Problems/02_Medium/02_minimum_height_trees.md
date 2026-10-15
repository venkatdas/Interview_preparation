# Minimum Height Trees

| | |
|---|---|
| **Topic** | Advanced Tree Techniques |
| **Difficulty** | Medium |
| **Pattern** | peel leaves / tree centers |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Topological Sorting](../../../../26_Topological_Sorting) |
| **Source** | LeetCode #310 — https://leetcode.com/problems/minimum-height-trees/ (statement paraphrased, not copied) |
| **Solution file** | [02_minimum_height_trees.js](../solutions/02_minimum_height_trees.js) — open only after a real attempt |

## Problem

A tree has n nodes 0..n-1. Choosing any node as the root gives the tree a height (edges on the
longest root-to-leaf path). Return all nodes that give the minimum possible height. Any order
is fine (the solution returns them sorted).

## Examples

```
Input: n = 4, edges = [[1,0],[1,2],[1,3]]               Output: [1]
Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]   Output: [3,4]
Input: n = 1, edges = []                                Output: [0]
```

## Constraints & clarifying questions

```
- n up to 2 * 10^4; the input is always a tree.
- Output order does not matter.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** The best root is the *center* of the tree. Re-read section 5.2 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** BFS from every node gives its height; keep the minimum ones. O(n^2).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Leaves are never the answer (unless n <= 2). Remove all leaves at once, repeat. Like Kahn's topological sort on degrees. Stop when at most 2 nodes remain.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n = 1 has no degree-1 node: return [0] immediately. n = 2 -> both nodes.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

BFS from every node; height = largest distance; return the nodes with minimum height.

### APPROACH 2 — Optimal (peel leaves)   O(n) time, O(n) space

```
The middle 1 or 2 nodes of any diameter minimise the height. Peeling leaves layer by layer
reaches exactly those middles.

Dry run on n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]:
  degree = [1,1,1,4,2,1]; leaves = [0,1,2,5]; remaining = 6
  peel: remaining = 2; degree[3] -> 1, degree[4] -> 1; next leaves = [3,4]
  remaining <= 2 -> answer [3,4]
```

### Edge cases

```
- n = 1 -> [0]
- n = 2 -> [0,1]
- path with odd node count -> 1 center, even -> 2 centers
```

### Common mistakes

- Stopping when ONE node remains (there can be two answers).
- Decrementing degree but forgetting to push the new leaf.
- Forgetting the n = 1 special case.

Full JavaScript solution with tests: [02_minimum_height_trees.js](../solutions/02_minimum_height_trees.js).

</details>

## Related follow-ups

- Collect Coins in a Tree (LeetCode #2603)
- Tree Diameter (problem 01)
- Sum of Distances in Tree (problem 06): the same "best root" question, but with a sum

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
