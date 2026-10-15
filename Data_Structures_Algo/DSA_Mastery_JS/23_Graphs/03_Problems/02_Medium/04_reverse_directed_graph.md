# Reverse a Directed Graph

| | |
|---|---|
| **Topic** | Graphs (representation) |
| **Difficulty** | Medium |
| **Pattern** | transpose graph |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [04_reverse_directed_graph.js](../solutions/04_reverse_directed_graph.js) — open only after a real attempt |

## Problem

A directed graph is given as an adjacency list `adj` (vertices `0..n-1`; `adj[u]` lists every `v` with an
edge `u -> v`). Return a NEW adjacency list for the reversed graph, where every edge `u -> v` becomes
`v -> u`. Lists in the answer must be sorted ascending; a repeated edge stays repeated. Do not change the input.

## Examples

```
Input:  [[1,2],[2],[]]
Output: [[],[0],[0,1]]

Input:  [[1],[0]]
Output: [[1],[0]]      Explanation: a 2-cycle is its own reverse
```

## Constraints & clarifying questions

```
- Return a new graph or modify the input? (new; input unchanged)
- Self loops? (u -> u stays u -> u)
- Why would I need this? ("who can reach t?" = "whom does t reach in the reversed graph?")
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Graph transpose. It shows up in Kosaraju's SCC algorithm and in "search backwards from the goal" tricks.

</details>

<details><summary>Hint 2</summary>

**Start simple.** For each vertex v, look through every list and note which u point at v.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Every edge is read exactly once in the input. Can each read write directly into the right place of the answer?

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty graph               -> []
- vertex with no edges      -> empty list in the answer
- reverse twice             -> the original graph again
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

For each vertex v scan every adjacency list and collect each u whose list contains v. O(n · (n + E)) time.

### APPROACH 2 — Optimal

Create n empty lists; for each u in increasing order and each v in `adj[u]`, push u onto `rev[v]`. Because u increases, every `rev[v]` comes out sorted. O(n + E) time and space.

```
[[1,2],[2],[]]
u = 0: 0->1 => rev[1] = [0];   0->2 => rev[2] = [0]
u = 1: 1->2 => rev[2] = [0,1]
result: [[],[0],[0,1]]
```

Full JavaScript solution with tests: [04_reverse_directed_graph.js](../solutions/04_reverse_directed_graph.js). Run it with `node 04_reverse_directed_graph.js` from the solutions folder.

</details>

## Common mistakes

- Mutating the input lists while reading them.
- Pushing v into `rev[u]` (that just copies the graph).
- Sharing one empty array between all vertices with `fill([])`.

## Related follow-ups

- [Matrix and List Conversion](../01_Easy/03_matrix_list_conversion.md)
- [Degree Report](../01_Easy/02_degree_report.md)
- Find Eventual Safe States (LeetCode #802)
- [SCC / Bridges / Bipartite / Euler](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) (Kosaraju uses the transpose)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
