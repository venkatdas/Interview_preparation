# Searching (Linear and Binary Search)

**Prerequisites:** [Arrays](../03_Arrays/README.md), [Sorting](../11_Sorting/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 10_Searching` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `binary_search_templates.js` |
| [03_Problems](03_Problems) | 18 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Binary Search | Easy | template 1 exact | [statement](03_Problems/01_Easy/01_binary_search.md) | [solution](03_Problems/solutions/01_binary_search.js) |
| 02 | Search Insert Position | Easy | lower bound | [statement](03_Problems/01_Easy/02_search_insert_position.md) | [solution](03_Problems/solutions/02_search_insert_position.js) |
| 03 | First Bad Version | Easy | first true (boundary) | [statement](03_Problems/01_Easy/03_first_bad_version.md) | [solution](03_Problems/solutions/03_first_bad_version.js) |
| 04 | Find First and Last Position of Element in Sorted Array | Medium | lower + upper bound | [statement](03_Problems/02_Medium/04_first_and_last_position.md) | [solution](03_Problems/solutions/04_first_and_last_position.js) |
| 05 | Sqrt | Easy | search on answer (last true) | [statement](03_Problems/01_Easy/05_sqrt_x.md) | [solution](03_Problems/solutions/05_sqrt_x.js) |
| 06 | Guess Number Higher or Lower | Easy | exact with an oracle | [statement](03_Problems/01_Easy/06_guess_number.md) | [solution](03_Problems/solutions/06_guess_number.js) |
| 07 | Search in Rotated Sorted Array | Medium | rotated, pick the sorted half | [statement](03_Problems/02_Medium/07_search_rotated_sorted_array.md) | [solution](03_Problems/solutions/07_search_rotated_sorted_array.js) |
| 08 | Search in Rotated Sorted Array II | Medium | rotated with duplicates | [statement](03_Problems/02_Medium/08_search_rotated_sorted_array_ii.md) | [solution](03_Problems/solutions/08_search_rotated_sorted_array_ii.js) |
| 09 | Find Minimum in Rotated Sorted Array | Medium | compare mid with right | [statement](03_Problems/02_Medium/09_find_minimum_rotated_sorted_array.md) | [solution](03_Problems/solutions/09_find_minimum_rotated_sorted_array.js) |
| 10 | Find Peak Element | Medium | slope predicate | [statement](03_Problems/02_Medium/10_find_peak_element.md) | [solution](03_Problems/solutions/10_find_peak_element.js) |
| 11 | Search a 2D Matrix | Medium | flattened index | [statement](03_Problems/02_Medium/11_search_2d_matrix.md) | [solution](03_Problems/solutions/11_search_2d_matrix.js) |
| 12 | Koko Eating Bananas | Medium | search on answer | [statement](03_Problems/02_Medium/12_koko_eating_bananas.md) | [solution](03_Problems/solutions/12_koko_eating_bananas.js) |
| 13 | Capacity To Ship Packages Within D Days | Medium | search on answer | [statement](03_Problems/02_Medium/13_capacity_to_ship_packages.md) | [solution](03_Problems/solutions/13_capacity_to_ship_packages.js) |
| 14 | Split Array Largest Sum | Hard | search on answer (minimize max) | [statement](03_Problems/03_Hard/14_split_array_largest_sum.md) | [solution](03_Problems/solutions/14_split_array_largest_sum.js) |
| 15 | Time Based Key-Value Store | Medium | upper bound on timestamps | [statement](03_Problems/02_Medium/15_time_based_key_value_store.md) | [solution](03_Problems/solutions/15_time_based_key_value_store.js) |
| 16 | Median of Two Sorted Arrays | Hard | partition search | [statement](03_Problems/03_Hard/16_median_of_two_sorted_arrays.md) | [solution](03_Problems/solutions/16_median_of_two_sorted_arrays.js) |
| 17 | Find K Closest Elements | Medium | search the window start | [statement](03_Problems/02_Medium/17_find_k_closest_elements.md) | [solution](03_Problems/solutions/17_find_k_closest_elements.js) |
| 18 | Single Element in a Sorted Array | Medium | index parity | [statement](03_Problems/02_Medium/18_single_element_sorted_array.md) | [solution](03_Problems/solutions/18_single_element_sorted_array.js) |

