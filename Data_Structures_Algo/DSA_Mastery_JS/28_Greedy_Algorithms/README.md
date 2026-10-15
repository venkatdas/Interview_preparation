# Greedy Algorithms

**Prerequisites:** [Sorting](../11_Sorting/README.md), [Heaps And Priority Queues](../19_Heaps_And_Priority_Queues/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 28_Greedy_Algorithms` (from the curriculum root).

**Check yourself:** [Quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `greedy_classics.js` |
| [03_Problems](03_Problems) | 18 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Assign Cookies | Easy | sort + two pointers | [statement](03_Problems/01_Easy/01_assign_cookies.md) | [solution](03_Problems/solutions/01_assign_cookies.js) |
| 02 | Lemonade Change | Easy | counting greedy | [statement](03_Problems/01_Easy/02_lemonade_change.md) | [solution](03_Problems/solutions/02_lemonade_change.js) |
| 03 | Maximum Units on a Truck | Easy | sort by value | [statement](03_Problems/01_Easy/03_maximum_units_on_truck.md) | [solution](03_Problems/solutions/03_maximum_units_on_truck.js) |
| 04 | Best Time to Buy and Sell Stock II | Medium | take every rise | [statement](03_Problems/02_Medium/04_best_time_to_buy_and_sell_stock_ii.md) | [solution](03_Problems/solutions/04_best_time_to_buy_and_sell_stock_ii.js) |
| 05 | Jump Game | Medium | farthest reach | [statement](03_Problems/02_Medium/05_jump_game.md) | [solution](03_Problems/solutions/05_jump_game.js) |
| 06 | Jump Game II | Medium | farthest reach (BFS levels) | [statement](03_Problems/02_Medium/06_jump_game_ii.md) | [solution](03_Problems/solutions/06_jump_game_ii.js) |
| 07 | Gas Station | Medium | circuit argument | [statement](03_Problems/02_Medium/07_gas_station.md) | [solution](03_Problems/solutions/07_gas_station.js) |
| 08 | Boats to Save People | Medium | two-pointer greedy | [statement](03_Problems/02_Medium/08_boats_to_save_people.md) | [solution](03_Problems/solutions/08_boats_to_save_people.js) |
| 09 | Partition Labels | Medium | farthest last occurrence | [statement](03_Problems/02_Medium/09_partition_labels.md) | [solution](03_Problems/solutions/09_partition_labels.js) |
| 10 | Non-overlapping Intervals | Medium | interval scheduling | [statement](03_Problems/02_Medium/10_non_overlapping_intervals.md) | [solution](03_Problems/solutions/10_non_overlapping_intervals.js) |
| 11 | Minimum Number of Arrows to Burst Balloons | Medium | interval scheduling | [statement](03_Problems/02_Medium/11_minimum_arrows_burst_balloons.md) | [solution](03_Problems/solutions/11_minimum_arrows_burst_balloons.js) |
| 12 | Hand of Straights | Medium | sorted map greedy | [statement](03_Problems/02_Medium/12_hand_of_straights.md) | [solution](03_Problems/solutions/12_hand_of_straights.js) |
| 13 | Merge Triplets to Form Target Triplet | Medium | filter then check | [statement](03_Problems/02_Medium/13_merge_triplets.md) | [solution](03_Problems/solutions/13_merge_triplets.js) |
| 14 | Valid Parenthesis String | Medium | greedy min/max range | [statement](03_Problems/02_Medium/14_valid_parenthesis_string.md) | [solution](03_Problems/solutions/14_valid_parenthesis_string.js) |
| 15 | Task Scheduler | Medium | greedy math / heap | [statement](03_Problems/02_Medium/15_task_scheduler.md) | [solution](03_Problems/solutions/15_task_scheduler.js) |
| 16 | Queue Reconstruction by Height | Medium | sort + insert | [statement](03_Problems/02_Medium/16_queue_reconstruction_by_height.md) | [solution](03_Problems/solutions/16_queue_reconstruction_by_height.js) |
| 17 | Minimum Deletions to Make Character Frequencies Unique | Medium | sort + decrement | [statement](03_Problems/02_Medium/17_min_deletions_unique_frequencies.md) | [solution](03_Problems/solutions/17_min_deletions_unique_frequencies.js) |
| 18 | Candy | Hard | two-pass greedy | [statement](03_Problems/03_Hard/18_candy.md) | [solution](03_Problems/solutions/18_candy.js) |

