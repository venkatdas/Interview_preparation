# Interval DP

**Prerequisites:** [Dynamic Programming/03 Strings And Sequences](../03_Strings_And_Sequences/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. This sub-topic has no separate implementation file: the reusable DP helpers live in [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) and the big-picture guide is [../01_Concepts/OVERVIEW.md](../01_Concepts/OVERVIEW.md). Every solution file shows brute force → memo → tabulation → optimized.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 29_Dynamic_Programming/05_Interval_DP/tests/interval_dp.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) | shared DP framework (memo / tabulation helpers) used by all DP sub-topics |
| [03_Problems](03_Problems) | 8 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `interval_dp.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Predict the Winner / Stone Game | Medium | game DP, score difference | [statement](03_Problems/02_Medium/01_predict_the_winner_stone_game.md) | [solution](03_Problems/solutions/01_predict_the_winner_stone_game.js) |
| 02 | Matrix Chain Multiplication | Medium | min-cost split | [statement](03_Problems/02_Medium/02_matrix_chain_multiplication.md) | [solution](03_Problems/solutions/02_matrix_chain_multiplication.js) |
| 03 | Minimum Score Triangulation of Polygon | Medium | min-cost split (boundary style) | [statement](03_Problems/02_Medium/03_minimum_score_triangulation.md) | [solution](03_Problems/solutions/03_minimum_score_triangulation.js) |
| 04 | Palindrome Partitioning II | Hard | interval table + 1D DP | [statement](03_Problems/03_Hard/04_palindrome_partitioning_ii.md) | [solution](03_Problems/solutions/04_palindrome_partitioning_ii.js) |
| 05 | Minimum Cost to Cut a Stick | Hard | sentinels + split on cut | [statement](03_Problems/03_Hard/05_minimum_cost_to_cut_a_stick.md) | [solution](03_Problems/solutions/05_minimum_cost_to_cut_a_stick.js) |
| 06 | Burst Balloons | Hard | "last operation" trick | [statement](03_Problems/03_Hard/06_burst_balloons.md) | [solution](03_Problems/solutions/06_burst_balloons.js) |
| 07 | Strange Printer | Hard | merge equal ends | [statement](03_Problems/03_Hard/07_strange_printer.md) | [solution](03_Problems/solutions/07_strange_printer.js) |
| 08 | Remove Boxes | Hard | 3D interval state (l, r, k) | [statement](03_Problems/03_Hard/08_remove_boxes.md) | [solution](03_Problems/solutions/08_remove_boxes.js) |

