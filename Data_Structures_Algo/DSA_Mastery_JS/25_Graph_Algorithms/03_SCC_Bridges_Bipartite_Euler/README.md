# Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler)

**Prerequisites:** [Graph Traversal](../../24_Graph_Traversal/README.md), [Topological Sorting](../../26_Topological_Sorting/README.md)

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
| [02_Implementations](02_Implementations) | `advanced_graph_algorithms.js` |
| [03_Problems](03_Problems) | 10 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

**Self-check:** take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md). Run the tests with `node --test tests/*.test.js` from this folder.

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Is Graph Bipartite? | Medium | BFS 2-colouring | [statement](03_Problems/02_Medium/01_is_graph_bipartite.md) | [solution](03_Problems/solutions/01_is_graph_bipartite.js) |
| 02 | Possible Bipartition | Medium | bipartite / UF enemy trick | [statement](03_Problems/02_Medium/02_possible_bipartition.md) | [solution](03_Problems/solutions/02_possible_bipartition.js) |
| 03 | Minimum Number of Vertices to Reach All Nodes | Medium | in-degree 0 | [statement](03_Problems/02_Medium/03_minimum_vertices_to_reach_all_nodes.md) | [solution](03_Problems/solutions/03_minimum_vertices_to_reach_all_nodes.js) |
| 04 | Evaluate Division | Medium | weighted DFS / weighted UF | [statement](03_Problems/02_Medium/04_evaluate_division.md) | [solution](03_Problems/solutions/04_evaluate_division.js) |
| 05 | Bus Routes | Hard | BFS on routes | [statement](03_Problems/03_Hard/05_bus_routes.md) | [solution](03_Problems/solutions/05_bus_routes.js) |
| 06 | Cheapest Flights Within K Stops | Medium | Dijkstra on (city, stops) | [statement](03_Problems/02_Medium/06_cheapest_flights_dijkstra_state.md) | [solution](03_Problems/solutions/06_cheapest_flights_dijkstra_state.js) |
| 07 | Critical Connections in a Network | Hard | bridges (Tarjan) | [statement](03_Problems/03_Hard/07_critical_connections.md) | [solution](03_Problems/solutions/07_critical_connections.js) |
| 08 | Reconstruct Itinerary | Hard | Eulerian path (Hierholzer) | [statement](03_Problems/03_Hard/08_reconstruct_itinerary.md) | [solution](03_Problems/solutions/08_reconstruct_itinerary.js) |
| 09 | Word Ladder II | Hard | BFS layers + backtracking | [statement](03_Problems/03_Hard/09_word_ladder_ii.md) | [solution](03_Problems/solutions/09_word_ladder_ii.js) |
| 10 | Shortest Path Visiting All Nodes | Hard | BFS on (node, bitmask) | [statement](03_Problems/03_Hard/10_shortest_path_visiting_all_nodes.md) | [solution](03_Problems/solutions/10_shortest_path_visiting_all_nodes.js) |

