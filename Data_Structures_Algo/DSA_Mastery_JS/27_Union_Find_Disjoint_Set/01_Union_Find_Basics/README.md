# Union-Find Basics

**Prerequisites:** [Graphs](../../23_Graphs/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 27_Union_Find_Disjoint_Set` (from the curriculum root).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `union_find.js` |
| [03_Problems](03_Problems) | 10 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

**Assess yourself:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (model answers)

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Number of Connected Components in an Undirected Graph | Medium | count via unions | [statement](03_Problems/02_Medium/01_number_of_connected_components.md) | [solution](03_Problems/solutions/01_number_of_connected_components.js) |
| 02 | Graph Valid Tree | Medium | cycle + count === 1 | [statement](03_Problems/02_Medium/02_graph_valid_tree.md) | [solution](03_Problems/solutions/02_graph_valid_tree.js) |
| 03 | Redundant Connection | Medium | first failed union | [statement](03_Problems/02_Medium/03_redundant_connection.md) | [solution](03_Problems/solutions/03_redundant_connection.js) |
| 04 | Number of Provinces | Medium | adjacency matrix unions | [statement](03_Problems/02_Medium/04_number_of_provinces.md) | [solution](03_Problems/solutions/04_number_of_provinces.js) |
| 05 | Satisfiability of Equality Equations | Medium | union equals, check not-equals | [statement](03_Problems/02_Medium/05_satisfiability_of_equality_equations.md) | [solution](03_Problems/solutions/05_satisfiability_of_equality_equations.js) |
| 06 | Accounts Merge | Medium | map-based UF on emails | [statement](03_Problems/02_Medium/06_accounts_merge.md) | [solution](03_Problems/solutions/06_accounts_merge.js) |
| 07 | Most Stones Removed with Same Row or Column | Medium | union rows and columns | [statement](03_Problems/02_Medium/07_most_stones_removed.md) | [solution](03_Problems/solutions/07_most_stones_removed.js) |
| 08 | Smallest String With Swaps | Medium | group indices, sort within group | [statement](03_Problems/02_Medium/08_smallest_string_with_swaps.md) | [solution](03_Problems/solutions/08_smallest_string_with_swaps.js) |
| 09 | Longest Consecutive Sequence | Medium | union x with x+1 | [statement](03_Problems/02_Medium/09_longest_consecutive_sequence.md) | [solution](03_Problems/solutions/09_longest_consecutive_sequence.js) |
| 10 | Number of Islands II | Hard | dynamic components on a grid | [statement](03_Problems/03_Hard/10_number_of_islands_ii.md) | [solution](03_Problems/solutions/10_number_of_islands_ii.js) |

