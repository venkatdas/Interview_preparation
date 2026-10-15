# Network Flow (Max Flow, Min Cut, Bipartite Matching) — Advanced

> **Level: Advanced.** **Interview frequency: rare.** Coding a full max-flow is almost never
> asked at product companies. Bipartite matching (Kuhn's DFS) and *recognising* a min-cut or
> matching model come up occasionally at top-tier companies and quant firms, usually as a
> hard follow-up. Study this after you are comfortable with BFS/DFS and the core topics;
> it pays off most for competitive programming and for "how would you model this?" rounds.

A flow network is a directed graph whose edges are pipes with capacities. Max flow asks how
much can travel from a source to a sink; the max-flow min-cut theorem says that equals the
cheapest way to separate them. With these two ideas you can solve assignment, matching,
disjoint paths, cheapest disconnection and project-selection problems that greedy gets
wrong and brute force can't finish. This sub-topic covers residual graphs, augmenting
paths, Ford–Fulkerson, Edmonds–Karp, Dinic, min cut, bipartite matching (via flow, Kuhn,
Hopcroft–Karp), König's theorem and a brief look at min-cost flow.

**Prerequisites:** [Graphs](../../23_Graphs/README.md), [Graph Traversal](../../24_Graph_Traversal/README.md), [Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md), [SCC, Bridges, Bipartite](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md), [Classic Techniques](../01_Classic_Techniques/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, residual graph, min cut proof sketch, matching, complexity, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement Kuhn and Edmonds–Karp from memory.
3. Solve the problems in order: Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/network_flow.test.js` (from this folder).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | flow networks, residual graph, augmenting paths, Ford–Fulkerson, Edmonds–Karp, Dinic, max-flow min-cut, matching, König, min-cost flow, applications |
| [02_Implementations](02_Implementations) | `max_flow.js` (EdmondsKarp, Dinic, minCut, MinCostMaxFlow), `bipartite_matching.js` (Kuhn, Hopcroft–Karp, matching via flow) |
| [03_Problems](03_Problems) | 6 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suite for the implementations and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Maximum Bipartite Matching — Hiring Applicants | Medium | Kuhn augmenting paths | [statement](03_Problems/02_Medium/01_maximum_bipartite_matching.md) | [solution](03_Problems/solutions/01_maximum_bipartite_matching.js) |
| 02 | Count Edge-Disjoint Paths | Medium | unit-capacity flow (Menger) | [statement](03_Problems/02_Medium/02_edge_disjoint_paths.md) | [solution](03_Problems/solutions/02_edge_disjoint_paths.js) |
| 03 | Cheapest Way to Disconnect Two Servers | Medium | max-flow min-cut | [statement](03_Problems/02_Medium/03_minimum_cut_network.md) | [solution](03_Problems/solutions/03_minimum_cut_network.js) |
| 04 | Assign Tasks to Workers with Capacities | Medium | flow with capacities | [statement](03_Problems/02_Medium/04_assign_tasks_with_capacity.md) | [solution](03_Problems/solutions/04_assign_tasks_with_capacity.js) |
| 05 | Project Selection with Prerequisites | Hard | min cut / maximum closure | [statement](03_Problems/03_Hard/05_project_selection.md) | [solution](03_Problems/solutions/05_project_selection.js) |
| 06 | Maximum Students Taking Exam | Hard | König: seats - matching | [statement](03_Problems/03_Hard/06_maximum_students_taking_exam.md) | [solution](03_Problems/solutions/06_maximum_students_taking_exam.js) |
