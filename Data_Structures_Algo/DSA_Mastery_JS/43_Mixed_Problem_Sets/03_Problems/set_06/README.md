# Mixed Set 06 — Hard mixed

Final set. Every problem is interview-hard and needs a non-obvious pairing of two or more patterns.

| | |
|---|---|
| **Level** | Hard |
| **Suggested total time** | 160 minutes (sum of time boxes: 155 min, plus review) |
| **Previous set** | [Set 05](../set_05/README.md) |
| **Next** | the [mock interviews](../../../44_Mock_Interviews/README.md) |

## Stages this set assumes

You should have finished these topics (sets are cumulative, so everything from earlier sets is fair game too):

- [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)
- [Monotonic Stacks & Queues](../../../18_Monotonic_Stacks_And_Queues/README.md)
- [Searching / Binary Search](../../../10_Searching/README.md)
- [Greedy](../../../28_Greedy_Algorithms/README.md)
- [Tries](../../../22_Tries/README.md)
- [Shortest Paths](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md)
- [1-D DP](../../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md)
- [DP on strings](../../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md)
- [Advanced DP (bitmask)](../../../29_Dynamic_Programming/06_Advanced_DP/README.md)
- [Bit Manipulation](../../../14_Bit_Manipulation/README.md)

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
| 01 | [Compatible Assignment](01_compatible_assignment.md) | Hard | 30 min | [statement](01_compatible_assignment.md) | [solution](solutions/01_compatible_assignment.js) |
| 02 | [Shortest Burst](02_shortest_burst.md) | Hard | 30 min | [statement](02_shortest_burst.md) | [solution](solutions/02_shortest_burst.js) |
| 03 | [Segmentation Ways](03_segmentation_ways.md) | Hard | 30 min | [statement](03_segmentation_ways.md) | [solution](solutions/03_segmentation_ways.js) |
| 04 | [Router Spacing](04_router_spacing.md) | Medium | 25 min | [statement](04_router_spacing.md) | [solution](solutions/04_router_spacing.js) |
| 05 | [Courier All Stops](05_courier_all_stops.md) | Hard | 40 min | [statement](05_courier_all_stops.md) | [solution](solutions/05_courier_all_stops.js) |

Run all solutions of this set:

```
for f in solutions/*.js; do node "$f"; done
```
