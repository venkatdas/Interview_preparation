# Queues and Deques

**Prerequisites:** [Stacks](../16_Stacks/README.md), [Linked Lists](../15_Linked_Lists/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 17_Queues_And_Deques` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `queue.js` |
| [03_Problems](03_Problems) | 14 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Implement Stack using Queues | Easy | rotate on push | [statement](03_Problems/01_Easy/01_stack_using_queues.md) | [solution](03_Problems/solutions/01_stack_using_queues.js) |
| 02 | Implement Queue using Stacks | Easy | two stacks, amortized | [statement](03_Problems/01_Easy/02_queue_using_stacks.md) | [solution](03_Problems/solutions/02_queue_using_stacks.js) |
| 03 | Design Circular Queue | Medium | ring buffer | [statement](03_Problems/02_Medium/03_design_circular_queue.md) | [solution](03_Problems/solutions/03_design_circular_queue.js) |
| 04 | Design Circular Deque | Medium | ring buffer, both ends | [statement](03_Problems/02_Medium/04_design_circular_deque.md) | [solution](03_Problems/solutions/04_design_circular_deque.js) |
| 05 | Number of Recent Calls | Easy | time-window queue | [statement](03_Problems/01_Easy/05_number_of_recent_calls.md) | [solution](03_Problems/solutions/05_number_of_recent_calls.js) |
| 06 | Moving Average from Data Stream | Easy | fixed window + running sum | [statement](03_Problems/01_Easy/06_moving_average.md) | [solution](03_Problems/solutions/06_moving_average.js) |
| 07 | Sliding Window Maximum | Hard | monotonic deque | [statement](03_Problems/03_Hard/07_sliding_window_maximum.md) | [solution](03_Problems/solutions/07_sliding_window_maximum.js) |
| 08 | Shortest Subarray with Sum at Least K | Hard | monotonic deque on prefix sums | [statement](03_Problems/03_Hard/08_shortest_subarray_sum_at_least_k.md) | [solution](03_Problems/solutions/08_shortest_subarray_sum_at_least_k.js) |
| 09 | Rotting Oranges | Medium | multi-source BFS, levels | [statement](03_Problems/02_Medium/09_rotting_oranges.md) | [solution](03_Problems/solutions/09_rotting_oranges.js) |
| 10 | Walls and Gates / 01 Matrix | Medium | multi-source BFS, distances | [statement](03_Problems/02_Medium/10_walls_and_gates_01_matrix.md) | [solution](03_Problems/solutions/10_walls_and_gates_01_matrix.js) |
| 11 | Design Hit Counter | Medium | time-window queue + counts | [statement](03_Problems/02_Medium/11_design_hit_counter.md) | [solution](03_Problems/solutions/11_design_hit_counter.js) |
| 12 | Task Scheduler | Medium | max-heap + cooldown queue / counting | [statement](03_Problems/02_Medium/12_task_scheduler.md) | [solution](03_Problems/solutions/12_task_scheduler.js) |
| 13 | Dota2 Senate | Medium | two queues, round robin | [statement](03_Problems/02_Medium/13_dota2_senate.md) | [solution](03_Problems/solutions/13_dota2_senate.js) |
| 14 | Reveal Cards In Increasing Order | Medium | reverse simulation with deque | [statement](03_Problems/02_Medium/14_reveal_cards_increasing_order.md) | [solution](03_Problems/solutions/14_reveal_cards_increasing_order.js) |

