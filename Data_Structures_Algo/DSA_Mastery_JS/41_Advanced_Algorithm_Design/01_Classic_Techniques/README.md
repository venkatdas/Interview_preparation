# Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition)

**Prerequisites:** [Arrays](../../03_Arrays/README.md), [Trees](../../20_Trees)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 41_Advanced_Algorithm_Design/01_Classic_Techniques/tests/classic_techniques.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `classic_techniques.js` |
| [03_Problems](03_Problems) | 10 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `classic_techniques.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Majority Element II | Medium | Boyer-Moore, k = n/3 | [statement](03_Problems/02_Medium/01_majority_element_ii.md) | [solution](03_Problems/solutions/01_majority_element_ii.js) |
| 02 | Find the Duplicate Number | Medium | Floyd on an array (+ binary search on value) | [statement](03_Problems/02_Medium/02_find_the_duplicate_number.md) | [solution](03_Problems/solutions/02_find_the_duplicate_number.js) |
| 03 | Shuffle an Array | Medium | Fisher-Yates | [statement](03_Problems/02_Medium/03_shuffle_an_array.md) | [solution](03_Problems/solutions/03_shuffle_an_array.js) |
| 04 | Linked List Random Node | Medium | reservoir sampling, k = 1 | [statement](03_Problems/02_Medium/04_linked_list_random_node.md) | [solution](03_Problems/solutions/04_linked_list_random_node.js) |
| 05 | Random Pick Index | Medium | reservoir sampling over matches | [statement](03_Problems/02_Medium/05_random_pick_index.md) | [solution](03_Problems/solutions/05_random_pick_index.js) |
| 06 | Range Sum with Sqrt Decomposition | Medium | sqrt decomposition | [statement](03_Problems/02_Medium/06_range_sum_sqrt_decomposition.md) | [solution](03_Problems/solutions/06_range_sum_sqrt_decomposition.js) |
| 07 | Lowest Common Ancestor with Binary Lifting | Hard | binary lifting + depth equalisation | [statement](03_Problems/03_Hard/07_lowest_common_ancestor_binary_lifting.md) | [solution](03_Problems/solutions/07_lowest_common_ancestor_binary_lifting.js) |
| 08 | Kth Ancestor of a Tree Node | Hard | binary lifting | [statement](03_Problems/03_Hard/08_kth_ancestor_of_a_tree_node.md) | [solution](03_Problems/solutions/08_kth_ancestor_of_a_tree_node.js) |
| 09 | Closest Subsequence Sum | Hard | meet in the middle | [statement](03_Problems/03_Hard/09_closest_subsequence_sum.md) | [solution](03_Problems/solutions/09_closest_subsequence_sum.js) |
| 10 | Partition Array Into Two Arrays to Minimize Sum Difference | Hard | meet in the middle, grouped by size | [statement](03_Problems/03_Hard/10_partition_array_minimize_sum_difference.md) | [solution](03_Problems/solutions/10_partition_array_minimize_sum_difference.js) |

