# Mixed Set 03 — Stacks, queues, deques and heaps

Each problem needs one linear data structure (stack, queue, deque, heap, list) working together with a second idea.

| | |
|---|---|
| **Level** | Medium → Hard |
| **Suggested total time** | 120 minutes (sum of time boxes: 120 min, plus review) |
| **Previous set** | [Set 02](../set_02/README.md) |
| **Next** | [Set 04](../set_04/README.md) |

## Stages this set assumes

You should have finished these topics (sets are cumulative, so everything from earlier sets is fair game too):

- [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)
- [Hashing](../../../05_Hashing/README.md)
- [Linked Lists](../../../15_Linked_Lists/README.md)
- [Stacks](../../../16_Stacks/README.md)
- [Queues & Deques](../../../17_Queues_And_Deques/README.md)
- [Monotonic Stacks & Queues](../../../18_Monotonic_Stacks_And_Queues/README.md)
- [Heaps](../../../19_Heaps_And_Priority_Queues/README.md)

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
| 01 | [Visible Sum to the Right](01_visible_sum_right.md) | Medium | 20 min | [statement](01_visible_sum_right.md) | [solution](solutions/01_visible_sum_right.js) |
| 02 | [Most Versatile Users](02_most_versatile_users.md) | Medium | 20 min | [statement](02_most_versatile_users.md) | [solution](solutions/02_most_versatile_users.js) |
| 03 | [Steady Subarrays](03_steady_subarrays.md) | Medium | 25 min | [statement](03_steady_subarrays.md) | [solution](solutions/03_steady_subarrays.js) |
| 04 | [Cursor Editor](04_cursor_editor.md) | Easy | 20 min | [statement](04_cursor_editor.md) | [solution](solutions/04_cursor_editor.js) |
| 05 | [Smallest Covering Range](05_smallest_covering_range.md) | Hard | 35 min | [statement](05_smallest_covering_range.md) | [solution](solutions/05_smallest_covering_range.js) |

Run all solutions of this set:

```
for f in solutions/*.js; do node "$f"; done
```
