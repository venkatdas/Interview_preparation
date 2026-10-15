# Segment Tree

**Prerequisites:** [Trees](../../20_Trees), [Prefix Sums And Difference Arrays](../../08_Prefix_Sums_And_Difference_Arrays/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 34_Range_Query_Data_Structures/01_Segment_Tree/tests/segment_tree.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `segment_tree.js` |
| [03_Problems](03_Problems) | 6 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `segment_tree.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Range Sum Query - Mutable | Medium | point update + range sum | [statement](03_Problems/02_Medium/01_range_sum_query_mutable.md) | [solution](03_Problems/solutions/01_range_sum_query_mutable.js) |
| 02 | Range Minimum Query with updates | Medium | generic merge (min) | [statement](03_Problems/02_Medium/02_range_minimum_query.md) | [solution](03_Problems/solutions/02_range_minimum_query.js) |
| 03 | Falling Squares | Hard | coordinate compression + lazy range-assign/max | [statement](03_Problems/03_Hard/03_falling_squares.md) | [solution](03_Problems/solutions/03_falling_squares.js) |
| 04 | My Calendar III | Hard | sweep line vs dynamic tree with lazy range-add | [statement](03_Problems/03_Hard/04_my_calendar_iii.md) | [solution](03_Problems/solutions/04_my_calendar_iii.js) |
| 05 | Number of Longest Increasing Subsequence | Medium | tree over values with (length, count) pairs | [statement](03_Problems/02_Medium/05_number_of_longest_increasing_subsequence.md) | [solution](03_Problems/solutions/05_number_of_longest_increasing_subsequence.js) |
| 06 | Count of Range Sum | Hard | prefix sums + counting tree over values | [statement](03_Problems/03_Hard/06_count_of_range_sum.md) | [solution](03_Problems/solutions/06_count_of_range_sum.js) |

