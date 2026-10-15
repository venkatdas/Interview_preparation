# Degree Report

| | |
|---|---|
| **Topic** | Graphs (representation) |
| **Difficulty** | Easy |
| **Pattern** | in/out-degree counting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [02_degree_report.js](../solutions/02_degree_report.js) — open only after a real attempt |

## Problem

A directed graph has vertices `0..n-1` and edges `[u, v]` meaning `u -> v`. Return an object
`{ inDegree, outDegree, sources, sinks }`: `inDegree[v]` counts edges pointing into `v`, `outDegree[v]`
counts edges leaving `v`, `sources` lists vertices with in-degree 0 and `sinks` lists vertices with
out-degree 0 (both ascending). Every edge counts, including repeated edges and self loops.

## Examples

```
Input: n = 4, edges = [[0,1],[0,2],[1,2]]
Output: inDegree [0,1,2,0], outDegree [2,1,0,0], sources [0,3], sinks [2,3]
Explanation: vertex 3 has no edges at all, so it is both a source and a sink
```

## Constraints & clarifying questions

```
- Is the graph directed? (yes)
- Does a self loop [v, v] count? (yes: +1 to both degrees of v)
- Repeated edges? (each copy counts)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Degree counting: the first step of Kahn's topological sort and of many "who is special" questions.

</details>

<details><summary>Hint 2</summary>

**Start simple.** For each vertex, scan the whole edge list and count how often it is a start and how often it is an end.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Each edge tells you about exactly two counters. Can one pass over the edges fill both arrays?

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0                -> all four lists empty
- no edges             -> every vertex is a source and a sink
- a cycle              -> no sources at all
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

For every vertex scan all edges and count appearances as start and end. O(n · E) time.

### APPROACH 2 — Optimal

One pass over the edges: `outDegree[u]++` and `inDegree[v]++`. Then one pass over the vertices collects sources and sinks. O(n + E) time, O(n) space.

```
n = 4, [[0,1],[0,2],[1,2]]
[0,1] out[0]=1 in[1]=1
[0,2] out[0]=2 in[2]=1
[1,2] out[1]=1 in[2]=2
sources (in = 0): 0, 3      sinks (out = 0): 2, 3
```

Full JavaScript solution with tests: [02_degree_report.js](../solutions/02_degree_report.js). Run it with `node 02_degree_report.js` from the solutions folder.

</details>

## Common mistakes

- Swapping the meaning of in and out (an edge u -> v leaves u and enters v).
- Treating the graph as undirected and adding both directions.
- Forgetting that an isolated vertex is both a source and a sink.

## Related follow-ups

- [Edge List to Adjacency List](01_edge_list_to_adjacency_list.md)
- [Find the Hub Server](../02_Medium/05_find_the_hub_server.md)
- [Course Schedule II](../../../26_Topological_Sorting/03_Problems/02_Medium/02_course_schedule_ii.md) (26_Topological_Sorting)
- Find the Town Judge (LeetCode #997)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
