# Monotonic Stacks and Queues

**Prerequisites:** [Stacks](../16_Stacks/README.md), [Queues And Deques](../17_Queues_And_Deques/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 18_Monotonic_Stacks_And_Queues` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `monotonic.js` |
| [03_Problems](03_Problems) | 6 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Online Stock Span | Medium | stack of (price, span) | [statement](03_Problems/02_Medium/01_online_stock_span.md) | [solution](03_Problems/solutions/01_online_stock_span.js) |
| 02 | Shortest Unsorted Continuous Subarray | Medium | monotonic stack vs prefix-max/suffix-min | [statement](03_Problems/02_Medium/02_shortest_unsorted_continuous_subarray.md) | [solution](03_Problems/solutions/02_shortest_unsorted_continuous_subarray.js) |
| 03 | Sum of Subarray Minimums | Medium | contribution technique, strict/non-strict | [statement](03_Problems/02_Medium/03_sum_of_subarray_minimums.md) | [solution](03_Problems/solutions/03_sum_of_subarray_minimums.js) |
| 04 | Largest Rectangle in Histogram | Hard | boundary arrays and one-pass sentinel | [statement](03_Problems/03_Hard/04_largest_rectangle_in_histogram.md) | [solution](03_Problems/solutions/04_largest_rectangle_in_histogram.js) |
| 05 | Maximal Rectangle | Hard | histogram per row | [statement](03_Problems/03_Hard/05_maximal_rectangle.md) | [solution](03_Problems/solutions/05_maximal_rectangle.js) |
| 06 | Jump Game VI | Medium | DP + monotonic deque | [statement](03_Problems/02_Medium/06_jump_game_vi.md) | [solution](03_Problems/solutions/06_jump_game_vi.js) |

