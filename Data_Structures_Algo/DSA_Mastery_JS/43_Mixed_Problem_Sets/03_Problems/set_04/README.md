# Mixed Set 04 — Trees, BSTs and tries

Hierarchical data (trees, BSTs, tries) combined with tools from earlier sets.

| | |
|---|---|
| **Level** | Medium → Hard |
| **Suggested total time** | 130 minutes (sum of time boxes: 130 min, plus review) |
| **Previous set** | [Set 03](../set_03/README.md) |
| **Next** | [Set 05](../set_05/README.md) |

## Stages this set assumes

You should have finished these topics (sets are cumulative, so everything from earlier sets is fair game too):

- [Hashing](../../../05_Hashing/README.md)
- [Two Pointers](../../../06_Two_Pointers/README.md)
- [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)
- [Bit Manipulation](../../../14_Bit_Manipulation/README.md)
- [Binary Trees](../../../20_Trees/01_Binary_Trees/README.md)
- [Binary Search Trees](../../../21_Binary_Search_Trees/README.md)
- [Tries](../../../22_Tries/README.md)

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
| 01 | [Divisible Downward Paths](01_divisible_downward_paths.md) | Medium | 25 min | [statement](01_divisible_downward_paths.md) | [solution](solutions/01_divisible_downward_paths.js) |
| 02 | [BST Pair Count](02_bst_pair_count.md) | Medium | 20 min | [statement](02_bst_pair_count.md) | [solution](solutions/02_bst_pair_count.js) |
| 03 | [Wildcard Dictionary Count](03_wildcard_dictionary_count.md) | Medium | 25 min | [statement](03_wildcard_dictionary_count.md) | [solution](solutions/03_wildcard_dictionary_count.js) |
| 04 | [Vertical Columns](04_vertical_columns.md) | Medium | 25 min | [statement](04_vertical_columns.md) | [solution](solutions/04_vertical_columns.js) |
| 05 | [Capped XOR Queries](05_capped_xor_queries.md) | Hard | 35 min | [statement](05_capped_xor_queries.md) | [solution](solutions/05_capped_xor_queries.js) |

Run all solutions of this set:

```
for f in solutions/*.js; do node "$f"; done
```
