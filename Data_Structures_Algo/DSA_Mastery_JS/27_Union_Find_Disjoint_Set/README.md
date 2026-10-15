# Union-Find (Disjoint Set Union)

Union-find keeps track of which items belong to the same group while groups only ever **merge**. It answers "are these two in the same group?" and "how many groups are there?" in almost constant time, even while new connections keep arriving. It is the go-to tool for dynamic connectivity, undirected cycle detection, grouping equal things (accounts, equations, characters), and Kruskal's minimum spanning tree. This topic has two parts: the essential structure, then the variants that show up in harder interviews (weighted relations, rollback, string keys).

**Prerequisites:** [Graphs](../23_Graphs/README.md), [Graph Traversal](../24_Graph_Traversal/README.md) (you should be able to count connected components with DFS/BFS first, so you can see what union-find improves).

## Sub-topics

| # | Sub-topic | What you learn | Problems |
|---|---|---|---|
| 01 | [Union-Find Basics](01_Union_Find_Basics/README.md) | parent array, `find` with path compression, `union` by size, component count, cycle detection, grid and string keys | 10 |
| 02 | [Advanced Union-Find](02_Advanced_Union_Find/README.md) | weighted union-find (ratios, differences, parity), rollback / undo, Map-based keys, choosing the representative on purpose | 4 |

## Study order

1. **01_Union_Find_Basics** first: read the concepts, run `union_find.js`, re-implement it from memory, then solve the 10 problems (Number of Connected Components and Redundant Connection first).
2. Take the basics [quiz](01_Union_Find_Basics/04_Interview_And_Assessment/QUIZ.md) and only move on once the mastery checklist is ticked.
3. **02_Advanced_Union_Find**: derive the weighted union formula on paper before reading the code, then solve Evaluate Division with both union-find and DFS.
4. Finish with the advanced [quiz](02_Advanced_Union_Find/04_Interview_And_Assessment/QUIZ.md) and [interview questions](02_Advanced_Union_Find/04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md).
5. Apply it: Kruskal's algorithm in [Minimum Spanning Trees](../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md) is built on union-find.

## Related topics

- [Topological Sorting](../26_Topological_Sorting/README.md): the tool for **directed** dependency graphs, where union-find does not apply.
- [Graph Algorithms](../25_Graph_Algorithms/01_Shortest_Paths/README.md): shortest paths and MST.

Run all tests for this topic from the curriculum root: `npm run test:topic 27_Union_Find_Disjoint_Set`.
