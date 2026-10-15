# Graph Valid Tree

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | cycle + count === 1 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #261 — https://leetcode.com/problems/graph-valid-tree/ |
| **Solution file** | [02_graph_valid_tree.js](../solutions/02_graph_valid_tree.js) — open only after a real attempt |

## Problem

n nodes and an undirected edge list. Return true if they form a tree: connected and
acyclic. (Also in 24_Graph_Traversal/problems/08 - here with union-find.)

## Examples

```
Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]         Output: true
Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]   Output: false (cycle)
```

## Constraints & clarifying questions

```
- n = 1, no edges -> true
- duplicate edge = cycle -> false
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *cycle + count === 1* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS with parent + connectivity check)   O(V + E). See the BFS/DFS folder.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find)   O(E * alpha(V)) time, O(V) space. A tree = no cycle + one component.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- two separate trees (no cycle, count 2) -> false
- self loop [[0,0]] -> union returns false -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS with parent + connectivity check)   O(V + E)

```
See the BFS/DFS folder. Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (Union-Find)   O(E * alpha(V)) time, O(V) space

```
A tree = no cycle + one component.
  1. For each edge: if union(u, v) returns false -> the edge closes a cycle -> false.
  2. After all edges: uf.count() === 1 -> connected -> true.
(Shortcut: if edges.length !== n - 1 return false immediately; then connectivity alone
 is enough. We keep the explicit cycle check because it is the reusable idea.)

Dry run n=5, edges [[0,1],[1,2],[2,3],[1,3],[1,4]]:
  union(0,1) ok, union(1,2) ok, union(2,3) ok, union(1,3): find(1)=0, find(3)=0 -> false
  -> cycle -> return false
```

### Edge cases

```
- two separate trees (no cycle, count 2) -> false
- self loop [[0,0]] -> union returns false -> false
```

Full JavaScript solution with tests: [02_graph_valid_tree.js](../solutions/02_graph_valid_tree.js). Run it with `node 02_graph_valid_tree.js` from the solutions folder.

</details>

## Common mistakes

- Checking only "no cycle"; a forest has no cycle but is not one tree. You also need exactly one component.
- Missing the quick check `edges.length === n - 1`, which rules out most invalid inputs immediately.
- Forgetting n = 1 with no edges is a valid tree.

## Related follow-ups

- [Graph Valid Tree (DFS version)](../../../../24_Graph_Traversal/03_Problems/02_Medium/08_graph_valid_tree.md)
- [Redundant Connection](03_redundant_connection.md)
- [Minimum Height Trees](../../../../26_Topological_Sorting/03_Problems/02_Medium/04_minimum_height_trees.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
