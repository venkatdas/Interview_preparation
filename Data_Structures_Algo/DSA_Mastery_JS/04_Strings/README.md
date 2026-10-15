# Strings

**Prerequisites:** [Arrays](../03_Arrays/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 04_Strings` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `string_utils.js` |
| [03_Problems](03_Problems) | 17 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Reverse String | Easy | two pointers, in place | [statement](03_Problems/01_Easy/01_reverse_string.md) | [solution](03_Problems/solutions/01_reverse_string.js) |
| 02 | Valid Palindrome | Easy | two pointers, filtering | [statement](03_Problems/01_Easy/02_valid_palindrome.md) | [solution](03_Problems/solutions/02_valid_palindrome.js) |
| 03 | Valid Anagram | Easy | frequency table | [statement](03_Problems/01_Easy/03_valid_anagram.md) | [solution](03_Problems/solutions/03_valid_anagram.js) |
| 04 | First Unique Character in a String | Easy | frequency table, two passes | [statement](03_Problems/01_Easy/04_first_unique_character.md) | [solution](03_Problems/solutions/04_first_unique_character.js) |
| 05 | Longest Common Prefix | Easy | vertical scan | [statement](03_Problems/01_Easy/05_longest_common_prefix.md) | [solution](03_Problems/solutions/05_longest_common_prefix.js) |
| 06 | String to Integer | Medium | parsing state machine | [statement](03_Problems/02_Medium/06_string_to_integer_atoi.md) | [solution](03_Problems/solutions/06_string_to_integer_atoi.js) |
| 07 | Longest Palindromic Substring | Medium | expand around center | [statement](03_Problems/02_Medium/07_longest_palindromic_substring.md) | [solution](03_Problems/solutions/07_longest_palindromic_substring.js) |
| 08 | Group Anagrams | Medium | canonical key + Map | [statement](03_Problems/02_Medium/08_group_anagrams.md) | [solution](03_Problems/solutions/08_group_anagrams.js) |
| 09 | Encode and Decode Strings | Medium | length-prefix encoding | [statement](03_Problems/02_Medium/09_encode_and_decode_strings.md) | [solution](03_Problems/solutions/09_encode_and_decode_strings.js) |
| 10 | Reverse Words in a String | Medium | split / reverse / join, two pointers | [statement](03_Problems/02_Medium/10_reverse_words_in_a_string.md) | [solution](03_Problems/solutions/10_reverse_words_in_a_string.js) |
| 11 | String Compression | Medium | write pointer, run-length | [statement](03_Problems/02_Medium/11_string_compression.md) | [solution](03_Problems/solutions/11_string_compression.js) |
| 12 | Longest Repeating Character Replacement | Medium | sliding window (teaser) | [statement](03_Problems/02_Medium/12_longest_repeating_character_replacement.md) | [solution](03_Problems/solutions/12_longest_repeating_character_replacement.js) |
| 13 | Palindromic Substrings | Medium | expand around center | [statement](03_Problems/02_Medium/13_palindromic_substrings.md) | [solution](03_Problems/solutions/13_palindromic_substrings.js) |
| 14 | Multiply Strings | Medium | digit-array arithmetic | [statement](03_Problems/02_Medium/14_multiply_strings.md) | [solution](03_Problems/solutions/14_multiply_strings.js) |
| 15 | Roman to Integer & Integer to Roman | Easy | parsing, greedy | [statement](03_Problems/01_Easy/15_roman_to_integer_and_integer_to_roman.md) | [solution](03_Problems/solutions/15_roman_to_integer_and_integer_to_roman.js) |
| 16 | Zigzag Conversion | Medium | simulation, row buckets | [statement](03_Problems/02_Medium/16_zigzag_conversion.md) | [solution](03_Problems/solutions/16_zigzag_conversion.js) |
| 17 | Count and Say | Medium | run-length, iteration | [statement](03_Problems/02_Medium/17_count_and_say.md) | [solution](03_Problems/solutions/17_count_and_say.js) |

