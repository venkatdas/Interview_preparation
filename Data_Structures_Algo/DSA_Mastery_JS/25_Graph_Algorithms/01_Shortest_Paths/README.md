# Shortest Paths

**Prerequisites:** [Graph Traversal](../../24_Graph_Traversal/README.md), [Heaps And Priority Queues](../../19_Heaps_And_Priority_Queues/README.md)

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
| [02_Implementations](02_Implementations) | `shortest_paths.js` |
| [03_Problems](03_Problems) | 10 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

**Self-check:** take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md). Run the tests with `node --test tests/*.test.js` from this folder.

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Network Delay Time | Medium | Dijkstra, max of dist | [statement](03_Problems/02_Medium/01_network_delay_time.md) | [solution](03_Problems/solutions/01_network_delay_time.js) |
| 02 | Cheapest Flights Within K Stops | Medium | Bellman-Ford k rounds | [statement](03_Problems/02_Medium/02_cheapest_flights_within_k_stops.md) | [solution](03_Problems/solutions/02_cheapest_flights_within_k_stops.js) |
| 03 | Path With Minimum Effort | Medium | Dijkstra min-max on grid | [statement](03_Problems/02_Medium/03_path_with_minimum_effort.md) | [solution](03_Problems/solutions/03_path_with_minimum_effort.js) |
| 04 | Path With Maximum Probability | Medium | Dijkstra with max-heap / product | [statement](03_Problems/02_Medium/04_path_with_maximum_probability.md) | [solution](03_Problems/solutions/04_path_with_maximum_probability.js) |
| 05 | Swim in Rising Water | Hard | Dijkstra min-max on grid | [statement](03_Problems/03_Hard/05_swim_in_rising_water.md) | [solution](03_Problems/solutions/05_swim_in_rising_water.js) |
| 06 | Number of Ways to Arrive at Destination | Medium | Dijkstra + path counting | [statement](03_Problems/02_Medium/06_number_of_ways_to_arrive_at_destination.md) | [solution](03_Problems/solutions/06_number_of_ways_to_arrive_at_destination.js) |
| 07 | Find the City With the Smallest Number of Neighbors at a Threshold Distance | Medium | Floyd-Warshall | [statement](03_Problems/02_Medium/07_find_the_city.md) | [solution](03_Problems/solutions/07_find_the_city.js) |
| 08 | Minimum Cost to Make at Least One Valid Path in a Grid | Hard | 0-1 BFS | [statement](03_Problems/03_Hard/08_minimum_cost_valid_path.md) | [solution](03_Problems/solutions/08_minimum_cost_valid_path.js) |
| 09 | Shortest Path in a Grid with Obstacles Elimination | Hard | BFS on (r, c, k) state | [statement](03_Problems/03_Hard/09_shortest_path_with_obstacles_elimination.md) | [solution](03_Problems/solutions/09_shortest_path_with_obstacles_elimination.js) |
| 10 | Reachable Nodes in Subdivided Graph | Hard | Dijkstra + edge accounting | [statement](03_Problems/03_Hard/10_reachable_nodes_in_subdivided_graph.md) | [solution](03_Problems/solutions/10_reachable_nodes_in_subdivided_graph.js) |

