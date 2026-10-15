# N-ary Trees and Miscellaneous

**Prerequisites:** [Trees/01 Binary Trees](../01_Binary_Trees/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 20_Trees` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `n_ary_tree.js` |
| [03_Problems](03_Problems) | 7 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | N-ary Tree Preorder Traversal | Easy | recursion / explicit stack | [statement](03_Problems/01_Easy/01_n_ary_preorder.md) | [solution](03_Problems/solutions/01_n_ary_preorder.js) |
| 02 | Maximum Depth of N-ary Tree | Easy | for-child recursion | [statement](03_Problems/01_Easy/02_max_depth_n_ary.md) | [solution](03_Problems/solutions/02_max_depth_n_ary.js) |
| 03 | N-ary Tree Level Order Traversal | Medium | BFS current/next | [statement](03_Problems/02_Medium/03_n_ary_level_order.md) | [solution](03_Problems/solutions/03_n_ary_level_order.js) |
| 04 | Clone N-ary Tree | Medium | copy with Map | [statement](03_Problems/02_Medium/04_clone_n_ary_tree.md) | [solution](03_Problems/solutions/04_clone_n_ary_tree.js) |
| 05 | Find Duplicate Subtrees | Medium | subtree hashing | [statement](03_Problems/02_Medium/05_find_duplicate_subtrees.md) | [solution](03_Problems/solutions/05_find_duplicate_subtrees.js) |
| 06 | All Nodes Distance K in Binary Tree | Medium | parent map + BFS | [statement](03_Problems/02_Medium/06_all_nodes_distance_k.md) | [solution](03_Problems/solutions/06_all_nodes_distance_k.js) |
| 07 | Vertical Order Traversal of a Binary Tree | Hard | grid coordinates + sort | [statement](03_Problems/03_Hard/07_vertical_order_traversal.md) | [solution](03_Problems/solutions/07_vertical_order_traversal.js) |

