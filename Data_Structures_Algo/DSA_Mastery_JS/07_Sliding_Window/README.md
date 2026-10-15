# Sliding Window

**Prerequisites:** [Two Pointers](../06_Two_Pointers/README.md), [Hashing](../05_Hashing/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 07_Sliding_Window` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `sliding_window_templates.js` |
| [03_Problems](03_Problems) | 15 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Maximum Average Subarray I | Easy | fixed window | [statement](03_Problems/01_Easy/01_maximum_average_subarray.md) | [solution](03_Problems/solutions/01_maximum_average_subarray.js) |
| 02 | Maximum Sum Subarray of Size K | Easy | fixed window | [statement](03_Problems/01_Easy/02_max_sum_subarray_size_k.md) | [solution](03_Problems/solutions/02_max_sum_subarray_size_k.js) |
| 03 | Longest Substring Without Repeating Characters | Medium | variable, Set | [statement](03_Problems/02_Medium/03_longest_substring_without_repeating.md) | [solution](03_Problems/solutions/03_longest_substring_without_repeating.js) |
| 04 | Longest Repeating Character Replacement | Medium | variable, counts + maxFreq | [statement](03_Problems/02_Medium/04_longest_repeating_character_replacement.md) | [solution](03_Problems/solutions/04_longest_repeating_character_replacement.js) |
| 05 | Minimum Size Subarray Sum | Medium | variable, shortest | [statement](03_Problems/02_Medium/05_minimum_size_subarray_sum.md) | [solution](03_Problems/solutions/05_minimum_size_subarray_sum.js) |
| 06 | Permutation in String | Medium | fixed, counts | [statement](03_Problems/02_Medium/06_permutation_in_string.md) | [solution](03_Problems/solutions/06_permutation_in_string.js) |
| 07 | Find All Anagrams in a String | Medium | fixed, counts | [statement](03_Problems/02_Medium/07_find_all_anagrams.md) | [solution](03_Problems/solutions/07_find_all_anagrams.js) |
| 08 | Fruit Into Baskets | Medium | variable, at most 2 distinct | [statement](03_Problems/02_Medium/08_fruit_into_baskets.md) | [solution](03_Problems/solutions/08_fruit_into_baskets.js) |
| 09 | Max Consecutive Ones III | Medium | variable, budget of k | [statement](03_Problems/02_Medium/09_max_consecutive_ones_iii.md) | [solution](03_Problems/solutions/09_max_consecutive_ones_iii.js) |
| 10 | Longest Subarray of 1's After Deleting One Element | Medium | variable, budget of 1 | [statement](03_Problems/02_Medium/10_longest_subarray_of_ones_after_deleting.md) | [solution](03_Problems/solutions/10_longest_subarray_of_ones_after_deleting.js) |
| 11 | Subarrays with K Different Integers | Hard | at most K trick | [statement](03_Problems/03_Hard/11_subarrays_with_k_different_integers.md) | [solution](03_Problems/solutions/11_subarrays_with_k_different_integers.js) |
| 12 | Sliding Window Maximum | Hard | monotonic deque | [statement](03_Problems/03_Hard/12_sliding_window_maximum.md) | [solution](03_Problems/solutions/12_sliding_window_maximum.js) |
| 13 | Count Number of Nice Subarrays | Medium | at most K trick | [statement](03_Problems/02_Medium/13_count_nice_subarrays.md) | [solution](03_Problems/solutions/13_count_nice_subarrays.js) |
| 14 | Minimum Window Substring | Hard | variable, shortest, counts | [statement](03_Problems/03_Hard/14_minimum_window_substring.md) | [solution](03_Problems/solutions/14_minimum_window_substring.js) |
| 15 | Minimum Number of K Consecutive Bit Flips | Hard | window of flips + lazy toggle | [statement](03_Problems/03_Hard/15_min_k_consecutive_bit_flips.md) | [solution](03_Problems/solutions/15_min_k_consecutive_bit_flips.js) |

