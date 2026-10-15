# Advanced Tree Techniques (Euler Tour, Rerooting, Centroid, HLD, Diameter, Isomorphism)

> **Level: Advanced.** **How often in interviews:** tree diameter, Minimum Height Trees and rerooting DP ("answer for every root") come up fairly often at top companies, usually as Medium or Hard. Euler tour + Fenwick, centroid decomposition and heavy-light decomposition are rare in interviews and mostly belong to competitive programming. Learn them for the ideas (turning a tree into an array, splitting at the middle) more than to code them under pressure.

Trees show up everywhere in frontend work (the DOM, component trees, file explorers). This sub-topic teaches the tricks that answer *many* questions on one tree fast: flattening a tree into an array so subtree questions become range questions, reusing work when you move the root, splitting a tree at its middle, and cutting paths into a few chains. Binary lifting (k-th ancestor, LCA) is already taught in [01_Classic_Techniques](../01_Classic_Techniques/README.md); here it is reused, not repeated.

**Prerequisites:** [Binary Trees](../../20_Trees/01_Binary_Trees/README.md), [N-ary Trees](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md), [Graph Traversal (BFS/DFS)](../../24_Graph_Traversal/README.md), [Fenwick Tree](../../34_Range_Query_Data_Structures/02_Fenwick_Tree/README.md), [Union-Find](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md), [Classic Techniques (binary lifting)](../01_Classic_Techniques/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open [02_Implementations/tree_techniques.js](02_Implementations/tree_techniques.js) and run it: `node 02_Implementations/tree_techniques.js`. Then close it and re-implement diameter, rerooting and the Euler tour from memory.
3. Solve the problems in order: Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/tree_techniques.test.js` (from this folder).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | diameter, centers, Euler tour + Fenwick, rerooting DP, centroid decomposition, heavy-light decomposition, canonical hashing, binary lifting (linked) |
| [02_Implementations](02_Implementations/tree_techniques.js) | `tree_techniques.js` (all techniques, randomized self-test against brute force) |
| [03_Problems](03_Problems) | 7 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests/tree_techniques.test.js) | node:test suite for the implementation and several solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Tree Diameter | Medium | two BFS | [statement](03_Problems/02_Medium/01_tree_diameter.md) | [solution](03_Problems/solutions/01_tree_diameter.js) |
| 02 | Minimum Height Trees | Medium | peel leaves / tree centers | [statement](03_Problems/02_Medium/02_minimum_height_trees.md) | [solution](03_Problems/solutions/02_minimum_height_trees.js) |
| 03 | Count Subtree Sums with Updates | Medium | Euler tour + Fenwick | [statement](03_Problems/02_Medium/03_count_subtree_sums_with_updates.md) | [solution](03_Problems/solutions/03_count_subtree_sums_with_updates.js) |
| 04 | Kth Ancestor of a Tree Node | Hard | binary lifting (reused) | [statement](03_Problems/03_Hard/04_kth_ancestor_of_a_tree_node.md) | [solution](03_Problems/solutions/04_kth_ancestor_of_a_tree_node.js) |
| 05 | Path Sum Queries with Updates | Hard | heavy-light decomposition | [statement](03_Problems/03_Hard/05_path_sum_queries_with_updates.md) | [solution](03_Problems/solutions/05_path_sum_queries_with_updates.js) |
| 06 | Sum of Distances in Tree | Hard | rerooting DP | [statement](03_Problems/03_Hard/06_sum_of_distances_in_tree.md) | [solution](03_Problems/solutions/06_sum_of_distances_in_tree.js) |
| 07 | Number of Good Paths | Hard | sort + union-find on a tree | [statement](03_Problems/03_Hard/07_number_of_good_paths.md) | [solution](03_Problems/solutions/07_number_of_good_paths.js) |
