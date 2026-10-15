# Graph Representation

This topic is about **what a graph is and how to store one** (edge list, adjacency list, adjacency matrix, implicit graphs). **Traversal (BFS / DFS)** lives in [24_Graph_Traversal](../24_Graph_Traversal/README.md), and the algorithms in topics 25–27: [25 Shortest Paths](../25_Graph_Algorithms/01_Shortest_Paths/README.md), [25 Minimum Spanning Trees](../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md), [25 SCC / Bridges / Bipartite / Euler](../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md), [26 Topological Sorting](../26_Topological_Sorting/README.md) and [27 Union-Find](../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md).

**Prerequisites:** [Hashing](../05_Hashing/README.md), [Trees/01 Binary Trees](../20_Trees/01_Binary_Trees/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the six representation exercises in order: Easy, then Medium. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 23_Graphs` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `graph.js` |
| [03_Problems](03_Problems) | 6 original exercises on building and representing graphs, with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Edge List to Adjacency List | Easy | build adjacency list | [statement](03_Problems/01_Easy/01_edge_list_to_adjacency_list.md) | [solution](03_Problems/solutions/01_edge_list_to_adjacency_list.js) |
| 02 | Degree Report | Easy | in/out-degree counting | [statement](03_Problems/01_Easy/02_degree_report.md) | [solution](03_Problems/solutions/02_degree_report.js) |
| 03 | Matrix and List Conversion | Easy | representation conversion | [statement](03_Problems/01_Easy/03_matrix_list_conversion.md) | [solution](03_Problems/solutions/03_matrix_list_conversion.js) |
| 04 | Reverse a Directed Graph | Medium | transpose graph | [statement](03_Problems/02_Medium/04_reverse_directed_graph.md) | [solution](03_Problems/solutions/04_reverse_directed_graph.js) |
| 05 | Find the Hub Server | Medium | universal sink in a matrix | [statement](03_Problems/02_Medium/05_find_the_hub_server.md) | [solution](03_Problems/solutions/05_find_the_hub_server.js) |
| 06 | Grid to Graph | Medium | implicit graph to explicit | [statement](03_Problems/02_Medium/06_grid_to_graph.md) | [solution](03_Problems/solutions/06_grid_to_graph.js) |
