# Fenwick Tree (Binary Indexed Tree)

**Prerequisites:** [Bit Manipulation](../../14_Bit_Manipulation/README.md), [Prefix Sums And Difference Arrays](../../08_Prefix_Sums_And_Difference_Arrays/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 34_Range_Query_Data_Structures/02_Fenwick_Tree/tests/fenwick_tree.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `fenwick_tree.js` |
| [03_Problems](03_Problems) | 5 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `fenwick_tree.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Range Sum Query - Mutable, Fenwick version | Medium | prefix sums + point updates | [statement](03_Problems/02_Medium/01_range_sum_query_mutable_bit.md) | [solution](03_Problems/solutions/01_range_sum_query_mutable_bit.js) |
| 02 | Count of Smaller Numbers After Self | Hard | counting BIT over values, sweep right to left | [statement](03_Problems/03_Hard/02_count_of_smaller_numbers_after_self.md) | [solution](03_Problems/solutions/02_count_of_smaller_numbers_after_self.js) |
| 03 | Reverse Pairs | Hard | compress v and 2v together, counting BIT | [statement](03_Problems/03_Hard/03_reverse_pairs.md) | [solution](03_Problems/solutions/03_reverse_pairs.js) |
| 04 | Create Sorted Array through Instructions | Hard | counting BIT, smaller & greater per insert | [statement](03_Problems/03_Hard/04_create_sorted_array_through_instructions.md) | [solution](03_Problems/solutions/04_create_sorted_array_through_instructions.js) |
| 05 | Count Good Triplets in an Array | Hard | positions mapping + left/right counts | [statement](03_Problems/03_Hard/05_count_good_triplets_in_an_array.md) | [solution](03_Problems/solutions/05_count_good_triplets_in_an_array.js) |

