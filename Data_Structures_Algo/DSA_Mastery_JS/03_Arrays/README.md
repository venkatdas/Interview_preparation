# Arrays

**Prerequisites:** [Foundations/01 JavaScript For DSA](../00_Foundations/01_JavaScript_For_DSA/README.md), [Complexity Analysis/01 Time Complexity](../01_Complexity_Analysis/01_Time_Complexity/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 03_Arrays` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `dynamic_array.js` |
| [03_Problems](03_Problems) | 18 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Two Sum | Easy | hash map (one pass) | [statement](03_Problems/01_Easy/01_two_sum.md) | [solution](03_Problems/solutions/01_two_sum.js) |
| 02 | Best Time to Buy and Sell Stock | Easy | running min | [statement](03_Problems/01_Easy/02_best_time_to_buy_and_sell_stock.md) | [solution](03_Problems/solutions/02_best_time_to_buy_and_sell_stock.js) |
| 03 | Contains Duplicate | Easy | set | [statement](03_Problems/01_Easy/03_contains_duplicate.md) | [solution](03_Problems/solutions/03_contains_duplicate.js) |
| 04 | Maximum Subarray | Medium | Kadane | [statement](03_Problems/02_Medium/04_maximum_subarray.md) | [solution](03_Problems/solutions/04_maximum_subarray.js) |
| 05 | Move Zeroes | Easy | write pointer / in-place swap | [statement](03_Problems/01_Easy/05_move_zeroes.md) | [solution](03_Problems/solutions/05_move_zeroes.js) |
| 06 | Remove Duplicates from Sorted Array | Easy | write pointer | [statement](03_Problems/01_Easy/06_remove_duplicates_from_sorted_array.md) | [solution](03_Problems/solutions/06_remove_duplicates_from_sorted_array.js) |
| 07 | Rotate Array | Medium | reversal | [statement](03_Problems/02_Medium/07_rotate_array.md) | [solution](03_Problems/solutions/07_rotate_array.js) |
| 08 | Product of Array Except Self | Medium | prefix / suffix | [statement](03_Problems/02_Medium/08_product_of_array_except_self.md) | [solution](03_Problems/solutions/08_product_of_array_except_self.js) |
| 09 | Merge Sorted Array | Easy | fill from the back | [statement](03_Problems/01_Easy/09_merge_sorted_array.md) | [solution](03_Problems/solutions/09_merge_sorted_array.js) |
| 10 | Majority Element | Easy | Boyer-Moore voting | [statement](03_Problems/01_Easy/10_majority_element.md) | [solution](03_Problems/solutions/10_majority_element.js) |
| 11 | Missing Number | Easy | sum formula / XOR | [statement](03_Problems/01_Easy/11_missing_number.md) | [solution](03_Problems/solutions/11_missing_number.js) |
| 12 | Find All Numbers Disappeared in an Array | Easy | index as hash | [statement](03_Problems/01_Easy/12_find_all_numbers_disappeared.md) | [solution](03_Problems/solutions/12_find_all_numbers_disappeared.js) |
| 13 | Sort Colors | Medium | Dutch national flag | [statement](03_Problems/02_Medium/13_sort_colors.md) | [solution](03_Problems/solutions/13_sort_colors.js) |
| 14 | Maximum Product Subarray | Medium | Kadane with max & min | [statement](03_Problems/02_Medium/14_maximum_product_subarray.md) | [solution](03_Problems/solutions/14_maximum_product_subarray.js) |
| 15 | Next Permutation | Medium | scan from right + reverse | [statement](03_Problems/02_Medium/15_next_permutation.md) | [solution](03_Problems/solutions/15_next_permutation.js) |
| 16 | First Missing Positive | Hard | cyclic sort | [statement](03_Problems/03_Hard/16_first_missing_positive.md) | [solution](03_Problems/solutions/16_first_missing_positive.js) |
| 17 | 3Sum | Medium | sort + two pointers | [statement](03_Problems/02_Medium/17_3sum.md) | [solution](03_Problems/solutions/17_3sum.js) |
| 18 | Find the Duplicate Number | Medium | Floyd cycle detection | [statement](03_Problems/02_Medium/18_find_the_duplicate_number.md) | [solution](03_Problems/solutions/18_find_the_duplicate_number.js) |

