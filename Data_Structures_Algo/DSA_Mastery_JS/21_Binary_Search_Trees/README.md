# Binary Search Trees

**Prerequisites:** [Trees/01 Binary Trees](../20_Trees/01_Binary_Trees/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 21_Binary_Search_Trees` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `avl_tree.js`, `bst.js` |
| [03_Problems](03_Problems) | 12 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Search in a Binary Search Tree | Easy | prune by ordering | [statement](03_Problems/01_Easy/01_search_in_bst.md) | [solution](03_Problems/solutions/01_search_in_bst.js) |
| 02 | Insert into a Binary Search Tree | Medium | walk down, attach leaf | [statement](03_Problems/02_Medium/02_insert_into_bst.md) | [solution](03_Problems/solutions/02_insert_into_bst.js) |
| 03 | Range Sum of BST | Easy | prune by ordering | [statement](03_Problems/01_Easy/03_range_sum_of_bst.md) | [solution](03_Problems/solutions/03_range_sum_of_bst.js) |
| 04 | Convert Sorted Array to Binary Search Tree | Easy | middle = root | [statement](03_Problems/01_Easy/04_sorted_array_to_bst.md) | [solution](03_Problems/solutions/04_sorted_array_to_bst.js) |
| 05 | Two Sum IV - Input is a BST | Easy | inorder + two pointers | [statement](03_Problems/01_Easy/05_two_sum_iv_bst.md) | [solution](03_Problems/solutions/05_two_sum_iv_bst.js) |
| 06 | Lowest Common Ancestor of a Binary Search Tree | Medium | split point by ordering | [statement](03_Problems/02_Medium/06_lowest_common_ancestor_bst.md) | [solution](03_Problems/solutions/06_lowest_common_ancestor_bst.js) |
| 07 | Validate Binary Search Tree | Medium | bounds passed down | [statement](03_Problems/02_Medium/07_validate_bst.md) | [solution](03_Problems/solutions/07_validate_bst.js) |
| 08 | Kth Smallest Element in a BST | Medium | iterative inorder, early stop | [statement](03_Problems/02_Medium/08_kth_smallest_in_bst.md) | [solution](03_Problems/solutions/08_kth_smallest_in_bst.js) |
| 09 | Inorder Successor in BST | Medium | remember the last left turn | [statement](03_Problems/02_Medium/09_inorder_successor_in_bst.md) | [solution](03_Problems/solutions/09_inorder_successor_in_bst.js) |
| 10 | Trim a Binary Search Tree | Medium | return the new subtree | [statement](03_Problems/02_Medium/10_trim_a_bst.md) | [solution](03_Problems/solutions/10_trim_a_bst.js) |
| 11 | Delete Node in a BST | Medium | three delete cases | [statement](03_Problems/02_Medium/11_delete_node_in_bst.md) | [solution](03_Problems/solutions/11_delete_node_in_bst.js) |
| 12 | Recover Binary Search Tree | Medium | inorder dips (Morris optional) | [statement](03_Problems/02_Medium/12_recover_bst.md) | [solution](03_Problems/solutions/12_recover_bst.js) |

