# Prefix Sums and Difference Arrays

**Prerequisites:** [Arrays](../03_Arrays/README.md), [Hashing](../05_Hashing/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 08_Prefix_Sums_And_Difference_Arrays` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `prefix_sum.js` |
| [03_Problems](03_Problems) | 14 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Running Sum of 1d Array | Easy | build prefix | [statement](03_Problems/01_Easy/01_running_sum.md) | [solution](03_Problems/solutions/01_running_sum.js) |
| 02 | Range Sum Query - Immutable | Easy | range query | [statement](03_Problems/01_Easy/02_range_sum_query_immutable.md) | [solution](03_Problems/solutions/02_range_sum_query_immutable.js) |
| 03 | Find Pivot Index | Easy | left sum vs right sum | [statement](03_Problems/01_Easy/03_find_pivot_index.md) | [solution](03_Problems/solutions/03_find_pivot_index.js) |
| 04 | Product of Array Except Self | Medium | prefix × suffix | [statement](03_Problems/02_Medium/04_product_of_array_except_self.md) | [solution](03_Problems/solutions/04_product_of_array_except_self.js) |
| 05 | Subarray Sum Equals K | Medium | prefix + hash map (count) | [statement](03_Problems/02_Medium/05_subarray_sum_equals_k.md) | [solution](03_Problems/solutions/05_subarray_sum_equals_k.js) |
| 06 | Maximum Size Subarray Sum Equals k | Medium | prefix + hash map (first index) | [statement](03_Problems/02_Medium/06_maximum_size_subarray_sum_equals_k.md) | [solution](03_Problems/solutions/06_maximum_size_subarray_sum_equals_k.js) |
| 07 | Contiguous Array | Medium | balance transform | [statement](03_Problems/02_Medium/07_contiguous_array.md) | [solution](03_Problems/solutions/07_contiguous_array.js) |
| 08 | Subarray Sums Divisible by K | Medium | remainder buckets | [statement](03_Problems/02_Medium/08_subarray_sums_divisible_by_k.md) | [solution](03_Problems/solutions/08_subarray_sums_divisible_by_k.js) |
| 09 | Count Number of Nice Subarrays | Medium | transform + prefix count | [statement](03_Problems/02_Medium/09_count_nice_subarrays.md) | [solution](03_Problems/solutions/09_count_nice_subarrays.js) |
| 10 | Minimum Value to Get Positive Step by Step Sum | Easy | prefix min | [statement](03_Problems/01_Easy/10_minimum_value_positive_step_sum.md) | [solution](03_Problems/solutions/10_minimum_value_positive_step_sum.js) |
| 11 | Range Sum Query 2D - Immutable | Medium | 2D prefix | [statement](03_Problems/02_Medium/11_range_sum_query_2d.md) | [solution](03_Problems/solutions/11_range_sum_query_2d.js) |
| 12 | Corporate Flight Bookings | Medium | difference array | [statement](03_Problems/02_Medium/12_corporate_flight_bookings.md) | [solution](03_Problems/solutions/12_corporate_flight_bookings.js) |
| 13 | Car Pooling | Medium | difference array over time | [statement](03_Problems/02_Medium/13_car_pooling.md) | [solution](03_Problems/solutions/13_car_pooling.js) |
| 14 | Ways to Split Array Into Three Subarrays | Hard | prefix + binary search | [statement](03_Problems/03_Hard/14_ways_to_split_array.md) | [solution](03_Problems/solutions/14_ways_to_split_array.js) |

