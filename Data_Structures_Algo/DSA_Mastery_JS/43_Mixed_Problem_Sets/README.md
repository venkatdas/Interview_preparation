# 43 — Mixed Problem Sets

Up to now every problem lived inside a topic folder, so you always knew which pattern to use before you read
the first line. Real interviews do not tell you that. This folder trains the missing skill: **reading a
problem cold, recognizing which patterns it needs (usually two or more), and solving it under a time limit.**

## Prerequisites

The sets are cumulative. Each set's README lists exactly which stages it assumes. Roughly:

| Set | Assumes you finished |
|-----|----------------------|
| [Set 01](03_Problems/set_01/README.md) | [Arrays](../03_Arrays/README.md), [Strings](../04_Strings/README.md), [Hashing](../05_Hashing/README.md), [Two Pointers](../06_Two_Pointers/README.md), [Sliding Window](../07_Sliding_Window/README.md), [Prefix Sums](../08_Prefix_Sums_And_Difference_Arrays/README.md) |
| [Set 02](03_Problems/set_02/README.md) | + [Searching](../10_Searching/README.md), [Sorting](../11_Sorting/README.md), [Backtracking](../13_Backtracking/README.md), [Greedy](../28_Greedy_Algorithms/README.md) basics |
| [Set 03](03_Problems/set_03/README.md) | + [Linked Lists](../15_Linked_Lists/README.md), [Stacks](../16_Stacks/README.md), [Queues & Deques](../17_Queues_And_Deques/README.md), [Monotonic Stacks](../18_Monotonic_Stacks_And_Queues/README.md), [Heaps](../19_Heaps_And_Priority_Queues/README.md) |
| [Set 04](03_Problems/set_04/README.md) | + [Binary Trees](../20_Trees/01_Binary_Trees/README.md), [BSTs](../21_Binary_Search_Trees/README.md), [Tries](../22_Tries/README.md), [Bit Manipulation](../14_Bit_Manipulation/README.md) |
| [Set 05](03_Problems/set_05/README.md) | + [Graph Traversal](../24_Graph_Traversal/README.md), [Shortest Paths](../25_Graph_Algorithms/01_Shortest_Paths/README.md), [MST](../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md), [Topological Sorting](../26_Topological_Sorting/README.md), [Union-Find](../27_Union_Find_Disjoint_Set/README.md) |
| [Set 06](03_Problems/set_06/README.md) | + [1-D DP](../29_Dynamic_Programming/01_One_Dimensional_DP/README.md), [DP on strings](../29_Dynamic_Programming/03_Strings_And_Sequences/README.md), [Advanced DP (bitmask)](../29_Dynamic_Programming/06_Advanced_DP/README.md) |

## How to use the mixed sets

1. **Timed.** Each problem has a time box (15–40 minutes). Each set has a total budget (90–160 minutes).
   Do a whole set in one sitting with a visible timer.
2. **No topic labels.** Statement pages hide the topic and pattern on purpose. The first hint names the
   patterns. Try hard not to open it before the time box ends.
3. **Brute force first, out loud.** Every problem has a slow but correct solution. Say it, state its
   complexity, then ask "what work am I repeating?" That question usually reveals the second pattern.
4. **Test like the solution files do.** Write your brute force too, and compare it with your optimized
   version on small random inputs. Every solution file shows how (seeded random tests).
5. **Reflect.** After each set, fill in its checklist and answer its 3 conceptual questions in
   [QUIZ.md](04_Interview_And_Assessment/QUIZ.md). Log mistakes in [PROBLEM_TRACKER.md](../PROBLEM_TRACKER.md).
6. **Repeat.** Re-do any problem you missed after 3 days and again after 1 week, without hints.

When you can finish Set 06 inside its time budget, move on to the [mock interviews](../44_Mock_Interviews/README.md).

## Contents

| Path | What it is |
|------|------------|
| [01_Concepts/BLIND_75.md](01_Concepts/BLIND_75.md) | The Blind 75 list, with LeetCode links and links to this curriculum's statement pages |
| [01_Concepts/NEETCODE_150.md](01_Concepts/NEETCODE_150.md) | The NeetCode 150 list, same format |
| [01_Concepts/BY_COMPANY_STYLE.md](01_Concepts/BY_COMPANY_STYLE.md) | Commonly reported problem styles by kind of company |
| [03_Problems/](03_Problems/set_01/README.md) | 6 original mixed sets × 5 problems, each needing 2+ patterns |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | Post-set reflection checklists and conceptual questions |
| [tests/mixed_sets.test.js](tests/mixed_sets.test.js) | `node --test` suite covering every solution with extra edge cases |

## Index of sets

| Set | Level | Total time | Problems |
|-----|-------|------------|----------|
| [Set 01 — Easy fundamentals](03_Problems/set_01/README.md) | Easy → Medium | 90 min | [01](03_Problems/set_01/01_unique_streak_max_sum.md) · [02](03_Problems/set_01/02_balanced_lr_substrings.md) · [03](03_Problems/set_01/03_anagram_pair_count.md) · [04](03_Problems/set_01/04_longest_quiet_gap.md) · [05](03_Problems/set_01/05_bonus_leader.md) |
| [Set 02 — Searching & search spaces](03_Problems/set_02/README.md) | Medium | 120 min | [01](03_Problems/set_02/01_snack_budget.md) · [02](03_Problems/set_02/02_capped_reading_split.md) · [03](03_Problems/set_02/03_rotated_range_count.md) · [04](03_Problems/set_02/04_k_items_closest_budget.md) · [05](03_Problems/set_02/05_active_sessions.md) |
| [Set 03 — Linear structures](03_Problems/set_03/README.md) | Medium → Hard | 120 min | [01](03_Problems/set_03/01_visible_sum_right.md) · [02](03_Problems/set_03/02_most_versatile_users.md) · [03](03_Problems/set_03/03_steady_subarrays.md) · [04](03_Problems/set_03/04_cursor_editor.md) · [05](03_Problems/set_03/05_smallest_covering_range.md) |
| [Set 04 — Trees, BSTs, tries](03_Problems/set_04/README.md) | Medium → Hard | 130 min | [01](03_Problems/set_04/01_divisible_downward_paths.md) · [02](03_Problems/set_04/02_bst_pair_count.md) · [03](03_Problems/set_04/03_wildcard_dictionary_count.md) · [04](03_Problems/set_04/04_vertical_columns.md) · [05](03_Problems/set_04/05_capped_xor_queries.md) |
| [Set 05 — Graphs with a twist](03_Problems/set_05/README.md) | Medium → Hard | 150 min | [01](03_Problems/set_05/01_hiking_robot.md) · [02](03_Problems/set_05/02_connection_time_queries.md) · [03](03_Problems/set_05/03_pipeline_finish_time.md) · [04](03_Problems/set_05/04_coupon_routes.md) · [05](03_Problems/set_05/05_mandatory_roads_mst.md) |
| [Set 06 — Hard mixed](03_Problems/set_06/README.md) | Hard | 160 min | [01](03_Problems/set_06/01_compatible_assignment.md) · [02](03_Problems/set_06/02_shortest_burst.md) · [03](03_Problems/set_06/03_segmentation_ways.md) · [04](03_Problems/set_06/04_router_spacing.md) · [05](03_Problems/set_06/05_courier_all_stops.md) |

Problem links show only numbers so that the titles do not hint at the pattern before you start.

## Running the code

```
node 43_Mixed_Problem_Sets/03_Problems/set_01/solutions/01_unique_streak_max_sum.js   # one solution
node --test 43_Mixed_Problem_Sets/tests/mixed_sets.test.js                            # the whole folder
```
