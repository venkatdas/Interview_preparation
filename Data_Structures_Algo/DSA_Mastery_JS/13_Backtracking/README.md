# Backtracking

**Prerequisites:** [Recursion](../12_Recursion/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 13_Backtracking` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `backtracking_template.js`, `recursion_basics.js` |
| [03_Problems](03_Problems) | 16 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Subsets | Medium | start index, record every node | [statement](03_Problems/02_Medium/01_subsets.md) | [solution](03_Problems/solutions/01_subsets.js) |
| 02 | Subsets II | Medium | sort + skip duplicates | [statement](03_Problems/02_Medium/02_subsets_ii.md) | [solution](03_Problems/solutions/02_subsets_ii.js) |
| 03 | Permutations | Medium | used array | [statement](03_Problems/02_Medium/03_permutations.md) | [solution](03_Problems/solutions/03_permutations.js) |
| 04 | Permutations II | Medium | used array + skip duplicates | [statement](03_Problems/02_Medium/04_permutations_ii.md) | [solution](03_Problems/solutions/04_permutations_ii.js) |
| 05 | Combinations | Medium | start index, fixed size k, pruning | [statement](03_Problems/02_Medium/05_combinations.md) | [solution](03_Problems/solutions/05_combinations.js) |
| 06 | Combination Sum | Medium | reuse allowed (pass i), prune on remaining | [statement](03_Problems/02_Medium/06_combination_sum.md) | [solution](03_Problems/solutions/06_combination_sum.js) |
| 07 | Combination Sum II | Medium | no reuse, sort + skip duplicates | [statement](03_Problems/02_Medium/07_combination_sum_ii.md) | [solution](03_Problems/solutions/07_combination_sum_ii.js) |
| 08 | Letter Combinations of a Phone Number | Medium | build string position by position | [statement](03_Problems/02_Medium/08_letter_combinations_phone.md) | [solution](03_Problems/solutions/08_letter_combinations_phone.js) |
| 09 | Generate Parentheses | Medium | constrained string building | [statement](03_Problems/02_Medium/09_generate_parentheses.md) | [solution](03_Problems/solutions/09_generate_parentheses.js) |
| 10 | Palindrome Partitioning | Medium | partition with cut positions | [statement](03_Problems/02_Medium/10_palindrome_partitioning.md) | [solution](03_Problems/solutions/10_palindrome_partitioning.js) |
| 11 | Word Search | Medium | grid DFS mark/unmark | [statement](03_Problems/02_Medium/11_word_search.md) | [solution](03_Problems/solutions/11_word_search.js) |
| 12 | N-Queens | Hard | row by row with attacked sets | [statement](03_Problems/03_Hard/12_n_queens.md) | [solution](03_Problems/solutions/12_n_queens.js) |
| 13 | Sudoku Solver | Hard | find one solution, return boolean | [statement](03_Problems/03_Hard/13_sudoku_solver.md) | [solution](03_Problems/solutions/13_sudoku_solver.js) |
| 14 | Restore IP Addresses | Medium | string partition with 4 parts | [statement](03_Problems/02_Medium/14_restore_ip_addresses.md) | [solution](03_Problems/solutions/14_restore_ip_addresses.js) |
| 15 | Expression Add Operators | Hard | string building with running value + last operand | [statement](03_Problems/03_Hard/15_expression_add_operators.md) | [solution](03_Problems/solutions/15_expression_add_operators.js) |
| 16 | Word Break II | Hard | backtracking + memoization | [statement](03_Problems/03_Hard/16_word_break_ii.md) | [solution](03_Problems/solutions/16_word_break_ii.js) |

