# Geometric Algorithms

**Prerequisites:** [Foundations/04 Mathematics For DSA](../00_Foundations/04_Mathematics_For_DSA/README.md), [Sorting](../11_Sorting/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 39_Geometric_Algorithms/tests/geometry.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `geometry.js` |
| [03_Problems](03_Problems) | 7 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `geometry.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Rectangle Overlap | Easy | interval overlap per axis | [statement](03_Problems/01_Easy/01_rectangle_overlap.md) | [solution](03_Problems/solutions/01_rectangle_overlap.js) |
| 02 | Rectangle Area | Medium | inclusion-exclusion | [statement](03_Problems/02_Medium/02_rectangle_area.md) | [solution](03_Problems/solutions/02_rectangle_area.js) |
| 03 | Valid Square | Medium | six squared distances | [statement](03_Problems/02_Medium/03_valid_square.md) | [solution](03_Problems/solutions/03_valid_square.js) |
| 04 | K Closest Points to Origin | Medium | squared distance + quickselect | [statement](03_Problems/02_Medium/04_k_closest_points_to_origin.md) | [solution](03_Problems/solutions/04_k_closest_points_to_origin.js) |
| 05 | Minimum Area Rectangle | Medium | diagonal pairs + Set | [statement](03_Problems/02_Medium/05_minimum_area_rectangle.md) | [solution](03_Problems/solutions/05_minimum_area_rectangle.js) |
| 06 | Max Points on a Line | Hard | normalised direction keys per anchor | [statement](03_Problems/03_Hard/06_max_points_on_a_line.md) | [solution](03_Problems/solutions/06_max_points_on_a_line.js) |
| 07 | Erect the Fence | Hard | convex hull (monotone chain, keep collinear) | [statement](03_Problems/03_Hard/07_erect_the_fence.md) | [solution](03_Problems/solutions/07_erect_the_fence.js) |

