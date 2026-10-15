# DP Optimizations (prefix sums, monotonic deque, binary search, D&C, Knuth, convex hull trick, bitsets)

**Level: Advanced.** You already know how to write a correct DP; this topic is about what to do when that correct DP is **too slow**. Almost every speed-up here attacks the same spot: the *transition* (the inner loop that looks at many earlier states). If that inner loop is a range sum, a sliding-window max, a search in sorted data, or a minimum over lines, there is a known trick that turns it into O(1) or O(log n).

**How often does this appear in interviews?**

| Technique | Frequency in interviews |
|---|---|
| Prefix-sum transition, monotonic deque DP, binary search inside DP (LIS, job scheduling) | **Occasionally** — mostly hard rounds at top-tier companies (Google, Meta, quant/HFT). Worth mastering. |
| Space optimization (rolling arrays) | **Common** as a follow-up ("can you do it in O(n) memory?"). |
| Bitmask DP | **Occasional** (n <= 20 assignment / TSP style questions). |
| Divide & conquer optimization, Knuth optimization, convex hull trick / Li Chao tree, bitset speed-ups | **Rare** — essentially competitive programming. Know the idea and how to recognise it; you will almost never be asked to code it in a 45-minute interview. |

**Prerequisites:** [Dynamic Programming — 1D](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md), [Interval DP](../../29_Dynamic_Programming/05_Interval_DP/README.md), [Advanced DP](../../29_Dynamic_Programming/06_Advanced_DP/README.md), [Monotonic Stacks and Queues](../../18_Monotonic_Stacks_And_Queues/README.md), [Searching (binary search)](../../10_Searching/README.md), [Prefix Sums](../../08_Prefix_Sums_And_Difference_Arrays/README.md), [Bit Manipulation](../../14_Bit_Manipulation/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips). Sections marked *Essential* first; *Advanced (rare)* sections on a second pass.
2. Open [02_Implementations/dp_optimizations.js](02_Implementations/dp_optimizations.js) and run it: `node 02_Implementations/dp_optimizations.js`. Every optimized function has a slow twin; re-implement the fast one from memory and let the self-test check you.
3. Solve the problems in order: Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/dp_optimizations.test.js` (from this folder).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | when a DP is too slow, prefix-sum / deque / binary-search transitions, D&C and Knuth optimizations, convex hull trick and Li Chao tree, bitset and bitmask speed-ups, space optimization |
| [02_Implementations](02_Implementations) | `dp_optimizations.js` (every technique with a brute-force twin and randomized self-test) |
| [03_Problems](03_Problems) | 7 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suite for the implementation and solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Jump Game VI | Medium | monotonic deque over dp | [statement](03_Problems/02_Medium/01_jump_game_vi.md) | [solution](03_Problems/solutions/01_jump_game_vi.js) |
| 02 | Number of Ways to Reach the Target | Medium | prefix-sum transition | [statement](03_Problems/02_Medium/02_number_of_ways_prefix_sum.md) | [solution](03_Problems/solutions/02_number_of_ways_prefix_sum.js) |
| 03 | Constrained Subsequence Sum | Hard | monotonic deque over dp (with restart) | [statement](03_Problems/03_Hard/03_constrained_subsequence_sum.md) | [solution](03_Problems/solutions/03_constrained_subsequence_sum.js) |
| 04 | Maximum Profit in Job Scheduling | Hard | sort + binary search inside DP | [statement](03_Problems/03_Hard/04_maximum_profit_job_scheduling.md) | [solution](03_Problems/solutions/04_maximum_profit_job_scheduling.js) |
| 05 | Split Array into K Parts Minimizing the Sum of Squares | Hard | divide & conquer optimization | [statement](03_Problems/03_Hard/05_split_array_min_sum_of_squares.md) | [solution](03_Problems/solutions/05_split_array_min_sum_of_squares.js) |
| 06 | Frog Jump with Quadratic Cost | Hard | convex hull trick | [statement](03_Problems/03_Hard/06_frog_jump_quadratic_cost.md) | [solution](03_Problems/solutions/06_frog_jump_quadratic_cost.js) |
| 07 | Minimum Cost to Merge Stones | Hard | interval DP, Knuth for K = 2 | [statement](03_Problems/03_Hard/07_minimum_cost_to_merge_stones.md) | [solution](03_Problems/solutions/07_minimum_cost_to_merge_stones.js) |
