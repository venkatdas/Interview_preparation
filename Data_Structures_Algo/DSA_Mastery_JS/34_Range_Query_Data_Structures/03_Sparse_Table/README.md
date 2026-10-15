# Sparse Table (Range Minimum Query)

**Prerequisites:** [Range Query Data Structures/01 Segment Tree](../01_Segment_Tree/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 34_Range_Query_Data_Structures/03_Sparse_Table/tests/sparse_table.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `sparse_table.js` |
| [03_Problems](03_Problems) | 3 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `sparse_table.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Range Minimum Queries, offline / static | Medium | sparse table O(1) RMQ | [statement](03_Problems/02_Medium/01_range_min_queries_offline.md) | [solution](03_Problems/solutions/01_range_min_queries_offline.js) |
| 02 | Sliding Window Maximum, sparse table version | Hard | fixed-size windows share one level | [statement](03_Problems/03_Hard/02_sliding_window_maximum_sparse_table.md) | [solution](03_Problems/solutions/02_sliding_window_maximum_sparse_table.js) |
| 03 | Longest Common Prefix of two suffixes | Hard | suffix array + LCP array + RMQ | [statement](03_Problems/03_Hard/03_longest_common_prefix_of_ranges.md) | [solution](03_Problems/solutions/03_longest_common_prefix_of_ranges.js) |

