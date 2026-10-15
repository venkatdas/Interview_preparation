# Recursion Fundamentals

Recursion is how trees, DFS, divide and conquer, backtracking and dynamic programming are written, so it gets its own foundation topic. You will learn to pick a base case, trust the recursive call (the leap of faith), read a call stack trace and a recursion tree, measure Node's real stack-depth limit, see that tail calls are NOT optimized in V8, and escape the limit with an explicit stack or a trampoline. All exercises are original.

**Prerequisites:** [JavaScript for DSA](../01_JavaScript_For_DSA/README.md), [Programming Fundamentals](../02_Programming_Fundamentals/README.md). Helpful: [Mathematics for DSA](../04_Mathematics_For_DSA/README.md).

**Next / see also:** [Backtracking](../../13_Backtracking/README.md), [Divide and Conquer](../../30_Divide_And_Conquer/README.md), [Dynamic Programming overview](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md), [Big O, Omega, Theta](../../01_Complexity_Analysis/03_Big_O_Omega_Theta/README.md) (recurrences)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/recursion_fundamentals.test.js` (from this folder), or `npm run test:topic 00_Foundations` from the curriculum root to run the whole parent topic.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | base case and leap of faith, call stack trace, recursion trees, stack depth limit in Node, tail calls (not optimized in V8), explicit-stack conversion, trampolines, memoization, mistakes and interview talk track |
| [02_Implementations](02_Implementations) | `recursion_basics.js`, `stack_depth.js` |
| [03_Problems](03_Problems) | 8 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests) | node:test suites for the implementations and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Sum of Digits | Easy | linear recursion | [statement](03_Problems/01_Easy/01_sum_of_digits.md) | [solution](03_Problems/solutions/01_sum_of_digits.js) |
| 02 | Recursive Palindrome | Easy | two-index recursion | [statement](03_Problems/01_Easy/02_recursive_palindrome.md) | [solution](03_Problems/solutions/02_recursive_palindrome.js) |
| 03 | Reverse an Array Recursively | Easy | two-index recursion, in place | [statement](03_Problems/01_Easy/03_reverse_array_recursive.md) | [solution](03_Problems/solutions/03_reverse_array_recursive.js) |
| 04 | Modular Power | Medium | halving recursion | [statement](03_Problems/02_Medium/04_modular_power.md) | [solution](03_Problems/solutions/04_modular_power.js) |
| 05 | Count Paths in a Small Grid | Medium | recursion tree + memoization | [statement](03_Problems/02_Medium/05_grid_paths.md) | [solution](03_Problems/solutions/05_grid_paths.js) |
| 06 | Binary Strings Without Adjacent Ones | Medium | generate with pruning | [statement](03_Problems/02_Medium/06_binary_strings_no_adjacent_ones.md) | [solution](03_Problems/solutions/06_binary_strings_no_adjacent_ones.js) |
| 07 | Depth-Weighted Deep Sum | Medium | nested recursion → explicit stack | [statement](03_Problems/02_Medium/07_depth_weighted_sum.md) | [solution](03_Problems/solutions/07_depth_weighted_sum.js) |
| 08 | Tower of Hanoi, Iteratively | Hard | general recursion → frame stack | [statement](03_Problems/03_Hard/08_hanoi_explicit_stack.md) | [solution](03_Problems/solutions/08_hanoi_explicit_stack.js) |
