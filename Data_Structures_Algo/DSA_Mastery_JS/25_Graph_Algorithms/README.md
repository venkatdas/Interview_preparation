# Graph Algorithms

Plain traversal (BFS/DFS) answers "can I get there?". This topic answers the harder
questions interviewers love: "what is the **cheapest** way there?" (shortest paths),
"what is the cheapest way to **connect everything**?" (minimum spanning trees), and
"what is the hidden **structure** of this graph?" (strongly connected components,
bridges, bipartite checks, Eulerian paths, state-space graphs). Each sub-topic is a
small set of algorithms built on top of BFS, DFS, a heap or union-find. The real skill
is recognising which one the problem is asking for.

**Prerequisites:** [Graphs](../23_Graphs/README.md), [Graph Traversal](../24_Graph_Traversal/README.md), [Heaps And Priority Queues](../19_Heaps_And_Priority_Queues/README.md), [Union-Find basics](../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) (needed for Kruskal; you can study its basics first or alongside).

## Sub-topics

| # | Sub-topic | What you learn | Problems | Self-check |
|---|---|---|---|---|
| 01 | [Shortest Paths](01_Shortest_Paths/README.md) | BFS, Dijkstra (with a hand-written MinHeap), Bellman-Ford, Floyd-Warshall, 0-1 BFS, state-space Dijkstra | 10 | [quiz](01_Shortest_Paths/04_Interview_And_Assessment/QUIZ.md) · [interview](01_Shortest_Paths/04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) |
| 02 | [Minimum Spanning Trees](02_Minimum_Spanning_Trees/README.md) | the cut property, Kruskal (sort + union-find), Prim (heap or array), virtual-node and force-edge tricks | 5 | [quiz](02_Minimum_Spanning_Trees/04_Interview_And_Assessment/QUIZ.md) · [interview](02_Minimum_Spanning_Trees/04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) |
| 03 | [SCC, Bridges, Bipartite, Euler](03_SCC_Bridges_Bipartite_Euler/README.md) | 2-colouring, Tarjan and Kosaraju SCC, bridges and articulation points (low-link), Hierholzer, bitmask / state BFS | 10 | [quiz](03_SCC_Bridges_Bipartite_Euler/04_Interview_And_Assessment/QUIZ.md) · [interview](03_SCC_Bridges_Bipartite_Euler/04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) |

## Study order

1. **Shortest Paths first.** Dijkstra's MinHeap is reused by Prim, and the "relax an
   edge" idea appears everywhere else.
2. **Minimum Spanning Trees next.** Learn the [union-find basics](../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md)
   just before or alongside this. Compare Prim with Dijkstra line by line.
3. **SCC, Bridges, Bipartite, Euler last.** These are the hardest-round techniques.
   Doing [Topological Sorting](../26_Topological_Sorting/README.md) first makes the SCC
   condensation idea click.
4. In every sub-topic: read `01_Concepts/CONCEPTS.md`, run the file in `02_Implementations`,
   solve the problems Easy -> Hard, then do the quiz and interview questions.

## Quick algorithm picker

| The problem says... | Reach for | Sub-topic |
|---|---|---|
| fewest steps, every move costs the same | BFS | [24_Graph_Traversal](../24_Graph_Traversal/README.md) |
| cheapest route, weights >= 0 | Dijkstra | 01 |
| negative weights / detect a negative cycle / at most k edges | Bellman-Ford | 01 |
| distances between all pairs, n <= ~400 | Floyd-Warshall | 01 |
| connect everything at minimum total cost | Kruskal / Prim | 02 |
| split into two conflict-free groups | bipartite check | 03 |
| groups that can all reach each other (directed) | SCC | 03 |
| "which single link / server failure disconnects the network" | bridges / articulation points | 03 |
| use every edge exactly once | Hierholzer | 03 |

## Running the tests

From the curriculum root: `npm run test:topic 25_Graph_Algorithms` (runs every
implementation and solution file, then all three `tests/*.test.js` suites).
