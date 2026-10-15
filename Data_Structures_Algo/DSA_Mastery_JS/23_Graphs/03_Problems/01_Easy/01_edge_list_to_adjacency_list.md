# Edge List to Adjacency List

| | |
|---|---|
| **Topic** | Graphs (representation) |
| **Difficulty** | Easy |
| **Pattern** | build adjacency list |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [01_edge_list_to_adjacency_list.js](../solutions/01_edge_list_to_adjacency_list.js) — open only after a real attempt |

## Problem

You get `n` (vertices are `0..n-1`), a list of edges `[u, v]` and a flag `directed`.
Return the adjacency list: `adj[u]` holds the neighbours of `u`, sorted ascending.
For an undirected graph every edge appears in both lists. A repeated edge is listed once,
and a self loop `[u, u]` appears once in `adj[u]`.

## Examples

```
Input: n = 4, edges = [[0,1],[0,2],[2,1]], directed = false
Output: [[1,2],[0,2],[0,1],[]]      Explanation: vertex 3 has no edges, so its list is empty

Input: n = 3, edges = [[0,1],[1,2]], directed = true
Output: [[1],[2],[]]
```

## Constraints & clarifying questions

```
- Are vertices 0-based and always in range? (yes)
- Can the same edge appear twice? (yes -> keep it once)
- Must each list be sorted? (yes, so the output is deterministic)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is the "build the graph" step you write at the start of almost every graph problem.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Fill an n x n true/false table, then read each row from left to right.

</details>

<details><summary>Hint 3</summary>

**The key idea.** You only need one container per vertex. Which built-in container ignores duplicates for you?

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0               -> []
- no edges            -> n empty lists
- self loop [u, u]    -> u appears once in its own list
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Fill an n x n boolean matrix, then scan each row and collect the columns that are true. O(n² + E) time and O(n²) space, even for a sparse graph.

### APPROACH 2 — Optimal

Keep one Set per vertex. For each edge add v to u's set (and u to v's set when undirected); duplicates disappear automatically. Finally turn each Set into a sorted array. O(n + E log E) time, O(n + E) space.

```
n = 4, [[0,1],[0,2],[2,1]], undirected
[0,1] -> s0 {1}     s1 {0}
[0,2] -> s0 {1,2}   s2 {0}
[2,1] -> s2 {0,1}   s1 {0,2}
sorted -> [[1,2],[0,2],[0,1],[]]
```

Full JavaScript solution with tests: [01_edge_list_to_adjacency_list.js](../solutions/01_edge_list_to_adjacency_list.js). Run it with `node 01_edge_list_to_adjacency_list.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the reverse edge for undirected graphs.
- Using `new Array(n).fill([])`, which shares ONE array between all vertices.
- Dropping isolated vertices instead of giving them an empty list.

## Related follow-ups

- [Degree Report](02_degree_report.md)
- [Matrix and List Conversion](03_matrix_list_conversion.md)
- [Find if Path Exists in Graph](../../../24_Graph_Traversal/03_Problems/01_Easy/03_find_if_path_exists.md) (24_Graph_Traversal)
- [Course Schedule](../../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) (26_Topological_Sorting)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
