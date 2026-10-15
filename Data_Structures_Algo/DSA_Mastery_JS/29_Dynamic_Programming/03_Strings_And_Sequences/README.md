# DP on Strings and Sequences

**String / sequence DP** lines two inputs up in a 2D table where cell `(i, j)` answers the question for the first `i` items of one and the first `j` of the other (LCS, edit distance, pattern matching), or works on one sequence with "best answer ending at i" (LIS) or an interval `[l, r]` (palindromes). It is the most frequently asked DP family after 1D DP.

**Prerequisites:** [1D DP](../01_One_Dimensional_DP/README.md), the [DP overview](../01_Concepts/OVERVIEW.md) (5-step framework), [Strings](../../04_Strings/README.md), and [Binary Search](../../10_Searching/README.md) for the O(n log n) LIS.

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. This sub-topic has no separate implementation file: the reusable DP helpers live in [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) and the big-picture guide is [../01_Concepts/OVERVIEW.md](../01_Concepts/OVERVIEW.md). Every solution file shows brute force → memo → tabulation → optimized.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 29_Dynamic_Programming/03_Strings_And_Sequences/tests/strings_and_sequences.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) | shared DP framework (memo / tabulation helpers) used by all DP sub-topics |
| [03_Problems](03_Problems) | 16 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `strings_and_sequences.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Longest Common Subsequence | Medium | two-string table + reconstruct | [statement](03_Problems/02_Medium/01_longest_common_subsequence.md) | [solution](03_Problems/solutions/01_longest_common_subsequence.js) |
| 02 | Longest Common Substring | Medium | two-string table, reset on mismatch | [statement](03_Problems/02_Medium/02_longest_common_substring.md) | [solution](03_Problems/solutions/02_longest_common_substring.js) |
| 03 | Longest Increasing Subsequence | Medium | "ends at i" O(n^2), patience O(n log n) | [statement](03_Problems/02_Medium/03_longest_increasing_subsequence.md) | [solution](03_Problems/solutions/03_longest_increasing_subsequence.js) |
| 04 | Number of Longest Increasing Subsequence | Medium | LIS with length + count | [statement](03_Problems/02_Medium/04_number_of_longest_increasing_subsequence.md) | [solution](03_Problems/solutions/04_number_of_longest_increasing_subsequence.js) |
| 05 | Longest Palindromic Substring | Medium | interval DP, expand around center | [statement](03_Problems/02_Medium/05_longest_palindromic_substring.md) | [solution](03_Problems/solutions/05_longest_palindromic_substring.js) |
| 06 | Longest Palindromic Subsequence | Medium | interval DP | [statement](03_Problems/02_Medium/06_longest_palindromic_subsequence.md) | [solution](03_Problems/solutions/06_longest_palindromic_subsequence.js) |
| 07 | Minimum Insertion Steps to Make a String Palindrome | Hard | interval DP, n - LPS | [statement](03_Problems/03_Hard/07_minimum_insertions_to_make_palindrome.md) | [solution](03_Problems/solutions/07_minimum_insertions_to_make_palindrome.js) |
| 08 | Delete Operation for Two Strings | Medium | LCS variant | [statement](03_Problems/02_Medium/08_delete_operation_for_two_strings.md) | [solution](03_Problems/solutions/08_delete_operation_for_two_strings.js) |
| 09 | Uncrossed Lines | Medium | LCS in disguise | [statement](03_Problems/02_Medium/09_uncrossed_lines.md) | [solution](03_Problems/solutions/09_uncrossed_lines.js) |
| 10 | Edit Distance | Medium | three-operation table | [statement](03_Problems/02_Medium/10_edit_distance.md) | [solution](03_Problems/solutions/10_edit_distance.js) |
| 11 | Distinct Subsequences | Hard | counting table, one-row right-to-left | [statement](03_Problems/03_Hard/11_distinct_subsequences.md) | [solution](03_Problems/solutions/11_distinct_subsequences.js) |
| 12 | Interleaving String | Medium | boolean table (i, j) with k = i + j | [statement](03_Problems/02_Medium/12_interleaving_string.md) | [solution](03_Problems/solutions/12_interleaving_string.js) |
| 13 | Shortest Common Supersequence | Hard | LCS + reconstruct the string | [statement](03_Problems/03_Hard/13_shortest_common_supersequence.md) | [solution](03_Problems/solutions/13_shortest_common_supersequence.js) |
| 14 | Russian Doll Envelopes | Hard | sort + 2D LIS | [statement](03_Problems/03_Hard/14_russian_doll_envelopes.md) | [solution](03_Problems/solutions/14_russian_doll_envelopes.js) |
| 15 | Wildcard Matching | Hard | pattern table with `*` | [statement](03_Problems/03_Hard/15_wildcard_matching.md) | [solution](03_Problems/solutions/15_wildcard_matching.js) |
| 16 | Regular Expression Matching | Hard | pattern table with `x*` | [statement](03_Problems/03_Hard/16_regular_expression_matching.md) | [solution](03_Problems/solutions/16_regular_expression_matching.js) |

