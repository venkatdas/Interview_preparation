# Graph Valid Tree

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS cycle check + connectivity |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #261 — https://leetcode.com/problems/graph-valid-tree/ |
| **Solution file** | [08_graph_valid_tree.js](../solutions/08_graph_valid_tree.js) — open only after a real attempt |

## Problem

n nodes 0..n-1 and an undirected edge list. Return true if the edges form a valid
tree: connected AND no cycles.

## Examples

```
Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]         Output: true
Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]   Output: false  (1-2-3 is a cycle)
Input: n = 2, edges = []                                 Output: false  (not connected)
```

## Constraints & clarifying questions

```
- Can edges contain duplicates or self loops? (treat as cycle -> false)
- n = 1 with no edges? (true, a single node is a tree)

KEY FACT: a tree on n nodes has EXACTLY n - 1 edges. So:
  edges.length !== n - 1  -> not a tree, instantly.
  edges.length === n - 1  -> it is a tree IF connected (then it cannot have a cycle,
                             because a cycle would "waste" an edge and leave something
                             disconnected).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS cycle check + connectivity* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS with parent tracking + connectivity)   O(V + E). DFS from 0, passing the parent.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (edge count + one connectivity BFS)   O(V + E) time, O(V) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1, edges [] -> true
- correct edge count but two components + a cycle (e.g. n=4, [[0,1],[1,0],[2,3]])
  -> BFS from 0 visits only {0,1} -> false. The count trick + connectivity is enough.
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS with parent tracking + connectivity)   O(V + E)

```
DFS from 0, passing the parent. If we meet a visited node that is not our parent, there
is a cycle. After DFS, every node must be visited. Works without the edge-count trick,
and is the general "detect a cycle in an undirected graph" technique - worth knowing.
```

### APPROACH 2 — Optimal (edge count + one connectivity BFS)   O(V + E) time, O(V) space

```
1. if edges.length !== n - 1 return false
  2. BFS from 0, count visited; return visited === n

Dry run n=5, edges [[0,1],[0,2],[0,3],[1,4]]: 4 edges = n-1 ok.
  BFS from 0 -> 1,2,3 -> 4. visited 5 === n -> true.
Dry run n=5, edges [[0,1],[1,2],[2,3],[1,3],[1,4]]: 5 edges !== 4 -> false immediately.
```

### Edge cases

```
- n = 1, edges [] -> true
- correct edge count but two components + a cycle (e.g. n=4, [[0,1],[1,0],[2,3]])
  -> BFS from 0 visits only {0,1} -> false. The count trick + connectivity is enough.
```

Full JavaScript solution with tests: [08_graph_valid_tree.js](../solutions/08_graph_valid_tree.js). Run it with `node 08_graph_valid_tree.js` from the solutions folder.

</details>

## Common mistakes

- Only checking for cycles and forgetting connectivity (a forest is not a tree).
- Treating the parent edge as a cycle in undirected DFS.
- Skipping the quick check `edges.length === n - 1`.

## Related follow-ups

- [Number of Connected Components in an Undirected Graph](07_number_of_connected_components.md)
- [Redundant Connection](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/03_redundant_connection.md) (27_Union_Find_Disjoint_Set/01_Union_Find_Basics)
- [Minimum Height Trees](../../../26_Topological_Sorting/03_Problems/02_Medium/04_minimum_height_trees.md) (26_Topological_Sorting)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
