# Matrix and Multidimensional Arrays

**Prerequisites:** [Arrays](../03_Arrays/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 09_Matrix_And_Multidimensional_Arrays` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `matrix_utils.js` |
| [03_Problems](03_Problems) | 16 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Transpose Matrix | Easy | index swap | [statement](03_Problems/01_Easy/01_transpose_matrix.md) | [solution](03_Problems/solutions/01_transpose_matrix.js) |
| 02 | Matrix Diagonal Sum | Easy | diagonal indices | [statement](03_Problems/01_Easy/02_matrix_diagonal_sum.md) | [solution](03_Problems/solutions/02_matrix_diagonal_sum.js) |
| 03 | Toeplitz Matrix | Easy | compare with up-left neighbour | [statement](03_Problems/01_Easy/03_toeplitz_matrix.md) | [solution](03_Problems/solutions/03_toeplitz_matrix.js) |
| 04 | Reshape the Matrix | Easy | 1D index <-> 2D index | [statement](03_Problems/01_Easy/04_reshape_the_matrix.md) | [solution](03_Problems/solutions/04_reshape_the_matrix.js) |
| 05 | Pascal's Triangle | Easy | build row from previous | [statement](03_Problems/01_Easy/05_pascals_triangle.md) | [solution](03_Problems/solutions/05_pascals_triangle.js) |
| 06 | Rotate Image | Medium | transpose + reverse (in place) | [statement](03_Problems/02_Medium/06_rotate_image.md) | [solution](03_Problems/solutions/06_rotate_image.js) |
| 07 | Spiral Matrix | Medium | shrinking bounds | [statement](03_Problems/02_Medium/07_spiral_matrix.md) | [solution](03_Problems/solutions/07_spiral_matrix.js) |
| 08 | Spiral Matrix II | Medium | shrinking bounds (fill) | [statement](03_Problems/02_Medium/08_spiral_matrix_ii.md) | [solution](03_Problems/solutions/08_spiral_matrix_ii.js) |
| 09 | Set Matrix Zeroes | Medium | first row/col as flags | [statement](03_Problems/02_Medium/09_set_matrix_zeroes.md) | [solution](03_Problems/solutions/09_set_matrix_zeroes.js) |
| 10 | Search a 2D Matrix II | Medium | staircase search | [statement](03_Problems/02_Medium/10_search_2d_matrix_ii.md) | [solution](03_Problems/solutions/10_search_2d_matrix_ii.js) |
| 11 | Diagonal Traverse | Medium | r + c diagonals, alternate | [statement](03_Problems/02_Medium/11_diagonal_traverse.md) | [solution](03_Problems/solutions/11_diagonal_traverse.js) |
| 12 | Valid Sudoku | Medium | row/col/box sets | [statement](03_Problems/02_Medium/12_valid_sudoku.md) | [solution](03_Problems/solutions/12_valid_sudoku.js) |
| 13 | Game of Life | Medium | in-place extra states | [statement](03_Problems/02_Medium/13_game_of_life.md) | [solution](03_Problems/solutions/13_game_of_life.js) |
| 14 | Number of Islands | Medium | grid DFS / flood fill | [statement](03_Problems/02_Medium/14_number_of_islands.md) | [solution](03_Problems/solutions/14_number_of_islands.js) |
| 15 | Word Search | Medium | grid backtracking | [statement](03_Problems/02_Medium/15_word_search.md) | [solution](03_Problems/solutions/15_word_search.js) |
| 16 | Kth Smallest Element in a Sorted Matrix | Medium | binary search on value | [statement](03_Problems/02_Medium/16_kth_smallest_in_sorted_matrix.md) | [solution](03_Problems/solutions/16_kth_smallest_in_sorted_matrix.js) |

