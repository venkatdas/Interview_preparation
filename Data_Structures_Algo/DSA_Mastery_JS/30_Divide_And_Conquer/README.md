# Divide and Conquer

**Prerequisites:** [Recursion and Backtracking](../13_Backtracking/README.md), [Sorting](../11_Sorting/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 30_Divide_And_Conquer` (from the curriculum root).

**Check yourself:** [Quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `divide_and_conquer.js` |
| [03_Problems](03_Problems) | 8 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Pow | Medium | halve the exponent, digit-by-digit mod | [statement](03_Problems/02_Medium/01_pow_and_super_pow.md) | [solution](03_Problems/solutions/01_pow_and_super_pow.js) |
| 02 | Maximum Subarray, divide & conquer version | Medium | left / right / crossing | [statement](03_Problems/02_Medium/02_maximum_subarray_dc.md) | [solution](03_Problems/solutions/02_maximum_subarray_dc.js) |
| 03 | Different Ways to Add Parentheses | Medium | split at every operator + memo | [statement](03_Problems/02_Medium/03_different_ways_to_add_parentheses.md) | [solution](03_Problems/solutions/03_different_ways_to_add_parentheses.js) |
| 04 | Merge k Sorted Lists | Hard | pairwise merge, N log k | [statement](03_Problems/03_Hard/04_merge_k_sorted_lists.md) | [solution](03_Problems/solutions/04_merge_k_sorted_lists.js) |
| 05 | Beautiful Array | Medium | odd/even affine construction | [statement](03_Problems/02_Medium/05_beautiful_array.md) | [solution](03_Problems/solutions/05_beautiful_array.js) |
| 06 | Count of Smaller Numbers After Self, merge-sort version | Hard | count while merging indices | [statement](03_Problems/03_Hard/06_count_of_smaller_numbers_after_self.md) | [solution](03_Problems/solutions/06_count_of_smaller_numbers_after_self.js) |
| 07 | Median of Two Sorted Arrays | Hard | binary search on the partition | [statement](03_Problems/03_Hard/07_median_of_two_sorted_arrays.md) | [solution](03_Problems/solutions/07_median_of_two_sorted_arrays.js) |
| 08 | The Skyline Problem | Hard | merge two skylines | [statement](03_Problems/03_Hard/08_the_skyline_problem.md) | [solution](03_Problems/solutions/08_the_skyline_problem.js) |

