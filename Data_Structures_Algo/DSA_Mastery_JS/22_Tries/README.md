# Tries

**Prerequisites:** [Trees/01 Binary Trees](../20_Trees/01_Binary_Trees/README.md), [Hashing](../05_Hashing/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 22_Tries` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `binary_trie.js`, `trie.js` |
| [03_Problems](03_Problems) | 11 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Implement Trie | Medium | core trie | [statement](03_Problems/02_Medium/01_implement_trie.md) | [solution](03_Problems/solutions/01_implement_trie.js) |
| 02 | Design Add and Search Words Data Structure | Medium | trie + wildcard DFS | [statement](03_Problems/02_Medium/02_add_and_search_words.md) | [solution](03_Problems/solutions/02_add_and_search_words.js) |
| 03 | Longest Word in Dictionary | Medium | DFS through end flags | [statement](03_Problems/02_Medium/03_longest_word_in_dictionary.md) | [solution](03_Problems/solutions/03_longest_word_in_dictionary.js) |
| 04 | Replace Words | Medium | stop at first end flag | [statement](03_Problems/02_Medium/04_replace_words.md) | [solution](03_Problems/solutions/04_replace_words.js) |
| 05 | Map Sum Pairs | Medium | values on nodes (prefix sums) | [statement](03_Problems/02_Medium/05_map_sum_pairs.md) | [solution](03_Problems/solutions/05_map_sum_pairs.js) |
| 06 | Implement Magic Dictionary | Medium | DFS with edit budget | [statement](03_Problems/02_Medium/06_implement_magic_dictionary.md) | [solution](03_Problems/solutions/06_implement_magic_dictionary.js) |
| 07 | Search Suggestions System | Medium | autocomplete, sorted DFS | [statement](03_Problems/02_Medium/07_search_suggestions_system.md) | [solution](03_Problems/solutions/07_search_suggestions_system.js) |
| 08 | Maximum XOR of Two Numbers in an Array | Medium | binary trie | [statement](03_Problems/02_Medium/08_maximum_xor_two_numbers.md) | [solution](03_Problems/solutions/08_maximum_xor_two_numbers.js) |
| 09 | Stream of Characters | Hard | reversed trie | [statement](03_Problems/03_Hard/09_stream_of_characters.md) | [solution](03_Problems/solutions/09_stream_of_characters.js) |
| 10 | Word Search II | Hard | trie + backtracking | [statement](03_Problems/03_Hard/10_word_search_ii.md) | [solution](03_Problems/solutions/10_word_search_ii.js) |
| 11 | Palindrome Pairs | Hard | reversed trie + palindrome checks | [statement](03_Problems/03_Hard/11_palindrome_pairs.md) | [solution](03_Problems/solutions/11_palindrome_pairs.js) |

