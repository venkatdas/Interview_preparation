# Amortized Analysis

Why `push` is O(1) even though it sometimes copies the whole array, why a queue built from two stacks is fast, why a monotonic stack with a `while` inside a `for` is still linear, and why hash tables and union-find stay fast as they grow. You will learn the aggregate, accounting (banker's) and potential methods in plain language, and every claim is backed by instrumented implementations whose self-tests assert that total work stays below c·n for random and adversarial operation sequences.

**Prerequisites:** [Time Complexity](../01_Time_Complexity/README.md), [Big O, Omega, Theta](../03_Big_O_Omega_Theta/README.md).

**Next / see also:** [Stacks](../../16_Stacks/README.md), [Monotonic Stacks and Queues](../../18_Monotonic_Stacks_And_Queues/README.md), [Hashing](../../05_Hashing/README.md), [Union-Find](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/amortized_analysis.test.js` (from this folder), or `npm run test:topic 01_Complexity_Analysis` from the curriculum root to run the whole parent topic.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | aggregate, accounting and potential methods; dynamic arrays (growth and shrink rules), two-stack queue, hash table resizing, monotonic stack, binary counter, union-find; mistakes and interview talk track |
| [02_Implementations](02_Implementations) | `amortized_algorithms.js`, `amortized_structures.js` |
| [03_Problems](03_Problems) | 5 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests) | node:test suites for the implementations and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Binary Counter Bit Flips | Easy | aggregate + potential | [statement](03_Problems/01_Easy/01_binary_counter_flips.md) | [solution](03_Problems/solutions/01_binary_counter_flips.js) |
| 02 | Two-Stack Queue Move Count | Easy | accounting method, lazy transfer | [statement](03_Problems/01_Easy/02_queue_two_stacks_moves.md) | [solution](03_Problems/solutions/02_queue_two_stacks_moves.js) |
| 03 | Growth Policy Copy Count | Medium | geometric vs arithmetic growth | [statement](03_Problems/02_Medium/03_growth_policy_copies.md) | [solution](03_Problems/solutions/03_growth_policy_copies.js) |
| 04 | Shrink Policy Thrashing | Medium | adversarial sequences | [statement](03_Problems/02_Medium/04_shrink_policy_thrashing.md) | [solution](03_Problems/solutions/04_shrink_policy_thrashing.js) |
| 05 | Union-Find Step Budget | Hard | union by rank + path compression | [statement](03_Problems/03_Hard/05_union_find_step_budget.md) | [solution](03_Problems/solutions/05_union_find_step_budget.js) |
