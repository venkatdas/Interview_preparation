# Grid DP

**Grid DP** is dynamic programming where the state is a cell `(row, col)` and moves are restricted (usually right and down), so each cell depends only on a couple of earlier neighbours. It covers counting paths, cheapest paths, squares of ones, reverse DP (Dungeon Game) and two-walker DP (Cherry Pickup).

**Prerequisites:** [1D DP](../01_One_Dimensional_DP/README.md), the [DP overview](../01_Concepts/OVERVIEW.md) (5-step framework), and [Matrix And Multidimensional Arrays](../../09_Matrix_And_Multidimensional_Arrays/README.md).

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. This sub-topic has no separate implementation file: the reusable DP helpers live in [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) and the big-picture guide is [../01_Concepts/OVERVIEW.md](../01_Concepts/OVERVIEW.md). Every solution file shows brute force → memo → tabulation → optimized.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 29_Dynamic_Programming/04_Grid_DP/tests/grid_dp.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) | shared DP framework (memo / tabulation helpers) used by all DP sub-topics |
| [03_Problems](03_Problems) | 10 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `grid_dp.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Unique Paths | Medium | count paths | [statement](03_Problems/02_Medium/01_unique_paths.md) | [solution](03_Problems/solutions/01_unique_paths.js) |
| 02 | Unique Paths II | Medium | count paths + obstacles | [statement](03_Problems/02_Medium/02_unique_paths_ii.md) | [solution](03_Problems/solutions/02_unique_paths_ii.js) |
| 03 | Minimum Path Sum | Medium | best path + reconstruction | [statement](03_Problems/02_Medium/03_minimum_path_sum.md) | [solution](03_Problems/solutions/03_minimum_path_sum.js) |
| 04 | Triangle | Medium | row-by-row, bottom-up | [statement](03_Problems/02_Medium/04_triangle.md) | [solution](03_Problems/solutions/04_triangle.js) |
| 05 | Minimum Falling Path Sum | Medium | row-by-row, 3 parents | [statement](03_Problems/02_Medium/05_minimum_falling_path_sum.md) | [solution](03_Problems/solutions/05_minimum_falling_path_sum.js) |
| 06 | Count Square Submatrices with All Ones | Medium | square ending at (i, j) | [statement](03_Problems/02_Medium/06_count_square_submatrices.md) | [solution](03_Problems/solutions/06_count_square_submatrices.js) |
| 07 | Maximal Square | Medium | square ending at (i, j) | [statement](03_Problems/02_Medium/07_maximal_square.md) | [solution](03_Problems/solutions/07_maximal_square.js) |
| 08 | Longest Increasing Path in a Matrix | Hard | memo DFS over a value-DAG | [statement](03_Problems/03_Hard/08_longest_increasing_path_in_matrix.md) | [solution](03_Problems/solutions/08_longest_increasing_path_in_matrix.js) |
| 09 | Dungeon Game | Hard | reverse DP | [statement](03_Problems/03_Hard/09_dungeon_game.md) | [solution](03_Problems/solutions/09_dungeon_game.js) |
| 10 | Cherry Pickup | Hard | two walkers, 3D state | [statement](03_Problems/03_Hard/10_cherry_pickup.md) | [solution](03_Problems/solutions/10_cherry_pickup.js) |

