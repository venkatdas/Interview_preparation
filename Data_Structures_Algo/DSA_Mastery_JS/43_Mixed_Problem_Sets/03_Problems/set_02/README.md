# Mixed Set 02 — Searching, sorting and search spaces

Sorting and searching show up as helpers inside bigger ideas here. Expect at least one search space that is not an array.

| | |
|---|---|
| **Level** | Medium |
| **Suggested total time** | 120 minutes (sum of time boxes: 120 min, plus review) |
| **Previous set** | [Set 01](../set_01/README.md) |
| **Next** | [Set 03](../set_03/README.md) |

## Stages this set assumes

You should have finished these topics (sets are cumulative, so everything from earlier sets is fair game too):

- [Arrays](../../../03_Arrays/README.md)
- [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)
- [Searching / Binary Search](../../../10_Searching/README.md)
- [Sorting](../../../11_Sorting/README.md)
- [Backtracking](../../../13_Backtracking/README.md)
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
| 01 | [Snack Budget](01_snack_budget.md) | Easy | 20 min | [statement](01_snack_budget.md) | [solution](solutions/01_snack_budget.js) |
| 02 | [Capped Reading Split](02_capped_reading_split.md) | Medium | 25 min | [statement](02_capped_reading_split.md) | [solution](solutions/02_capped_reading_split.js) |
| 03 | [Rotated Range Count](03_rotated_range_count.md) | Medium | 25 min | [statement](03_rotated_range_count.md) | [solution](solutions/03_rotated_range_count.js) |
| 04 | [K Items Closest to Budget](04_k_items_closest_budget.md) | Medium | 25 min | [statement](04_k_items_closest_budget.md) | [solution](solutions/04_k_items_closest_budget.js) |
| 05 | [Active Sessions](05_active_sessions.md) | Medium | 25 min | [statement](05_active_sessions.md) | [solution](solutions/05_active_sessions.js) |

Run all solutions of this set:

```
for f in solutions/*.js; do node "$f"; done
```
