# Minimum Number of Vertices to Reach All Nodes

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Medium |
| **Pattern** | in-degree 0 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1557 — https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/ |
| **Solution file** | [03_minimum_vertices_to_reach_all_nodes.js](../solutions/03_minimum_vertices_to_reach_all_nodes.js) — open only after a real attempt |

## Problem

A directed ACYCLIC graph with n nodes and an edge list. Return the smallest set of
nodes from which every node in the graph is reachable. The answer is unique.

## Examples

```
Input: n = 6, edges = [[0,1],[0,2],[2,5],[3,4],[4,2]]   Output: [0,3]
Input: n = 5, edges = [[0,1],[2,1],[3,1],[1,4],[2,4]]   Output: [0,2,3]
```

## Constraints & clarifying questions

```
- Guaranteed acyclic? (yes - this matters: in a cycle no node has in-degree 0, and the
  simple rule would fail)
- Output order? (any; we return ascending)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *in-degree 0* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (greedy with reachability)   O(n * (n + E)). For each node compute the set it reaches (DFS).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (in-degree 0)   O(n + E) time, O(n) space. Mark every node that appears as a destination; return the unmarked ones.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no edges -> every node
- a single chain -> just the head
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (greedy with reachability)   O(n * (n + E))

```
For each node compute the set it reaches (DFS). Then a node is needed iff no OTHER
node reaches it. Correct, but n DFS runs.
```

### APPROACH 2 — Optimal (in-degree 0)   O(n + E) time, O(n) space

```
Mark every node that appears as a destination; return the unmarked ones.

Dry run n=6, edges [[0,1],[0,2],[2,5],[3,4],[4,2]]:
  destinations {1,2,5,4} -> unmarked {0,3} -> [0,3]
```

### KEY INSIGHT: a node with an incoming edge is reachable from its predecessor, so it

```
never needs to be in the set. A node with NO incoming edge can only be reached by
starting there. In a DAG the answer is exactly the nodes with in-degree 0.
```

### Edge cases

```
- no edges -> every node
- a single chain -> just the head
```

Full JavaScript solution with tests: [03_minimum_vertices_to_reach_all_nodes.js](../solutions/03_minimum_vertices_to_reach_all_nodes.js). Run it with `node 03_minimum_vertices_to_reach_all_nodes.js` from the solutions folder.

</details>

## Common mistakes

- Running a search from every node (O(V * (V + E))) when the answer is simply the nodes with in-degree 0.
- Counting out-degree instead of in-degree.
- Assuming the answer works for graphs with cycles; the in-degree-0 shortcut relies on the input being a DAG (otherwise think SCC condensation).

## Related follow-ups

- [Course Schedule](../../../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md)
- [Find Eventual Safe States](../../../../26_Topological_Sorting/03_Problems/02_Medium/03_find_eventual_safe_states.md)
- [Keys and Rooms](../../../../24_Graph_Traversal/03_Problems/02_Medium/04_keys_and_rooms.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
