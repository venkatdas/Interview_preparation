# Number Theory

Number theory is the math of whole numbers: divisibility, primes, gcd, and arithmetic "mod m".
It powers every "return the answer modulo 1e9 + 7" problem, prime and divisor questions, gcd
reachability puzzles, and the modular inverses that combinatorics and probability need. This topic
starts where [Mathematics for DSA](../00_Foundations/04_Mathematics_For_DSA/README.md) stops (gcd/lcm,
fast pow, the basic sieve, nCr, digit tricks) and goes deeper: smallest-prime-factor and segmented
sieves, Euler's totient, extended Euclid, modular inverses, the JavaScript **2^53 trap** in modular
multiplication, the Chinese Remainder Theorem and Miller–Rabin with BigInt.

**Prerequisites:** [Mathematics for DSA](../00_Foundations/04_Mathematics_For_DSA/README.md), [Hashing](../05_Hashing/README.md), [Searching](../10_Searching/README.md)

**Next:** [Combinatorics](../37_Combinatorics/README.md) (uses modular inverses for nCr mod p), [Probability and Randomization](../38_Probability_And_Randomization/README.md)

## Essential vs Advanced

| Level | Content |
|---|---|
| **Essential** (interviews) | divisibility rules, trial-division factorization, optimized sieve, spf sieve, divisor count/sum, gcd/Bezout, modular inverse via Fermat, exact mulMod/powMod in JS (2^53 trap), trailing zeros of n!, base conversion |
| **Advanced** (competitive programming) | segmented sieve, Euler's totient and exponent reduction, extended Euclid details, inverse tables and batch inversion, Chinese Remainder Theorem (non-coprime), Miller–Rabin with BigInt, trailing zeros in any base, negative bases |

Sections in [CONCEPTS.md](01_Concepts/CONCEPTS.md) are tagged **[Essential]** or **[Advanced — competitive programming]**.

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom. Do the Essential sections first; come back for Advanced ones.
2. Open [02_Implementations/number_theory.js](02_Implementations/number_theory.js) and run it: `node 02_Implementations/number_theory.js`. Read the 2^53 demonstration in the self-test. Then close it and re-implement gcd, extendedGcd, mulMod, powMod and the spf sieve from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer [INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take [QUIZ.md](04_Interview_And_Assessment/QUIZ.md) and tick the mastery checklist only when you meet it.
5. Run this topic's tests: `npm run test:topic 36_Number_Theory` (from the curriculum root), or `node --test 36_Number_Theory/tests/number_theory.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | the 16-step teaching guide: intuition, visuals, factorization, sieves, totient, extended Euclid, inverses, exact modular multiplication, CRT, Miller–Rabin, base conversion, complexity, mistakes, patterns, interview talk track |
| [02_Implementations](02_Implementations) | `number_theory.js` — every algorithm with a randomized self-test |
| [03_Problems](03_Problems) | 11 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions with model answers, and a self-assessment quiz |
| [tests](tests) | `number_theory.test.js` node:test suite |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Ugly Number | Easy | divide out allowed primes | [statement](03_Problems/01_Easy/01_ugly_number.md) | [solution](03_Problems/solutions/01_ugly_number.js) |
| 02 | Count Primes (odd-only sieve) | Medium | optimized sieve | [statement](03_Problems/02_Medium/02_count_primes.md) | [solution](03_Problems/solutions/02_count_primes.js) |
| 03 | Four Divisors | Medium | spf sieve + divisor formula | [statement](03_Problems/02_Medium/03_four_divisors.md) | [solution](03_Problems/solutions/03_four_divisors.js) |
| 04 | Fraction to Recurring Decimal | Medium | remainder cycle | [statement](03_Problems/02_Medium/04_fraction_to_recurring_decimal.md) | [solution](03_Problems/solutions/04_fraction_to_recurring_decimal.js) |
| 05 | Water and Jug Problem | Medium | Bezout / gcd | [statement](03_Problems/02_Medium/05_water_and_jug_problem.md) | [solution](03_Problems/solutions/05_water_and_jug_problem.js) |
| 06 | Closest Prime Numbers in Range | Medium | sieve + adjacent scan | [statement](03_Problems/02_Medium/06_closest_prime_numbers_in_range.md) | [solution](03_Problems/solutions/06_closest_prime_numbers_in_range.js) |
| 07 | Smallest Value After Replacing With Sum of Prime Factors | Medium | spf sieve | [statement](03_Problems/02_Medium/07_smallest_value_after_replacing_with_sum_of_prime_factors.md) | [solution](03_Problems/solutions/07_smallest_value_after_replacing_with_sum_of_prime_factors.js) |
| 08 | Super Pow | Medium | powMod, Horner on exponent | [statement](03_Problems/02_Medium/08_super_pow.md) | [solution](03_Problems/solutions/08_super_pow.js) |
| 09 | Prime Palindrome | Medium | divisibility by 11 + generation | [statement](03_Problems/02_Medium/09_prime_palindrome.md) | [solution](03_Problems/solutions/09_prime_palindrome.js) |
| 10 | Modular Inverse Table (Original, Advanced) | Medium | inverse recurrence / batch inversion | [statement](03_Problems/02_Medium/10_modular_inverse_table.md) | [solution](03_Problems/solutions/10_modular_inverse_table.js) |
| 11 | Nth Magical Number | Hard | binary search + inclusion–exclusion | [statement](03_Problems/03_Hard/11_nth_magical_number.md) | [solution](03_Problems/solutions/11_nth_magical_number.js) |
