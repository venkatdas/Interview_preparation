# Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array)

**Prerequisites:** [Strings](../04_Strings/README.md), [Hashing](../05_Hashing/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 33_String_Algorithms_Advanced/tests/string_algorithms.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `string_algorithms.js` |
| [03_Problems](03_Problems) | 9 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `string_algorithms.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Find the Index of the First Occurrence in a String | Easy | KMP search | [statement](03_Problems/01_Easy/01_find_index_of_first_occurrence.md) | [solution](03_Problems/solutions/01_find_index_of_first_occurrence.js) |
| 02 | Repeated Substring Pattern | Easy | LPS period trick | [statement](03_Problems/01_Easy/02_repeated_substring_pattern.md) | [solution](03_Problems/solutions/02_repeated_substring_pattern.js) |
| 03 | Repeated String Match | Medium | bound copies + KMP | [statement](03_Problems/02_Medium/03_repeated_string_match.md) | [solution](03_Problems/solutions/03_repeated_string_match.js) |
| 04 | Longest Happy Prefix | Hard | lps[n-1] | [statement](03_Problems/03_Hard/04_longest_happy_prefix.md) | [solution](03_Problems/solutions/04_longest_happy_prefix.js) |
| 05 | Longest Palindromic Substring | Medium | Manacher (and expand-around-center) | [statement](03_Problems/02_Medium/05_longest_palindromic_substring.md) | [solution](03_Problems/solutions/05_longest_palindromic_substring.js) |
| 06 | Shortest Palindrome | Hard | KMP on s + '#' + reverse(s) | [statement](03_Problems/03_Hard/06_shortest_palindrome.md) | [solution](03_Problems/solutions/06_shortest_palindrome.js) |
| 07 | Longest Duplicate Substring | Hard | binary search + rolling hash | [statement](03_Problems/03_Hard/07_longest_duplicate_substring.md) | [solution](03_Problems/solutions/07_longest_duplicate_substring.js) |
| 08 | Distinct Echo Substrings | Hard | prefix hashes, O(1) substring equality | [statement](03_Problems/03_Hard/08_distinct_echo_substrings.md) | [solution](03_Problems/solutions/08_distinct_echo_substrings.js) |
| 09 | Sum of Scores of Built Strings | Hard | Z-function | [statement](03_Problems/03_Hard/09_sum_of_scores_of_built_strings.md) | [solution](03_Problems/solutions/09_sum_of_scores_of_built_strings.js) |

