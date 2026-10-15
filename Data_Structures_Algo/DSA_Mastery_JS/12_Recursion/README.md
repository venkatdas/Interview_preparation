# Recursion

Recursion means solving a problem by solving smaller copies of the same problem and combining
their answers. This topic sits between [Sorting](../11_Sorting/README.md) and
[Backtracking](../13_Backtracking/README.md). It teaches how to *decompose* problems
recursively: first + rest, multiple recursion, recursion on arrays, strings, linked lists and
trees, divide-and-conquer halving, memoization (the bridge to dynamic programming), mutual
recursion, helpers with accumulators, and generating every possible structure. The absolute
basics live in [00_Foundations/03_Recursion_Fundamentals](../00_Foundations/03_Recursion_Fundamentals/README.md),
and the classic warm-ups (factorial, Fibonacci, Hanoi) are in
[13_Backtracking/02_Implementations/recursion_basics.js](../13_Backtracking/02_Implementations/recursion_basics.js);
this topic builds on both without repeating them.

**Prerequisites:** [Recursion Fundamentals](../00_Foundations/03_Recursion_Fundamentals/README.md), [Linked Lists](../15_Linked_Lists/README.md), [Sorting](../11_Sorting/README.md)

**Leads to:** [Backtracking](../13_Backtracking/README.md), [Binary Trees](../20_Trees/01_Binary_Trees/README.md), [Divide and Conquer](../30_Divide_And_Conquer/README.md), [Dynamic Programming](../29_Dynamic_Programming/01_Concepts/OVERVIEW.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom. Learn the 5-step recipe (promise, base case, shrink, combine, measure) by heart.
2. Open [02_Implementations/recursion_patterns.js](02_Implementations/recursion_patterns.js) and run it: `node 02_Implementations/recursion_patterns.js`. For each pattern, close the file and re-write the helper from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each page has the statement and staged hints; the solution is in a separate file. Before coding, write the function's promise as a comment.
4. Answer [INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [QUIZ.md](04_Interview_And_Assessment/QUIZ.md) and tick the mastery checklist.
5. Run this topic's tests: `node --test 12_Recursion/tests/recursion.test.js` (or `npm run test:topic 12_Recursion` from the curriculum root).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | the 16-step teaching guide: intuition, call stack and recursion-tree visuals, recipe, pseudocode, dry runs, complexity, recursion vs iteration, mistakes, 12 templates, recognition clues, interview talk track |
| [02_Implementations](02_Implementations/recursion_patterns.js) | `recursion_patterns.js` — one helper per pattern (first+rest, multiple recursion, arrays/strings, lists, trees, divide and conquer, memoize, trampoline, mutual recursion, accumulators, generating structures) |
| [03_Problems](03_Problems) | 14 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | 14 interview questions with model answers, a 14-question quiz and a mastery checklist |
| [tests](tests/recursion.test.js) | node:test suite for the implementation and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Fibonacci Number with Memoization | Easy | multiple recursion + memo | [statement](03_Problems/01_Easy/01_fibonacci_memo.md) | [solution](03_Problems/solutions/01_fibonacci_memo.js) |
| 02 | Power of Three / Power of Four | Easy | shrink by a factor | [statement](03_Problems/01_Easy/02_power_of_three_four.md) | [solution](03_Problems/solutions/02_power_of_three_four.js) |
| 03 | Reverse Linked List (recursive) | Easy | linked list recursion | [statement](03_Problems/01_Easy/03_reverse_linked_list.md) | [solution](03_Problems/solutions/03_reverse_linked_list.js) |
| 04 | Merge Two Sorted Lists (recursive) | Easy | linked list recursion | [statement](03_Problems/01_Easy/04_merge_two_sorted_lists.md) | [solution](03_Problems/solutions/04_merge_two_sorted_lists.js) |
| 05 | Pascal's Triangle II | Easy | recursion on previous row | [statement](03_Problems/01_Easy/05_pascals_triangle_ii.md) | [solution](03_Problems/solutions/05_pascals_triangle_ii.js) |
| 06 | Swap Nodes in Pairs | Medium | linked list, step of 2 | [statement](03_Problems/02_Medium/06_swap_nodes_in_pairs.md) | [solution](03_Problems/solutions/06_swap_nodes_in_pairs.js) |
| 07 | K-th Symbol in Grammar | Medium | recurse on the parent | [statement](03_Problems/02_Medium/07_kth_symbol_in_grammar.md) | [solution](03_Problems/solutions/07_kth_symbol_in_grammar.js) |
| 08 | Count Good Numbers | Medium | fast power | [statement](03_Problems/02_Medium/08_count_good_numbers.md) | [solution](03_Problems/solutions/08_count_good_numbers.js) |
| 09 | Decode String (recursive) | Medium | recursive descent | [statement](03_Problems/02_Medium/09_decode_string_recursive.md) | [solution](03_Problems/solutions/09_decode_string_recursive.js) |
| 10 | Different Ways to Add Parentheses | Medium | divide and conquer + memo | [statement](03_Problems/02_Medium/10_different_ways_to_add_parentheses.md) | [solution](03_Problems/solutions/10_different_ways_to_add_parentheses.js) |
| 11 | Unique Binary Search Trees II | Medium | generate structures | [statement](03_Problems/02_Medium/11_unique_binary_search_trees_ii.md) | [solution](03_Problems/solutions/11_unique_binary_search_trees_ii.js) |
| 12 | Strobogrammatic Number II | Medium | build inside out | [statement](03_Problems/02_Medium/12_strobogrammatic_number_ii.md) | [solution](03_Problems/solutions/12_strobogrammatic_number_ii.js) |
| 13 | Predict the Winner | Medium | minimax + memo | [statement](03_Problems/02_Medium/13_predict_the_winner.md) | [solution](03_Problems/solutions/13_predict_the_winner.js) |
| 14 | Mini Lisp Evaluator (original) | Hard | mutual recursion + scopes | [statement](03_Problems/03_Hard/14_mini_lisp_evaluator.md) | [solution](03_Problems/solutions/14_mini_lisp_evaluator.js) |
