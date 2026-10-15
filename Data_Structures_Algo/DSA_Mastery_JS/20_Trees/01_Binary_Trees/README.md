# Binary Trees

**Prerequisites:** [Recursion](../../12_Recursion/README.md), [Queues And Deques](../../17_Queues_And_Deques/README.md)

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
| [02_Implementations](02_Implementations) | `binary_tree.js` |
| [03_Problems](03_Problems) | 20 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Maximum Depth of Binary Tree | Easy | bottom-up / BFS | [statement](03_Problems/01_Easy/01_maximum_depth.md) | [solution](03_Problems/solutions/01_maximum_depth.js) |
| 02 | Minimum Depth of Binary Tree | Easy | BFS early exit | [statement](03_Problems/01_Easy/02_minimum_depth.md) | [solution](03_Problems/solutions/02_minimum_depth.js) |
| 03 | Same Tree | Easy | two-tree recursion | [statement](03_Problems/01_Easy/03_same_tree.md) | [solution](03_Problems/solutions/03_same_tree.js) |
| 04 | Invert Binary Tree | Easy | recursion / BFS | [statement](03_Problems/01_Easy/04_invert_binary_tree.md) | [solution](03_Problems/solutions/04_invert_binary_tree.js) |
| 05 | Symmetric Tree | Easy | two-tree recursion (mirrored) | [statement](03_Problems/01_Easy/05_symmetric_tree.md) | [solution](03_Problems/solutions/05_symmetric_tree.js) |
| 06 | Balanced Binary Tree | Easy | bottom-up with sentinel | [statement](03_Problems/01_Easy/06_balanced_binary_tree.md) | [solution](03_Problems/solutions/06_balanced_binary_tree.js) |
| 07 | Diameter of Binary Tree | Easy | return height, record best | [statement](03_Problems/01_Easy/07_diameter_of_binary_tree.md) | [solution](03_Problems/solutions/07_diameter_of_binary_tree.js) |
| 08 | Path Sum | Easy | top-down remaining sum | [statement](03_Problems/01_Easy/08_path_sum.md) | [solution](03_Problems/solutions/08_path_sum.js) |
| 09 | Subtree of Another Tree | Easy | isSame at every node / serialize | [statement](03_Problems/01_Easy/09_subtree_of_another_tree.md) | [solution](03_Problems/solutions/09_subtree_of_another_tree.js) |
| 10 | Binary Tree Level Order Traversal | Medium | BFS template | [statement](03_Problems/02_Medium/10_level_order_traversal.md) | [solution](03_Problems/solutions/10_level_order_traversal.js) |
| 11 | Binary Tree Zigzag Level Order Traversal | Medium | BFS, alternate direction | [statement](03_Problems/02_Medium/11_zigzag_level_order.md) | [solution](03_Problems/solutions/11_zigzag_level_order.js) |
| 12 | Binary Tree Right Side View | Medium | DFS right-first / BFS last | [statement](03_Problems/02_Medium/12_right_side_view.md) | [solution](03_Problems/solutions/12_right_side_view.js) |
| 13 | Count Good Nodes in Binary Tree | Medium | top-down max so far | [statement](03_Problems/02_Medium/13_count_good_nodes.md) | [solution](03_Problems/solutions/13_count_good_nodes.js) |
| 14 | Path Sum II | Medium | backtracking shared path | [statement](03_Problems/02_Medium/14_path_sum_ii.md) | [solution](03_Problems/solutions/14_path_sum_ii.js) |
| 15 | Flatten Binary Tree to Linked List | Medium | in-place rewiring (Morris-style) | [statement](03_Problems/02_Medium/15_flatten_binary_tree.md) | [solution](03_Problems/solutions/15_flatten_binary_tree.js) |
| 16 | Populating Next Right Pointers in Each Node | Medium | level links in O(1) space | [statement](03_Problems/02_Medium/16_populating_next_right_pointers.md) | [solution](03_Problems/solutions/16_populating_next_right_pointers.js) |
| 17 | Lowest Common Ancestor of a Binary Tree | Medium | bottom-up "return what you found" | [statement](03_Problems/02_Medium/17_lowest_common_ancestor.md) | [solution](03_Problems/solutions/17_lowest_common_ancestor.js) |
| 18 | Construct Binary Tree from Preorder and Inorder Traversal | Medium | divide by root, index map | [statement](03_Problems/02_Medium/18_construct_from_preorder_inorder.md) | [solution](03_Problems/solutions/18_construct_from_preorder_inorder.js) |
| 19 | Binary Tree Maximum Path Sum | Hard | return one arm, record two arms | [statement](03_Problems/03_Hard/19_maximum_path_sum.md) | [solution](03_Problems/solutions/19_maximum_path_sum.js) |
| 20 | Serialize and Deserialize Binary Tree | Hard | preorder with '#' | [statement](03_Problems/03_Hard/20_serialize_deserialize.md) | [solution](03_Problems/solutions/20_serialize_deserialize.js) |

