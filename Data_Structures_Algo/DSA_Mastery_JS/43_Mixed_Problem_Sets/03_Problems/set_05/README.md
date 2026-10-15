# Mixed Set 05 — Graphs with a twist

Graph problems where the graph algorithm is only half the answer.

| | |
|---|---|
| **Level** | Medium → Hard |
| **Suggested total time** | 150 minutes (sum of time boxes: 145 min, plus review) |
| **Previous set** | [Set 04](../set_04/README.md) |
| **Next** | [Set 06](../set_06/README.md) |

## Stages this set assumes

You should have finished these topics (sets are cumulative, so everything from earlier sets is fair game too):

- [Searching / Binary Search](../../../10_Searching/README.md)
- [Heaps](../../../19_Heaps_And_Priority_Queues/README.md)
- [Graph Traversal (BFS/DFS)](../../../24_Graph_Traversal/README.md)
- [Shortest Paths](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md)
- [Topological Sorting](../../../26_Topological_Sorting/README.md)
- [Union-Find](../../../27_Union_Find_Disjoint_Set/README.md)
- [Minimum Spanning Trees](../../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md)
- [Greedy](../../../28_Greedy_Algorithms/README.md)

## How to run this set

1. Do it in **one sitting** with a timer. Problems are in rough order of difficulty, but you may pick the order.
2. For each problem: read it, say the brute force out loud, then look for the second idea. **The topic is not written on the page on purpose.**
3. When a problem's time box ends, open Hint 1 (it names the patterns). Then give yourself 10 more minutes before the next hint.
4. Run your code against the examples. Only then open the solution file.
5. After the set, answer the reflection checklist and the 3 conceptual questions for this set in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).

Scoring guide: 5/5 solved inside the time boxes without hints = ready for the next set. 3–4 = redo the missed ones in 3 days. 0–2 = go back to the topics in the list above first.

## Problems

| # | Problem | Difficulty | Time box | Statement | Solution |
|---|---------|------------|----------|-----------|----------|
| 01 | [Hiking Robot](01_hiking_robot.md) | Medium | 25 min | [statement](01_hiking_robot.md) | [solution](solutions/01_hiking_robot.js) |
| 02 | [Connection Time Queries](02_connection_time_queries.md) | Hard | 35 min | [statement](02_connection_time_queries.md) | [solution](solutions/02_connection_time_queries.js) |
| 03 | [Pipeline Finish Time](03_pipeline_finish_time.md) | Medium | 25 min | [statement](03_pipeline_finish_time.md) | [solution](solutions/03_pipeline_finish_time.js) |
| 04 | [Coupon Routes](04_coupon_routes.md) | Hard | 35 min | [statement](04_coupon_routes.md) | [solution](solutions/04_coupon_routes.js) |
| 05 | [Mandatory Roads Network](05_mandatory_roads_mst.md) | Medium | 25 min | [statement](05_mandatory_roads_mst.md) | [solution](solutions/05_mandatory_roads_mst.js) |

Run all solutions of this set:

```
for f in solutions/*.js; do node "$f"; done
```
