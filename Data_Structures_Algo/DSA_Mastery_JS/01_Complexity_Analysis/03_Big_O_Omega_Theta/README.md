# Big O, Omega, Theta (and Recurrences)

The precise layer on top of [Time Complexity](../01_Time_Complexity/README.md): formal definitions of O, Ω and Θ with intuition, the difference between best/average/worst *case* and upper/lower *bounds*, tight vs loose bounds, a growth table with concrete n, a logarithm refresher, and recurrences solved with recursion trees and the master theorem. Every exercise is an original "analyze this code" problem whose solution file contains the code, a step counter, and a closed form that is asserted equal to the counted steps, plus a doubling-ratio check of the growth rate.

**Prerequisites:** [Time Complexity](../01_Time_Complexity/README.md), [Space Complexity](../02_Space_Complexity/README.md), [Recursion Fundamentals](../../00_Foundations/03_Recursion_Fundamentals/README.md), [Mathematics for DSA](../../00_Foundations/04_Mathematics_For_DSA/README.md).

**Next / see also:** [Amortized Analysis](../04_Amortized_Analysis/README.md), [Divide and Conquer](../../30_Divide_And_Conquer/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/big_o_omega_theta.test.js` (from this folder), or `npm run test:topic 01_Complexity_Analysis` from the curriculum root to run the whole parent topic.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | formal definitions, cases vs bounds, tight vs loose, growth table, logarithms, recurrences, recursion trees, master theorem, analyzing recursive code, empirical step counting |
| [02_Implementations](02_Implementations) | `growth.js` |
| [03_Problems](03_Problems) | 9 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests) | node:test suites for the implementations and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Dependent Nested Loops | Easy | arithmetic series | [statement](03_Problems/01_Easy/01_dependent_nested_loops.md) | [solution](03_Problems/solutions/01_dependent_nested_loops.js) |
| 02 | Halving Loop | Easy | logarithmic loop | [statement](03_Problems/01_Easy/02_halving_loop.md) | [solution](03_Problems/solutions/02_halving_loop.js) |
| 03 | Square-Root Loop and Trial Division | Easy | √n loop, best vs worst case | [statement](03_Problems/01_Easy/03_sqrt_loop_trial_division.md) | [solution](03_Problems/solutions/03_sqrt_loop_trial_division.js) |
| 04 | Doubling Inner Loop | Medium | Σ log i | [statement](03_Problems/02_Medium/04_doubling_inner_loop.md) | [solution](03_Problems/solutions/04_doubling_inner_loop.js) |
| 05 | Harmonic Loop | Medium | harmonic series | [statement](03_Problems/02_Medium/05_harmonic_loop.md) | [solution](03_Problems/solutions/05_harmonic_loop.js) |
| 06 | Divide in Two, Linear Merge | Medium | master theorem case 2 | [statement](03_Problems/02_Medium/06_divide_two_linear_merge.md) | [solution](03_Problems/solutions/06_divide_two_linear_merge.js) |
| 07 | Three Half-Size Calls | Medium | master theorem case 1 | [statement](03_Problems/02_Medium/07_three_half_calls.md) | [solution](03_Problems/solutions/07_three_half_calls.js) |
| 08 | Root-Dominated Recursion | Medium | master theorem case 3 | [statement](03_Problems/02_Medium/08_root_dominated_recursion.md) | [solution](03_Problems/solutions/08_root_dominated_recursion.js) |
| 09 | Fibonacci Call Tree | Hard | subtract-and-conquer recurrence, induction | [statement](03_Problems/03_Hard/09_fibonacci_call_tree.md) | [solution](03_Problems/solutions/09_fibonacci_call_tree.js) |
