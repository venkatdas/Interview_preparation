# Meet in the Middle

**Meet in the middle** is how you beat a 2^n brute force when n is around 40. You can't try all
2^40 ≈ 10^12 subsets. But you *can* split the input into two halves of 20, list every subset of
each half (2^20 ≈ 10^6 each), and then combine the two lists cleverly with sorting + binary search,
two pointers, or a hash map. The total work drops from 2^n to about 2^(n/2): from "never finishes"
to "well under a second".

**Prerequisites:** [Backtracking](../13_Backtracking/README.md) (enumerating subsets),
[Bit Manipulation](../14_Bit_Manipulation/README.md) (bitmasks),
[Searching](../10_Searching/README.md) (binary search, lower bound),
[Two Pointers](../06_Two_Pointers/README.md), [Hashing](../05_Hashing/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open [02_Implementations/meet_in_the_middle.js](02_Implementations/meet_in_the_middle.js) and run it: `node 02_Implementations/meet_in_the_middle.js`. Then close it and re-implement `sortedSubsetSums` and `countPairsAtMost` from memory.
3. Solve the problems in order: Medium, then Hard (this topic has no Easy problems, since the technique itself is an optimization on top of brute force). Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and work through the mastery checklist.
5. Run this topic's tests: `node --test tests/meet_in_the_middle.test.js` (or `npm run test:topic 32_Meet_In_The_Middle` from the curriculum root).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | the idea, the n ≈ 40 rule, the three ways to combine halves, size-constrained variants, pitfalls |
| [02_Implementations](02_Implementations) | `meet_in_the_middle.js`: half subset sums (plain, sorted by merging, grouped by size), pair counting/closest helpers |
| [03_Problems](03_Problems) | 6 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suite for the implementation and solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | 4Sum II | Medium | split 4 arrays into 2 + 2, hash combine | [statement](03_Problems/02_Medium/01_four_sum_ii.md) | [solution](03_Problems/solutions/01_four_sum_ii.js) |
| 02 | Subset Sum Count ≤ Target (n = 40) | Medium | sorted half sums + two pointers | [statement](03_Problems/02_Medium/02_subset_sum_count_at_most.md) | [solution](03_Problems/solutions/02_subset_sum_count_at_most.js) |
| 03 | Equal-Sum Split | Medium | signed sums + hash | [statement](03_Problems/02_Medium/03_equal_sum_split.md) | [solution](03_Problems/solutions/03_equal_sum_split.js) |
| 04 | Closest Subsequence Sum | Hard | half sums + binary search | [statement](03_Problems/03_Hard/04_closest_subsequence_sum.md) | [solution](03_Problems/solutions/04_closest_subsequence_sum.js) |
| 05 | Partition Array Into Two Arrays to Minimize Sum Difference | Hard | sums grouped by size + binary search | [statement](03_Problems/03_Hard/05_partition_min_sum_difference.md) | [solution](03_Problems/solutions/05_partition_min_sum_difference.js) |
| 06 | Split Array With Same Average | Hard | shift by average, zero-sum subset, hash set | [statement](03_Problems/03_Hard/06_split_array_same_average.md) | [solution](03_Problems/solutions/06_split_array_same_average.js) |
