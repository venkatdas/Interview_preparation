# Heaps and Priority Queues

**Prerequisites:** [Arrays](../03_Arrays/README.md), [Trees/01 Binary Trees](../20_Trees/01_Binary_Trees/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 19_Heaps_And_Priority_Queues` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `heap_sort.js`, `min_heap.js` |
| [03_Problems](03_Problems) | 16 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Kth Largest Element in an Array | Medium | top K (min-heap size k) | [statement](03_Problems/02_Medium/01_kth_largest_element.md) | [solution](03_Problems/solutions/01_kth_largest_element.js) |
| 02 | Kth Largest Element in a Stream | Easy | top K, persistent heap | [statement](03_Problems/01_Easy/02_kth_largest_in_stream.md) | [solution](03_Problems/solutions/02_kth_largest_in_stream.js) |
| 03 | Last Stone Weight | Easy | max-heap simulation | [statement](03_Problems/01_Easy/03_last_stone_weight.md) | [solution](03_Problems/solutions/03_last_stone_weight.js) |
| 04 | K Closest Points to Origin | Medium | top K (max-heap size k) | [statement](03_Problems/02_Medium/04_k_closest_points.md) | [solution](03_Problems/solutions/04_k_closest_points.js) |
| 05 | Top K Frequent Elements | Medium | count + top K | [statement](03_Problems/02_Medium/05_top_k_frequent_elements.md) | [solution](03_Problems/solutions/05_top_k_frequent_elements.js) |
| 06 | Top K Frequent Words | Medium | top K with tie-break comparator | [statement](03_Problems/02_Medium/06_top_k_frequent_words.md) | [solution](03_Problems/solutions/06_top_k_frequent_words.js) |
| 07 | Merge k Sorted Lists | Hard | k-way merge | [statement](03_Problems/03_Hard/07_merge_k_sorted_lists.md) | [solution](03_Problems/solutions/07_merge_k_sorted_lists.js) |
| 08 | Find Median from Data Stream | Hard | two heaps | [statement](03_Problems/03_Hard/08_find_median_data_stream.md) | [solution](03_Problems/solutions/08_find_median_data_stream.js) |
| 09 | Task Scheduler | Medium | greedy max-heap + cooldown queue | [statement](03_Problems/02_Medium/09_task_scheduler.md) | [solution](03_Problems/solutions/09_task_scheduler.js) |
| 10 | Reorganize String | Medium | greedy max-heap, hold previous | [statement](03_Problems/02_Medium/10_reorganize_string.md) | [solution](03_Problems/solutions/10_reorganize_string.js) |
| 11 | Meeting Rooms II | Medium | heap of end times | [statement](03_Problems/02_Medium/11_meeting_rooms_ii.md) | [solution](03_Problems/solutions/11_meeting_rooms_ii.js) |
| 12 | Minimum Cost to Connect Sticks | Medium | Huffman-style greedy | [statement](03_Problems/02_Medium/12_min_cost_connect_sticks.md) | [solution](03_Problems/solutions/12_min_cost_connect_sticks.js) |
| 13 | Smallest Range Covering Elements from K Lists | Hard | k-way merge + track max | [statement](03_Problems/03_Hard/13_smallest_range_k_lists.md) | [solution](03_Problems/solutions/13_smallest_range_k_lists.js) |
| 14 | IPO | Hard | two heaps (unlock then pick) | [statement](03_Problems/03_Hard/14_ipo.md) | [solution](03_Problems/solutions/14_ipo.js) |
| 15 | Ugly Number II | Medium | generate in order with heap + set | [statement](03_Problems/02_Medium/15_ugly_number_ii.md) | [solution](03_Problems/solutions/15_ugly_number_ii.js) |
| 16 | Sliding Window Median | Hard | two heaps + lazy deletion | [statement](03_Problems/03_Hard/16_sliding_window_median.md) | [solution](03_Problems/solutions/16_sliding_window_median.js) |

