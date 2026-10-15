# Hashing (Hash Maps and Sets)

**Prerequisites:** [Arrays](../03_Arrays/README.md), [Strings](../04_Strings/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 05_Hashing` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `hash_table.js` |
| [03_Problems](03_Problems) | 15 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Two Sum | Easy | complement lookup | [statement](03_Problems/01_Easy/01_two_sum.md) | [solution](03_Problems/solutions/01_two_sum.js) |
| 02 | Contains Duplicate II | Easy | index map | [statement](03_Problems/01_Easy/02_contains_duplicate_ii.md) | [solution](03_Problems/solutions/02_contains_duplicate_ii.js) |
| 03 | Valid Anagram | Easy | frequency count | [statement](03_Problems/01_Easy/03_valid_anagram.md) | [solution](03_Problems/solutions/03_valid_anagram.js) |
| 04 | Ransom Note | Easy | frequency count | [statement](03_Problems/01_Easy/04_ransom_note.md) | [solution](03_Problems/solutions/04_ransom_note.js) |
| 05 | Isomorphic Strings | Easy | two-way mapping | [statement](03_Problems/01_Easy/05_isomorphic_strings.md) | [solution](03_Problems/solutions/05_isomorphic_strings.js) |
| 06 | Word Pattern | Easy | two-way mapping | [statement](03_Problems/01_Easy/06_word_pattern.md) | [solution](03_Problems/solutions/06_word_pattern.js) |
| 07 | Intersection of Two Arrays | Easy | seen-set | [statement](03_Problems/01_Easy/07_intersection_of_two_arrays.md) | [solution](03_Problems/solutions/07_intersection_of_two_arrays.js) |
| 08 | Group Anagrams | Medium | group by canonical key | [statement](03_Problems/02_Medium/08_group_anagrams.md) | [solution](03_Problems/solutions/08_group_anagrams.js) |
| 09 | Top K Frequent Elements | Medium | frequency + bucket sort | [statement](03_Problems/02_Medium/09_top_k_frequent_elements.md) | [solution](03_Problems/solutions/09_top_k_frequent_elements.js) |
| 10 | Longest Consecutive Sequence | Medium | seen-set, start-of-run | [statement](03_Problems/02_Medium/10_longest_consecutive_sequence.md) | [solution](03_Problems/solutions/10_longest_consecutive_sequence.js) |
| 11 | Subarray Sum Equals K | Medium | prefix sum + hash | [statement](03_Problems/02_Medium/11_subarray_sum_equals_k.md) | [solution](03_Problems/solutions/11_subarray_sum_equals_k.js) |
| 12 | Longest Substring Without Repeating Characters | Medium | index map + window | [statement](03_Problems/02_Medium/12_longest_substring_without_repeating.md) | [solution](03_Problems/solutions/12_longest_substring_without_repeating.js) |
| 13 | Find All Anagrams in a String | Medium | frequency + window | [statement](03_Problems/02_Medium/13_find_all_anagrams.md) | [solution](03_Problems/solutions/13_find_all_anagrams.js) |
| 14 | 4Sum II | Medium | counting pairs | [statement](03_Problems/02_Medium/14_four_sum_ii.md) | [solution](03_Problems/solutions/14_four_sum_ii.js) |
| 15 | Design HashMap | Easy | implementation | [statement](03_Problems/01_Easy/15_design_hashmap.md) | [solution](03_Problems/solutions/15_design_hashmap.js) |

