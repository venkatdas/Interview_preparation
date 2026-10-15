# Bit Manipulation

**Prerequisites:** [Foundations/05 Bitwise Fundamentals](../00_Foundations/05_Bitwise_Fundamentals/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 14_Bit_Manipulation` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `bit_utils.js` |
| [03_Problems](03_Problems) | 18 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Single Number | Easy | XOR cancel pairs | [statement](03_Problems/01_Easy/01_single_number.md) | [solution](03_Problems/solutions/01_single_number.js) |
| 02 | Number of 1 Bits | Easy | Kernighan | [statement](03_Problems/01_Easy/02_number_of_1_bits.md) | [solution](03_Problems/solutions/02_number_of_1_bits.js) |
| 03 | Power of Two | Easy | n & (n-1) | [statement](03_Problems/01_Easy/03_power_of_two.md) | [solution](03_Problems/solutions/03_power_of_two.js) |
| 04 | Missing Number | Easy | XOR indices and values | [statement](03_Problems/01_Easy/04_missing_number.md) | [solution](03_Problems/solutions/04_missing_number.js) |
| 05 | Hamming Distance | Easy | popcount(a ^ b) | [statement](03_Problems/01_Easy/05_hamming_distance.md) | [solution](03_Problems/solutions/05_hamming_distance.js) |
| 06 | Counting Bits | Easy | dp[i] = dp[i >> 1] + (i & 1) | [statement](03_Problems/01_Easy/06_counting_bits.md) | [solution](03_Problems/solutions/06_counting_bits.js) |
| 07 | Reverse Bits | Easy | bit-by-bit with >>> | [statement](03_Problems/01_Easy/07_reverse_bits.md) | [solution](03_Problems/solutions/07_reverse_bits.js) |
| 08 | Minimum Flips to Make a OR b Equal to c | Medium | per-bit case analysis | [statement](03_Problems/02_Medium/08_minimum_flips_a_or_b_equal_c.md) | [solution](03_Problems/solutions/08_minimum_flips_a_or_b_equal_c.js) |
| 09 | Single Number II | Medium | count bits mod 3 | [statement](03_Problems/02_Medium/09_single_number_ii.md) | [solution](03_Problems/solutions/09_single_number_ii.js) |
| 10 | Single Number III | Medium | split by lowest set bit | [statement](03_Problems/02_Medium/10_single_number_iii.md) | [solution](03_Problems/solutions/10_single_number_iii.js) |
| 11 | Sum of Two Integers | Medium | XOR + carry | [statement](03_Problems/02_Medium/11_sum_of_two_integers.md) | [solution](03_Problems/solutions/11_sum_of_two_integers.js) |
| 12 | Total Hamming Distance | Medium | count per bit column | [statement](03_Problems/02_Medium/12_total_hamming_distance.md) | [solution](03_Problems/solutions/12_total_hamming_distance.js) |
| 13 | Bitwise AND of Numbers Range | Medium | common prefix | [statement](03_Problems/02_Medium/13_bitwise_and_of_numbers_range.md) | [solution](03_Problems/solutions/13_bitwise_and_of_numbers_range.js) |
| 14 | Subsets | Medium | enumerate masks | [statement](03_Problems/02_Medium/14_subsets_bitmask.md) | [solution](03_Problems/solutions/14_subsets_bitmask.js) |
| 15 | Maximum XOR of Two Numbers in an Array | Medium | bit-by-bit greedy + set | [statement](03_Problems/02_Medium/15_maximum_xor_of_two_numbers.md) | [solution](03_Problems/solutions/15_maximum_xor_of_two_numbers.js) |
| 16 | Find the Duplicate Number | Medium | bit counting | [statement](03_Problems/02_Medium/16_find_the_duplicate_number.md) | [solution](03_Problems/solutions/16_find_the_duplicate_number.js) |
| 17 | UTF-8 Validation | Medium | leading-bit masks | [statement](03_Problems/02_Medium/17_utf8_validation.md) | [solution](03_Problems/solutions/17_utf8_validation.js) |
| 18 | Divide Two Integers | Medium | shift-and-subtract | [statement](03_Problems/02_Medium/18_divide_two_integers.md) | [solution](03_Problems/solutions/18_divide_two_integers.js) |

