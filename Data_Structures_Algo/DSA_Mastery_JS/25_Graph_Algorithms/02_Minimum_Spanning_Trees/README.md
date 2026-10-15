# Minimum Spanning Trees

**Prerequisites:** [Union Find Disjoint Set](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md), [Heaps And Priority Queues](../../19_Heaps_And_Priority_Queues/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 25_Graph_Algorithms` (from the curriculum root).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `mst.js` |
| [03_Problems](03_Problems) | 5 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

**Self-check:** take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md). Run the tests with `node --test tests/*.test.js` from this folder.

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Minimum Spanning Tree Weight | Easy | Kruskal and Prim on an edge list | [statement](03_Problems/01_Easy/01_minimum_spanning_tree_weight.md) | [solution](03_Problems/solutions/01_minimum_spanning_tree_weight.js) |
| 02 | Min Cost to Connect All Points | Medium | complete graph of points, Prim / Kruskal | [statement](03_Problems/02_Medium/02_min_cost_to_connect_all_points.md) | [solution](03_Problems/solutions/02_min_cost_to_connect_all_points.js) |
| 03 | Connecting Cities With Minimum Cost | Medium | Kruskal, detect disconnected | [statement](03_Problems/02_Medium/03_connecting_cities_with_minimum_cost.md) | [solution](03_Problems/solutions/03_connecting_cities_with_minimum_cost.js) |
| 04 | Optimize Water Distribution in a Village | Hard | virtual node + Kruskal | [statement](03_Problems/03_Hard/04_optimize_water_distribution.md) | [solution](03_Problems/solutions/04_optimize_water_distribution.js) |
| 05 | Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree | Hard | Kruskal with forced include / exclude | [statement](03_Problems/03_Hard/05_critical_and_pseudo_critical_edges.md) | [solution](03_Problems/solutions/05_critical_and_pseudo_critical_edges.js) |

