# Two Pointers

**Prerequisites:** [Arrays](../03_Arrays/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 06_Two_Pointers` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `two_pointer_templates.js` |
| [03_Problems](03_Problems) | 18 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Reverse String & Reverse Vowels of a String | Easy | opposite ends, swap | [statement](03_Problems/01_Easy/01_reverse_string_and_vowels.md) | [solution](03_Problems/solutions/01_reverse_string_and_vowels.js) |
| 02 | Valid Palindrome II | Easy | opposite ends, one skip | [statement](03_Problems/01_Easy/02_valid_palindrome_ii.md) | [solution](03_Problems/solutions/02_valid_palindrome_ii.js) |
| 03 | Two Sum II - Input Array Is Sorted | Medium | opposite ends | [statement](03_Problems/02_Medium/03_two_sum_ii_sorted.md) | [solution](03_Problems/solutions/03_two_sum_ii_sorted.js) |
| 04 | Remove Element | Easy | read / write | [statement](03_Problems/01_Easy/04_remove_element.md) | [solution](03_Problems/solutions/04_remove_element.js) |
| 05 | Move Zeroes | Easy | read / write | [statement](03_Problems/01_Easy/05_move_zeroes.md) | [solution](03_Problems/solutions/05_move_zeroes.js) |
| 06 | Remove Duplicates from Sorted Array II | Medium | read / write (look back k) | [statement](03_Problems/02_Medium/06_remove_duplicates_sorted_array_ii.md) | [solution](03_Problems/solutions/06_remove_duplicates_sorted_array_ii.js) |
| 07 | Squares of a Sorted Array | Easy | opposite ends, fill from back | [statement](03_Problems/01_Easy/07_squares_of_sorted_array.md) | [solution](03_Problems/solutions/07_squares_of_sorted_array.js) |
| 08 | Merge Sorted Array | Easy | two arrays, fill from back | [statement](03_Problems/01_Easy/08_merge_sorted_array.md) | [solution](03_Problems/solutions/08_merge_sorted_array.js) |
| 09 | Is Subsequence | Easy | two sequences | [statement](03_Problems/01_Easy/09_is_subsequence.md) | [solution](03_Problems/solutions/09_is_subsequence.js) |
| 10 | Backspace String Compare | Easy | two sequences from the back | [statement](03_Problems/01_Easy/10_backspace_string_compare.md) | [solution](03_Problems/solutions/10_backspace_string_compare.js) |
| 11 | Container With Most Water | Medium | opposite ends, greedy move | [statement](03_Problems/02_Medium/11_container_with_most_water.md) | [solution](03_Problems/solutions/11_container_with_most_water.js) |
| 12 | Trapping Rain Water | Hard | opposite ends + running max | [statement](03_Problems/03_Hard/12_trapping_rain_water.md) | [solution](03_Problems/solutions/12_trapping_rain_water.js) |
| 13 | 3Sum | Medium | sort + opposite ends | [statement](03_Problems/02_Medium/13_three_sum.md) | [solution](03_Problems/solutions/13_three_sum.js) |
| 14 | 3Sum Closest | Medium | sort + opposite ends | [statement](03_Problems/02_Medium/14_three_sum_closest.md) | [solution](03_Problems/solutions/14_three_sum_closest.js) |
| 15 | 4Sum | Medium | sort + nested opposite ends | [statement](03_Problems/02_Medium/15_four_sum.md) | [solution](03_Problems/solutions/15_four_sum.js) |
| 16 | Sort Colors | Medium | Dutch flag partition | [statement](03_Problems/02_Medium/16_sort_colors.md) | [solution](03_Problems/solutions/16_sort_colors.js) |
| 17 | Boats to Save People | Medium | sort + greedy pairing | [statement](03_Problems/02_Medium/17_boats_to_save_people.md) | [solution](03_Problems/solutions/17_boats_to_save_people.js) |
| 18 | Partition Labels | Medium | last-index + expanding end | [statement](03_Problems/02_Medium/18_partition_labels.md) | [solution](03_Problems/solutions/18_partition_labels.js) |

