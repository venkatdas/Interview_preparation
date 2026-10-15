# Advanced Union-Find

**Prerequisites:** [Union Find Disjoint Set/01 Union Find Basics](../01_Union_Find_Basics/README.md)

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
| [03_Problems](03_Problems) | 4 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

**Assess yourself:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (model answers)

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Satisfiability of Equality Equations | Medium | two-pass constraints | [statement](03_Problems/02_Medium/01_satisfiability_of_equality_equations.md) | [solution](03_Problems/solutions/01_satisfiability_of_equality_equations.js) |
| 02 | Lexicographically Smallest Equivalent String | Medium | chosen representative (smallest letter) | [statement](03_Problems/02_Medium/02_lexicographically_smallest_equivalent_string.md) | [solution](03_Problems/solutions/02_lexicographically_smallest_equivalent_string.js) |
| 03 | Evaluate Division | Medium | weighted union-find (ratios) | [statement](03_Problems/02_Medium/03_evaluate_division.md) | [solution](03_Problems/solutions/03_evaluate_division.js) |
| 04 | Number of Islands II | Hard | online union-find on a grid with a Map | [statement](03_Problems/03_Hard/04_number_of_islands_ii.md) | [solution](03_Problems/solutions/04_number_of_islands_ii.js) |

